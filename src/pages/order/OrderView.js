import { Box, Col, Row } from "adminlte-2-react";
import React, { Component } from 'react';
import { constantes } from "../../commons/Constantes";
import Content from "../../components/Content";
import '../../components/CustomTable.css';
import Utils from "../../commons/Utils";
import API from "../../commons/http-common";
import Moment from "react-moment";
import { v4 as uuid } from 'uuid';
class OrderView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            employees: [],
            order: {}
        }
    }
    componentWillMount() {
        const id = this.props.match.params.id;
        API.get("vieworders/" + id).then(res => {
            this.setState({ order: res })
        }).catch(err => {
            alert(constantes.ICON_UNICODE_ERROR + " " + Utils.getMessageError(err));
        });
    }
    render() {
        const validRenderComplete = () => {
            return true &&
            this.state.order.id >= 0 &&
            true;
        };
        const id = this.props.match.params.id;
        const breadCrumb = [
            { title: "Orden de trabajo", link: "/order" },
            { title: id },
        ];
        if (validRenderComplete()) {
            const order = this.state.order;
            const materials = order.materials && order.materials.length > 0 ? order.materials.filter(n =>
                n.type.split(" ")[0] === constantes.PRODUCT_TYPE_MATERIAL
            ) : [];
            let listsanpaper = materials.length > 0 ? materials.filter(n =>
                n.group.split(" ")[0] === (constantes.PRODUCT_GROUP_SANPAPER)
            ) : [];
            let listother = materials.length > 0 ? materials.filter(n =>
                ![constantes.PRODUCT_GROUP_BRUSHWORK, constantes.PRODUCT_GROUP_SANPAPER].includes(n.group.split(" ")[0])
            ) : [];
            const tableb = this.state.order.services ? this.state.order.services.map((service, idx) => {
                const key = this.state.order.services ? this.state.order.services : uuid();
                return (
                    <tbody>
                        <tr key={key}>
                            <th colSpan={2}>Descripcion del trabajo :({idx + 1})</th>
                            <td colSpan={4}>{service.description}</td>
                        </tr>
                        <tr >
                            <th className={'text-center'} style={{ width: 10 }}>Item</th>
                            <th className={'text-center'} style={{ width: 100 }}>tipo de trabajo</th>
                            <th className={'text-center'} style={{ width: 200 }}>Nombre del recurso</th>
                            <th className={'text-center'} style={{ width: 100 }}>Cargo</th>
                            <th className={'text-center'} style={{ width: 20 }}>N° H.H</th>
                            <th className={'text-center'} style={{ width: 20 }}>N° Paños</th>
                        </tr>
                        {service.details ? service.details.map((data, idx) => {
                            return (
                                <tr>
                                    <td className={'text-center'}>{idx + 1}</td>
                                    <td >{data.worktype}</td>
                                    <td >{data.employee}</td>
                                    <td >{data.care}</td>
                                    <td className={'text-center'}>{data.hours}</td>
                                    <td className={'text-center'}>{data.cloths}</td>
                                </tr>
                            )
                        }) : null}
                        <tr>
                            <td colSpan={4} className={'text-right no-border'}><b>Total</b></td>
                            <td className={'text-center'}>{service.details ? service.details.map((e) => e.hours).reduce((a, b) => a + b) : 0}</td>
                            <td className={'text-center'}>{service.details ? service.details.map((e) => e.cloths).reduce((a, b) => a + b) : 0}</td>
                        </tr>
                    </tbody>
                )
            }) : null
            let tablelijas = null;
            if (listsanpaper.length > 0) {
                tablelijas = <>
                    <tr>
                        <h4>Lijas</h4>
                    </tr>
                    <tr>
                        <th className={'text-center'} style={{ width: 30 }}>Item</th>
                        <th className={'text-center'} style={{ width: 200 }}>Descripcion del Material</th>
                        <th className={'text-center'} style={{ width: 30 }}>Material</th>
                        <th className={'text-center'} style={{ width: 60 }}>tipo</th>
                        <th className={'text-center'} style={{ width: 30 }}>Cantidad</th>
                    </tr>
                    {listsanpaper.map((material, idx) => {
                        return (
                            <tr>
                                <td className={'text-center'}>{idx + 1}</td>
                                <td >{material.description}</td>
                                <td >{material.caracteristic}</td>
                                <td className={'text-center'}>{material.group}</td>
                                <td className={'text-center'}>{material.quantity}</td>
                            </tr>)
                    })}
                </>
            }
            let tableother = null;
            if (listother.length > 0) {
                tableother = <>
                    <tr>
                        <h4>Otros</h4>
                    </tr>
                    <tr>
                        <th className={'text-center'} style={{ width: 30 }}>Item</th>
                        <th colSpan={2} className={'text-center'} style={{ width: 200 }}>Descripcion del Material</th>
                        <th className={'text-center'} style={{ width: 180 }}>Area de trabajo</th>
                        <th className={'text-center'} style={{ width: 30 }}>Cantidad</th>
                    </tr>
                    {listother.map((material, idx) => {
                        return (
                            <tr>
                                <td className={'text-center'}>{idx + 1}</td>
                                <td colSpan={2}>{material.description}</td>
                                <td className={'text-center'}>{material.group}</td>
                                <td className={'text-center'}>{material.quantity}</td>
                            </tr>)
                    })}
                </>
            }
            const tblExternal = this.state.order.externals ? this.state.order.externals.map((external, idx) => {
                const key = this.state.order.externals ? this.state.order.externals : uuid();
                return (
                    <tbody>
                        <tr key={key}>
                            <th colSpan={2}>Descripcion del trabajo Externo:({idx + 1})</th>
                            <td colSpan={4}>{external.description}</td>
                        </tr>
                        <tr >
                            <th className={'text-center'} style={{ width: 10 }}>Item</th>
                            <th className={'text-center'} style={{ width: 50 }}>N° documento</th>
                            <th className={'text-center'} style={{ width: 200 }}>Razon Social</th>
                            <th className={'text-center'} style={{ width: 20 }}>PC S/.</th>
                            <th className={'text-center'} style={{ width: 20 }}>PV S/.</th>
                            <th className={'text-center'} style={{ width: 20 }}>Cantidad</th>
                        </tr>
                        {external.details ? external.details.map((data, idx) => {
                            return (
                                <tr>
                                    <td className={'text-center'}>{idx + 1}</td>
                                    <td >{data.docnum}</td>
                                    <td >{data.company}</td>
                                    <td className={'text-center'}>{data.pucharseprice}</td>
                                    <td className={'text-center'}>{data.saleprice}</td>
                                    <td className={'text-center'}>{data.quantity}</td>
                                </tr>
                            )
                        }) : null}
                        <tr>
                            <td colSpan={3} className={'text-right no-border'}><b>Total</b></td>
                            <td className={'text-center'}>{external.details ? external.details.map((e) => e.pucharseprice).reduce((a, b) => a + b) : 0}</td>
                            <td className={'text-center'}>{external.details ? external.details.map((e) => e.saleprice).reduce((a, b) => a + b) : 0}</td>
                            <td className={'text-center'}>{external.details ? external.details.map((e) => e.quantity).reduce((a, b) => a + b) : 0}</td>
                        </tr>
                    </tbody>
                )
            }) : null
            return (<Content title={"Orden de trabajo"} subTitle="Detalle" breadCrumb={breadCrumb} loaded={validRenderComplete()}>
                {validRenderComplete() ? <Box title={''} solid>
                    <Row>
                        <Col md={1} />
                        <Col md={10} >
                            <Row>
                                <Col md={8}>
                                    <h3>
                                        <img alt={""} src={'../../logo.png'} height={64} align={'left'} />
                                    </h3>
                                </Col>
                                <Col md={4}>
                                    <h3>BODYWORKS PERÚ S.A.C.</h3>
                                    <h4>RUC 20549734899</h4>
                                    <h5>CALLE TANGANICA 120 LA MOLINA</h5>
                                    <h5>TELF: 7152557</h5>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <h3 className={'text-center'}>
                                        Nro de Orden de trabajo
                                        <span className={'square-code'}>OT000{this.state.order.id}</span>
                                    </h3>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <h3>Datos Generales</h3>
                                    <table className={'table table-bordered-bw'}>
                                        <tbody>
                                            <tr>
                                                <th>Cliente: </th>
                                                <td colSpan={5}>{this.state.order.customer}</td>
                                                <th>Fecha: </th>
                                                <td>
                                                    <Moment title={this.state.order.regdate} format="DD/MM/YYYY">{this.state.order.regdate}</Moment>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Contacto</th>
                                                <td colSpan={5}>{this.state.order.contact}</td>
                                                <th>Placa:</th>
                                                <td>{this.state.order.plate}</td>
                                            </tr>
                                            <tr>
                                                <th>Marca: </th>
                                                <td>{this.state.order.brand}</td>
                                                <th>Modelo: </th>
                                                <td>{this.state.order.model}</td>
                                                <th>Color: </th>
                                                <td>{this.state.order.colour}</td>
                                                <th>Chasis: </th>
                                                <td>{this.state.order.serie}</td>
                                            </tr>
                                           

                                        </tbody>
                                    </table>
                                    <h3>Tipo de trabajo</h3>
                                    <table className={'table table-bordered-bw table-join'}>
                                        <tbody>
                                            <tr>
                                                <th style={{ width: 80 }}>PDI</th>
                                                <td className={'text-center'} style={{ width: 30 }}>{this.state.order.workarea === 'PDI' ? 'X' : null}</td>
                                                <th style={{ width: 80 }}>SINIESTROS</th>
                                                <td className={'text-center'} style={{ width: 30 }}>{this.state.order.workarea === 'SINIESTROS' ? 'X' : null}</td>
                                                <th style={{ width: 80 }}>TALLER</th>
                                                <td className={'text-center'} style={{ width: 30 }}>{this.state.order.workarea === 'TALLER' ? 'X' : null}</td>
                                                <th style={{ width: 80 }}>COMERCIAL</th>
                                                <td className={'text-center'} style={{ width: 30 }}>{this.state.order.workarea === 'COMERCIAL' ? 'X' : null}</td>
                                                <th style={{ width: 80 }}>ALMACEN</th>
                                                <td className={'text-center'} style={{ width: 30 }}>{this.state.order.workarea === 'ALMACEN' ? 'X' : null}</td>
                                            </tr>
                                            
                                        </tbody>
                                    </table>
                                    <table className={'table table-bordered-bw'}>
                                        <tbody>
                                            <tr>
                                                <th>Fecha de Inicio: </th>
                                                <td>
                                                    <Moment title={this.state.order.startdate} format="DD/MM/YYYY">{this.state.order.startdate}</Moment>
                                                </td>
                                                <th>Fecha de Fin: </th>
                                                <td>
                                                    <Moment title={this.state.order.enddate} format="DD/MM/YYYY">{this.state.order.enddate}</Moment>
                                                </td>
                                                <th>Nro de Colaboradores: </th>
                                                <td className={'text-center'}>{this.state.order.collaborators}</td>
                                            </tr>
                                            <tr>
                                                <th >Numero De Cotizacion:</th>
                                                <td >CT000{this.state.order.idquote}</td>
                                                <th colSpan={2} style={{ width: '200px' }}>Numero De Orden De Compra O Servicio Del Cliente:</th>
                                                <td colSpan={3}></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <h3>Tiempos y Horas Hombre</h3>
                                    <h3>Servicios</h3>
                                    <table className={'table table-bordered-bw'}>
                                        {tableb}
                                    </table>
                                    <h3>Materiales</h3>
                                    <table className={'table table-bordered-bw'}>
                                        <tbody>
                                            {/* {tablehead} */}
                                            {tablelijas}
                                            {tableother}
                                        </tbody>
                                    </table>
                                    <h4>Insumos</h4>
                                    <table className={'table table-bordered-bw'}>
                                        <tbody>
                                            <tr>
                                                <th className={'text-center'} style={{ width: 30 }}>Item</th>
                                                <th className={'text-center'} style={{ width: 250 }}>Descripción</th>
                                                <th className={'text-center'} style={{ width: 150 }}>Proceso</th>
                                                <th className={'text-center'} style={{ width: 30 }}>Medida</th>
                                                <th className={'text-center'} style={{ width: 30 }}>Cantidad</th>
                                            </tr>
                                            {this.state.order.materials && this.state.order.materials.length > 0 ?
                                                this.state.order.materials.map((detail, idx) =>
                                                    <tr key={idx}>
                                                        <td className={'text-center'}>{idx + 1}</td>
                                                        <td className={'text-left'}>{detail.description}</td>
                                                        <td className={'text-left'}>{detail.group}</td>
                                                        <td className={'text-center'}>{detail.measurement.toUpperCase()}</td>
                                                        <td className={'text-center'}>{detail.quantity}</td>
                                                    </tr>) : null}
                                        </tbody>
                                    </table>
                                    <h3>Trabajos Externos</h3>
                                    <table className={'table table-bordered-bw'}>
                                        {tblExternal}
                                    </table>
                                    <h3>Observaciones</h3>
                                    <table className={'table table-bordered-bw'}>
                                        <tbody>
                                            <tr>
                                                <td><p style={{ wordBreak: "break-all" }}>{this.state.order.observation}</p></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Box> : null}
            </Content>);
        } else {
            return (<Content title={"Orden de trabajo"} subTitle="Detalle" breadCrumb={breadCrumb}></Content>)
        }
    }
}
export default OrderView;