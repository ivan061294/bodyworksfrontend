import { Box, Col, Row } from "adminlte-2-react";
import React, { Component } from 'react';
import Content from "../../components/Content";
import '../../components/CustomTable.css';
import Moment from "react-moment";
import Utils from "../../commons/Utils";
import { constantes } from '../../commons/Constantes';
import API from "../../commons/http-common";
import './CertifyView.css';
class OrderView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            certify: {},
            quote: {},
            customer: {}
        }
    }
    componentWillMount() {
        const id = this.props.match.params.id;
        API.get("viewcertifys/" + id).then(res => {
            this.setState({ certify: res });
        }).catch(err => {
            alert(constantes.ICON_UNICODE_ERROR + " " + Utils.getMessageError(err));
            this.props.history.push("/certify");
        });
    }
    render() {
        const validRenderComplete = () => {
            return true
                && this.state.certify.id > 0
                && true;
        };
        const id = this.props.match.params.id;
        const breadCrumb = [
            { title: "Acta de entrega", link: "/certify" },
            { title: id },
        ];
        if (validRenderComplete()) {
            return (<Content title={"Acta de entrega"} subTitle="Detalle" breadCrumb={breadCrumb} loaded={validRenderComplete()}>
                {validRenderComplete() ? <Box title={''}>
                    <Row>
                        <Col md={1} />
                        <Col md={10} >
                            <Row>
                                <Col xs={8}>
                                    <h3>
                                        <img alt={""} src={'../../logo.png'} height={64} align={'left'} />
                                    </h3>
                                </Col>
                                <Col xs={4}>
                                    <h3>BODYWORKS PERÚ S.A.C.</h3>
                                    <h4>RUC 20549734899</h4>
                                    <h5>CALLE TANGANICA 120 LA MOLINA</h5>
                                    <h5>TELF: 7152557</h5>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <h3 className={'text-center'}>
                                        Nro Acta de entrega
                                       <span className={'square-code'}>AE000{this.state.certify.id}</span>
                                    </h3>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <h3>Datos Generales</h3>
                                    <table className={'table table-bordered-bw'}>
                                        <tbody>
                                            <tr>
                                                <th>Cliente: </th>
                                                <td colSpan={5}>{this.state.certify.customer}</td>
                                            </tr>
                                            <tr>
                                                <th>Solicitado:</th>
                                                <td colSpan={3}>{this.state.certify.contact}</td>
                                                <th>Area: </th>
                                                <td>{this.state.certify.area}</td>
                                            </tr>
                                            <tr>
                                                <th>Marca:</th>
                                                <td colSpan={3}>{this.state.certify.brand}</td>
                                                <th>Modelo:</th>
                                                <td>{this.state.certify.model}</td>
                                            </tr>
                                            <tr>
                                                <th>Serie:</th>
                                                <td>{this.state.certify.serie}</td>
                                                <th>Placa:</th>
                                                <td>{this.state.certify.plate}</td>
                                                <th>Nro de OC:</th>
                                                <td>{this.state.certify.pucharseorder}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <table className={'table table-bordered-bw'}>
                                        <tbody>
                                            <tr>
                                                <th>Atendido por:</th>
                                                <td colSpan={2}>{this.state.certify.employee}</td>
                                                <th>Nro de Cotizacion:</th>
                                                <td colSpan={2}>{this.state.certify.quoteId}</td>
                                            </tr>
                                            <tr>
                                                <th>Nro de OT BWP:</th>
                                                <td>{this.state.certify.orderId}</td>
                                                <th>Fecha inicio:</th>
                                                <td>
                                                    <Moment title={this.state.certify.inidate} format="DD/MM/YYYY">{this.state.certify.inidate}</Moment>
                                                </td>
                                                <th>Fecha fin:</th>
                                                <td>
                                                    <Moment title={this.state.certify.findate} format="DD/MM/YYYY">{this.state.certify.findate}</Moment>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <h3>Descripcion detallada del servicio</h3>
                                    <table className={'table table-bordered-bw'}>
                                        <tbody>
                                            <tr>
                                                <td><p className={'bordercss'}>{this.state.certify.description}</p></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Col>
                            </Row>
                            <Col xs={12}>
                                <Row>
                                    <h3>Llenado por el cliente</h3>
                                    <table className={'table table-bordered-bw'}>
                                        <tbody>
                                            <tr>
                                                <th className={'text-center'} style={{ width: 100, height: 40 }}>Nombre:</th>
                                                <td colSpan={2}></td>
                                                <th className={'text-center'} style={{ width: 100, height: 40 }}>OT/CC:</th>
                                                <td colSpan={2}></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Row>
                            </Col>
                            <Row>
                                <Col xs={12}>
                                    <h3>Observaciones</h3>
                                    <table className={'table table-bordered-bw'}>
                                        <tbody>
                                            <tr>
                                                <td><p className={'bordercss'}></p></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Col>
                            </Row>
                            <Row><br /></Row>
                            <Row>
                                <Col xs={4} >
                                    <div className="centrado">
                                        <strong></strong>
                                        <div className="linea"></div>
                                        <p>Firma coordinador del servicio</p>
                                        <p>BODYWORKS</p>
                                    </div>
                                </Col>
                                <Col xs={4}>
                                    <div className="centrado">
                                        <strong></strong>
                                        <div className="linea"></div>
                                        <p>Firma v°b° conformidad del servicio</p>
                                        <p>CLIENTE</p>
                                    </div>
                                </Col>
                                <Col xs={4}>
                                    <div className="centrado">
                                        <strong></strong>
                                        <div className="linea"></div>
                                        <p>Fecha</p>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Box> : null}
            </Content>);
        } else {
            return (<Content title={"Acta de entrega"} subTitle="Detalle" breadCrumb={breadCrumb}></Content>)
        }
    }
}
export default OrderView;