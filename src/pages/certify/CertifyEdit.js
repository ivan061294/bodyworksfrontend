import React, { Component } from 'react';
import Content from "../../components/Content";
import { Box, Col } from "adminlte-2-react";
import WorkTableCertifys from '../../components/WorkTableCertifys';
import Storage from '../../commons/Storage';
import { constantes } from '../../commons/Constantes';
import Utils from "../../commons/Utils";
import API from "../../commons/http-common";
import swal from "sweetalert"
import CustomButton from '../../components/CustomButton/CustomButton';
class CertifyCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            certifys: {},
            order: {},
            quote: {},
            isLoadButton: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    ws = new WebSocket(constantes.API_URL_WS + '/ws');
    handleSubmit(event) {
        const id = this.props.match.params.id;
        let title = "Desea Actualizar los cambios?"
        swal({
            title: title,
            icon: "warning",
            buttons: ["Cancelar", "Actualizar"]
        }).then((evl) => {
            this.setState({ isLoadButton: true });
            if (evl) return API.put("certifys/" + id, this.state.certifys);
        }).then((res) => {
            if (res === undefined) return;
            this.ws.send("update certify");
            this.ws.close();
            this.props.history.push("/certify");
            swal("Exito!", "Se actualizo correctamente la acta de entrega", "success");
            this.setState({ isLoadButton: false });
        }).catch(err => {
            this.setState({ isLoadButton: false });
            swal("Error!", Utils.getMessageError(err), "error");
        });
    }
    componentWillMount() {
        const id = this.props.match.params.id;
        API.get("certifys/" + id).then(res => {
            this.setState({ certifys: res });
            API.get("order/" + res.orderId + "/quote").then(res => {
                let certifys = { ...this.state.certifys };
                certifys.customer = res.customer;
                certifys.inidate = res.startdate;
                certifys.findate = res.enddate;
                certifys.contact = res.contact;
                certifys.brand = res.brand;
                certifys.model = res.model;
                certifys.plate = res.plate;
                certifys.serie = res.serie;
                certifys.employee = res.employee;
                this.setState({ certifys: certifys });
            }).catch();
        }).catch(err => {
            alert(constantes.ICON_UNICODE_ERROR + " " + Utils.getMessageError(err));
        });
    }
    render() {
        const validRenderComplete = () => {
            return true
                && this.state.certifys.id >= 0
                && this.state.certifys.employee >= 0
                && true;
        };
        const handleChange = e => {
            let name = e.target.name;
            let value = e.target.value;
            let certifys = { ...this.state.certifys };
            let thatRender = true;
            if (name === "status") {
                certifys.status = value;
            }
            if (name === "area") {
                certifys.area = value;
            }
            if (name === "description") {
                certifys.description = value;
            }
            if (name === "observation") {
                certifys.observation = value;
            }
            if (name === "pucharseorder") {
                certifys.pucharseorder = value;
            }
            if (thatRender) {
                this.setState({ certifys: certifys });
            }
        };
        return (<Content title={"Acta de entrega"} subTitle={'Modificacion'} breadCrumb={[
            { title: "Acta de entrega", link: "/certify" },
            { title: this.props.match.params.id },
        ]} loaded={validRenderComplete()}>
            <WorkTableCertifys
                optionsorders={Storage.getordersedit()}
                datacertify={this.state.certifys}
                dataorder={this.state.order}
                dataquote={this.state.quote}
                handleChange={handleChange}
                disabled
                optionStatus={[
                    { value: 'A', label: 'Aprobado' },
                    { value: 'P', label: 'Pendiente' },
                    { value: 'R', label: 'Rechazado' }]}
                dataStatuscertify={this.state.certifys.status}
                dataorderstatus={true}
            />
            <Box>
                <Col>
                    <CustomButton
                        text={"Actualizar"}
                        icon={"edit"}
                        handle={this.handleSubmit}
                        isLoad={this.state.isLoadButton}
                    />
                </Col>
            </Box>

        </Content>)
    }
}
export default CertifyCreate;