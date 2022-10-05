import React, {Component} from "react";

import {Box, Button, Col, Row} from "adminlte-2-react";
import Moment from "react-moment";
import "moment/locale/es";
import Content from "../components/Content";
import Utils from "../commons/Utils";
import Storage from "../commons/Storage";
import {constantes} from "../commons/Constantes";
import DataTable from "../components/DataTable/DataTable";
import swal from "sweetalert";

import API from "../commons/http-common";
import Avatar from "../components/Avatar/Avatar";
import Badge from "../components/Badge/Badge";

class Quote extends Component {
    ws = new WebSocket(constantes.API_URL_WS + "/ws");

    constructor(props) {
        super(props);
        this.state = {
            quotes: null,
        };
        this.columns = [
            {title: "Nro Coti.", data: "id", export: true, class: "align-middle"},
            {
                title: "Fecha de Creación",
                data: "issue",
                export: true,
                class: "align-middle",
                render: (e) => <Moment title={e} format="DD/MM/YYYY HH:mm">{e}</Moment>
            },
            {
                title: "Fecha de Modificación",
                data: "editdate",
                export: true,
                class: "align-middle",
                render: (e) => e ? <Moment title={e} format="DD/MM/YYYY HH:mm">{e}</Moment> : ''
            },
            {
                title: "Vendedor", data: "seller", export: true, class: "align-middle",
                render: (e, d) => <Avatar src={d.seller_avatar} size={'2.6em'} title={e}/>
            },
            {
                title: "Cliente", data: "customer", export: true, class: "align-middle",
                render: (e, d) => {
                    return (
                        <>
                            <span>{d.customer}</span><br/>
                            <small className={"text-muted"}>{d.contact}</small>
                        </>
                    )
                }
            },
            {
                title: "Vehiculo", data: "productype", export: true, class: "align-middle",
                render: (e, d) => {
                    return (
                        <>
                            <span>Tipo: <small className={"text-muted"}>{d.productype}</small></span><br/>
                            <span>Serie: <small className={"text-muted"}>{d.serie}</small></span><br/>
                            <span>Placa: <small className={"text-muted"}>{d.plate}</small></span>
                        </>
                    )
                }
            },
            {title: "Tipo De Producto", data: "productype", export: true, visibility: false},
            {title: "Serie", data: "serie", export: true, visibility: false},
            {title: "N° Placa", data: "plate", export: true, visibility: false},
            {title: "Contacto", data: "contact", export: true, visibility: false},
            {
                title: "Total",
                data: "total",
                export: true,
                class: "align-middle",
                render: (e, d) => Utils.formatCurrency(d.total, d.currency),
            },
            {
                title: "Estado", data: "status", export: true, class: "align-middle",
                render: e => <Badge variant={Utils.getVariantOfStatus(e)}>{e}</Badge>
            },
            {
                title: "Acción",
                data: "action",
                sort: false,
                export: false,
                class: "align-middle",
                render: (e, d) => {
                    return (
                        <div style={{minWidth: "101px"}}>
                            <Button
                                disabled={!d.action.flow}
                                size={"xs"}
                                icon={"fa-truck"}
                                onClick={() => this.props.history.push(`/order/create?quoteid=${d.id}`)}
                            />
                            <Button
                                disabled={!d.action.view}
                                size={"xs"}
                                icon={"fa-eye"}
                                onClick={() => this.props.history.push(`/quote/${d.id}`)}
                            />
                            <Button
                                disabled={!d.action.edit}
                                size={"xs"}
                                icon={"fa-edit"}
                                onClick={() => this.props.history.push(`/quote/${d.id}/edit`)}
                            />
                            <Button
                                disabled={!d.action.drop}
                                size={"xs"}
                                icon={"fa-trash"}
                                onClick={this.handleDeleteQuote.bind(this, d.id)}
                            />
                        </div>
                    );
                },
            },
        ];
        this.handleDeleteQuote = this.handleDeleteQuote.bind(this);
    }

    handleDeleteQuote(id) {
        swal({
            icon: "warning",
            title: "Eliminar cotización",
            text: "Esta seguro de eliminar la Cotización #" + id + "?",
            dangerMode: true,
            buttons: ["Cancelar", "Eliminar"]
        }).then((evl) => {
            if (evl) return API.delete("quotes/" + id);
        }).then((res) => {
            if (res === undefined) return;
            this.ws.send("delete quote");
            swal("Exito!", " Se ha eliminado la Cotización #" + id, "success");
            const quotes = this.state.quotes.filter((quote) => quote.id !== id);
            this.setState({quotes: quotes});
        }).catch((err) => {
            swal("Error!", Utils.getMessageError(err), "error");
        });
    }

    componentWillMount() {
        let user = Storage.getUsername();
        let apiQuotes = "employee/" + user.employeeid + "/quotes";
        if (user.profile === "Administrador") {
            apiQuotes = "quotes";
        }
        API.get(apiQuotes)
            .then((res) => {
                const quotes = res;
                this.setState({quotes: quotes});
            })
            .catch((err) => {
                swal("Error!", Utils.getMessageError(err), "error");
            });
    }

    componentWillUnmount() {
        if (this.ws) this.ws.close();
    }

    render() {
        const validRenderComplete = () => {
            return true && this.state.quotes && true;
        };

        return (
            <Content
                title={"Cotización"}
                subTitle="Lista"
                loaded={validRenderComplete()}
            >
                <Box
                    header={
                        <Button
                            to={"quote/create"}
                            text={"Nueva Cotizacion"}
                            type={"danger"}
                            pullRight
                        />
                    }
                >
                    <Row>
                        <Col xs={12}>
                            <DataTable
                                name={"COTIZACION"}
                                columns={this.columns}
                                data={this.state.quotes}
                                messageNoRecords={"No existe ninguna cotizacion"}
                                showSearch={true}
                                sortTable={true}
                                showRowsLimit={true}
                                exportButton={true}
                                responsive
                                selectable
                            />
                        </Col>
                    </Row>
                </Box>
            </Content>
        );
    }
}

export default Quote;
