import React, { Component } from 'react';
import Content from "../../components/Content";
import { Box, Col } from "adminlte-2-react";
import Moment from "react-moment";
import Utils from "../../commons/Utils";
import { constantes } from '../../commons/Constantes';
import API from "../../commons/http-common";
import '../../components/CustomTable.css';
import utils from '../../commons/Utils';
import './InvoiceView.css'

class invoiceView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invoice: {},
        };

    }
    componentWillMount() {
        const id = this.props.match.params.id;
        API.get("invoices/" + id).then(res => {
            this.setState({ invoice: res })
        }).catch(err => {
            alert(constantes.ICON_UNICODE_ERROR + " " + Utils.getMessageError(err));
            this.props.history.push("/invoice");
        });
    }
    render() {
        const id = this.props.match.params.id
        const breadCrumb = [
            { title: "Factura", link: "/invoice" },
            { title: id },
        ];
        const details = this.state.invoice.detail;
        const formatCurrency = this.state.invoice.currency;

        const currency = formatCurrency ? formatCurrency : 'PEN';
        //const namecurrency = currency === 'PEN' ? 'SOLES' : 'DOLARES'
        const formatter = new Intl.NumberFormat(currency === 'PEN' ? 'es-PE' : 'en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2
        });
        const convertCurrency = currency === 'PEN' ? 1 : 1 / localStorage.getItem('dollarPrice');

        const price = details ? details.map(d => d.quantity * d.unitvalue).reduce((a, b) => a + b) : null * convertCurrency;
        const igv = price * 0.18;
        const total = price + igv;
        const validRenderComplete = () => {
            return true
                && this.state.invoice.id >= 0
                && true;
        };
        return (<Content title={"Factura"} subTitle="Detalle" breadCrumb={breadCrumb} loaded={validRenderComplete()}>
            <Box solid>
                <Col md={12}>
                    <br/>
                </Col>
                <Col md={8} />
                <Col md={4}>
                    <div className="box-invoice">
                        <h3>
                            <strong>FACTURA ELECTRÓNICA</strong>
                        </h3>
                        <h4>
                            <span>RUC 10100342605</span>
                        </h4>
                        <h4>
                            <span>{utils.getFormatInvoice(this.state.invoice.id)}</span>
                        </h4>
                    </div>
                </Col>
                <Col md={12}>
                    <h4><strong>BODYWORKS SAC</strong></h4>
                    <p>Calle Tanganica 220 - Rinconada del Lago - La Molina</p>
                </Col>
                <Col md={12}>
                    <div className={"invoice-headbox"}>
                    <table className={'table table-noborder'}>
                        <tbody>
                            <tr>
                                <th>Señor(es):</th>
                                <td colspan={3}>{this.state.invoice.fullname}</td>
                            </tr>
                            <tr>
                                <th>Dirección:</th>
                                <td colspan={3}>{this.state.invoice.direccion}</td>
                            </tr>
                            <tr>
                                <th>RUC:</th>
                                <td>{this.state.invoice.ruc}</td>
                                <th>Código cliente:</th>
                                <td>
                                    <Moment title={this.state.invoice.regdate} format="DD/MM/YYYY">{this.state.invoice.regdate}</Moment>
                                </td>
                            </tr>
                            <tr>
                                <th>Fecha de Emisión:</th>
                                <td>
                                    <Moment title={this.state.invoice.regdate} format="DD/MM/YYYY">{this.state.invoice.regdate}</Moment>
                                </td>
                                <th>Vendedor:</th>
                                <td>
                                    <Moment title={this.state.invoice.regdate} format="DD/MM/YYYY">{this.state.invoice.regdate}</Moment>
                                </td>
                            </tr>
                            <tr>
                                <th>Guia de Remisión:</th>
                                <td>
                                    <Moment title={this.state.invoice.regdate} format="DD/MM/YYYY">{this.state.invoice.regdate}</Moment>
                                </td>
                                <th>Fecha de Vencimiento:</th>
                                <td>
                                    <Moment title={this.state.invoice.regdate} format="DD/MM/YYYY">{this.state.invoice.regdate}</Moment>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                </Col>
                <Col md={12}>
                    <br/>
                </Col>
                <Col md={12}>
                    <div className={"invoice-headbox"}>
                        Factura venta de servicio
                        <table className={'table table-noborder'}>
                            <tbody>
                            <tr>
                                <th>Placa:</th>
                                <td>ASZ-611</td>
                                <th>Año fabricacion:</th>
                                <td>2014</td>
                                <th>Nro de serie:</th>
                                <td>SDFD9305NDG8</td>
                                <th>Color:</th>
                                <td>blanco</td>
                            </tr>
                            <tr>
                                <th>Fecha de Vencimiento:</th>
                                <td>
                                    <Moment title={this.state.invoice.regdate} format="DD/MM/YYYY">{this.state.invoice.regdate}</Moment>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </Col>
                <Col md={12}>
                    <br/>
                </Col>
                <Col xs={12}>
                    <table className={'table table-border'}>
                        <thead>
                            <tr>
                                <th className={'text-center'}>Codigo</th>
                                <th className={'text-center'}>Descripción producto</th>
                                <th className={'text-center'}>Cantidad</th>
                                <th className={'text-center'}>Unidad</th>
                                <th className={'text-center'}>Precio unitario</th>
                                <th className={'text-center'}>Descuento</th>
                                <th className={'text-center'}>Valor venta</th>
                            </tr>
                        </thead>
                        <tbody>
                            {details ? details.map((detail, idx) => {
                                return (<tr key={idx}>
                                    <td className={'text-center'}>{detail.code}</td>
                                    <td className={'text-left'}>{detail.description}</td>
                                    <td className={'text-center'}>{detail.quantity}</td>
                                    <td className={'text-left'}>{detail.measurement}</td>
                                    <td className={'text-right'}>{formatter.format(detail.unitvalue)}</td>
                                    <td className={'text-right'}>{formatter.format(0.00)}</td>
                                    <td className={'text-right'}>{formatter.format(detail.quantity * detail.unitvalue)}</td>
                                </tr>)
                            }) : null}
                        </tbody>
                    </table>
                </Col>
                <Col md={8} />
                <Col md={4}>
                    <table className={'table table-border'}>
                        <tbody>
                            <tr>
                                <th>Total Valor Venta</th>
                                <td className={'text-right'}>{formatter.format(price)}</td>
                            </tr>
                            <tr>
                                <th>Total Descuento</th>
                                <td className={'text-right'}>{formatter.format(0.00)}</td>
                            </tr>
                            <tr>
                                <th>IGV</th>
                                <td className={'text-right'}>{formatter.format(igv)}</td>
                            </tr>
                            <tr>
                                <th>Importe Total</th>
                                <td className={'text-right'}><strong>{formatter.format(total)}</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </Col>
            </Box>
        </Content>)
    }
}
export default invoiceView;
