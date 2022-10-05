import React, {Component} from 'react';
import Storage from '../commons/Storage'
import {Box, Button, Col, Row} from "adminlte-2-react";
import Content from "../components/Content";
import Moment from "react-moment";
import Utils from "../commons/Utils";
import DataTable from "../components/DataTable/DataTable";
import {constantes} from '../commons/Constantes';
import swal from "sweetalert";
import API from "../commons/http-common";
import Axios from 'axios';
import Badge from "../components/Badge/Badge";

class Invoice extends Component {
    ws = new WebSocket(constantes.API_URL_WS + '/ws');

    constructor(props) {
        super(props);
        this.state = {
            invoices: null,
            notloading: true,
        };
        this.columns = [
            {
                title: 'Nro Fact', data: 'id', render: (e, d) => (
                    d.id.padStart(11, "F001-00000")
                )
            },
            {
                title: 'Fecha emision', data: 'issue', render: e => (
                    <Moment title={e} format="DD/MM/YYYY HH:mm">{e}</Moment>
                )
            },
            {title: 'Ruc cliente', data: 'docnum'},
            {title: 'Razon social', data: 'customer'},
            {title: 'Nro OT', data: 'quotation'},
            {
                title: 'Vehiculo', data: 'serie', render: (e, d) => {
                    return (
                        <>
                            <span>Serie: <small className={"text-muted"}>{d.serie}</small></span><br/>
                            <span>Placa: <small className={"text-muted"}>{d.plate}</small></span>
                        </>
                    )
                }
            },
            {
                title: 'Precio Total', data: 'precioneto', render: (e, d) =>
                    Utils.formatCurrency(d.precioneto, d.currency)
            },
            {
                title: 'Estado', data: 'status',
                render: e => <Badge variant={Utils.getVariantOfStatus(e)}>{e}</Badge>
            },
            {
                title: 'Acción', data: 'action', sort: false, render: (e, d) => (
                    <>
                        <Button disabled={!d.action.flow} size={'xs'} value={"emitir"} icon={'fa-truck'}
                                onClick={this.handleInvoiceToSunat.bind(this, d.id)}/>
                        <Button disabled={!d.action.view} size={'xs'} icon={'fa-eye'}
                                onClick={() => this.props.history.push(`/invoice/${d.id}`)}/>
                        <Button disabled={!d.action.edit} size={'xs'} icon={'fa-edit'}
                                onClick={() => this.props.history.push(`/invoice/${d.id}/edit`)}/>
                        <Button disabled={!d.action.drop} size={'xs'} icon={'fa-trash'} onClick={
                            d.status === "Registrado" ?
                                this.handleDeleteInvoice.bind(this, d.id)
                                :
                                this.handleCancelInvoice.bind(this, d.id)
                        }/>
                    </>)
            }
        ];
        this.handleDeleteInvoice = this.handleDeleteInvoice.bind(this);
        this.handleCancelInvoice = this.handleCancelInvoice.bind(this);
        this.handleInvoiceToSunat = this.handleInvoiceToSunat.bind(this);
    }

    handleCancelInvoice(id) {
        swal({
            icon: "warning",
            title: "Anular factura",
            text: "Esta seguro de anular la Factura #" + id + "?",
            dangerMode: true,
            buttons: ["Cancelar", "Anular"]
        }).then((evl) => {
            if (evl) alert("Necesita una nota de credito!")
        }).catch((err) => {
            swal("Error!", Utils.getMessageError(err), "error");
        });
    }

    handleDeleteInvoice(id) {
        swal({
            icon: "warning",
            title: "Eliminar factura",
            text: "Esta seguro de eliminar la Factura #" + id + "?",
            dangerMode: true,
            buttons: ["Cancelar", "Eliminar"]
        }).then((evl) => {
            if (evl) return API.delete("invoices/" + id);
        }).then((res) => {
            if (res === undefined) return;
            this.ws.send("delete invoice");
            swal("Exito!", " Se ha eliminado la Factura #" + id, "success");
            const invoices = this.state.invoices.filter((invoice) => invoice.id !== id);
            this.setState({invoices: invoices});
        }).catch((err) => {
            swal("Error!", Utils.getMessageError(err), "error");
        });
    }

    handleInvoiceToSunat(id) {
        let invoicid = parseInt(id)
        swal({
            title: "Emitir comprobante",
            text: "Esta seguro de emitir la Factura #" + id + " a la SUNAT?",
            icon: "warning",
            buttons: ["Cancelar", "Emitir"]
        }).then((evl) => {
            if (evl) {
                this.setState({notloading: false});
                return API.post("invoices/" + invoicid + "/sunat");
            }
        }).then(res => {
            if (res === undefined) return;
            swal("Exito!", "Se emitió con éxito la factura #" + id + " a la SUNAT", "success");
            this.setState({notloading: true});
            let user = Storage.getUsername();
            return API.get(user.profile === 'Administrador' ? 'invoices' : 'employee/' + user.employeeid + '/invoices');
        }).then(invoices => {
            if (invoices === undefined) return;
            this.setState({invoices: invoices});
        }).catch(err => {
            swal("Error!", Utils.getMessageError(err), "error");
            this.setState({notloading: true});
        });
    }

    componentWillMount() {
        let user = Storage.getUsername();
        let apiInvoices = 'employee/' + user.employeeid + '/invoices';
        let apiCertifys = 'employee/' + user.employeeid + '/certifys';

        if (user.profile === 'Administrador') {
            apiInvoices = "invoices";
            apiCertifys = "certifys"
        }
        Axios.all([
            API.get(apiInvoices),
            API.get(apiCertifys)
        ]).then(Axios.spread((...responses) => {
            const invoices = responses[0];
            this.setState({invoices: invoices});
        })).catch(err => {
            alert(constantes.ICON_UNICODE_ERROR + " " + Utils.getMessageError(err));
        });

    }

    render() {
        const validRenderComplete = () => {
            return true
                && this.state.invoices
                && true;
        };
        return (
            <Content title={"Factura"} subTitle="Lista" loader={this.state.notloading} loaded={validRenderComplete()}>
                <Box header={<Button
                    to={'invoice/create'}
                    text={'Nueva Factura'}
                    type={'danger'}
                    pullRight
                />}>
                    <Row>
                        <Col xs={12}>
                            <DataTable
                                name={"FACTURA"}
                                columns={this.columns}
                                data={this.state.invoices}
                                messageNoRecords={'No existe ninguna factura'}
                                showSearch={true}
                                sortTable={true}
                                showRowsLimit={true}
                                exportButton={false}
                                responsive
                            />
                        </Col>
                    </Row>
                </Box>
            </Content>);
    }
}

export default Invoice;
