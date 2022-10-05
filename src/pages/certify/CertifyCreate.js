import React, {Component} from "react";
import Content from "../../components/Content";
import {Box, Col} from "adminlte-2-react";
import WorkTableCertifys from "../../components/WorkTableCertifys";
import {constantes} from "../../commons/Constantes";
import Utils from "../../commons/Utils";
import utils from "../../commons/Utils";
import API from "../../commons/http-common";
import CustomButton from "../../components/CustomButton/CustomButton";
import swal from "sweetalert";

class CertifyCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            certifys: {},
            orders: [],
            loader: true,
            loaded: true,
            disabledOrderId: true,
            isLoadButton: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    ws = new WebSocket(constantes.API_URL_WS + "/ws");

    handleSubmit(event) {
        let title = "Desea guardar los cambios";
        if (!this.state.certifys.orderId) {
            swal("Advertencia", " Debe ingresar el numero de OT", "warning");
            return;
        }
        swal({
            title: title,
            icon: "warning",
            buttons: ["Cancelar", "Guardar"]
        })
            .then((evl) => {
                this.setState({isLoadButton: true});
                if (evl) return API.post("certifys", this.state.certifys);
            })
            .then((res) => {
                if (res === undefined) return;
                this.ws.send("create certify");
                this.ws.close();
                this.props.history.push("/certify");
                swal("Exito!", "Se registro correctamente la acta de entrega", "success");
                this.setState({isLoadButton: true});
            })
            .catch((err) => {
                this.setState({isLoadButton: false});
                swal("Error!", Utils.getMessageError(err), "error");
            });
    }

    async componentWillMount() {
        const search = this.props.location.search;
        const params = new URLSearchParams(search);
        const orderid = parseInt(params.get("order"));
        let apiOrder = Utils.getApi("orders")
        let certifys = {...this.state.certifys};
        certifys.orderId = parseInt(
            new URLSearchParams(this.props.location.search).get("order")
        );
        this.setState({loader: false})

        function mapCertify(res) {
            let certify = {};
            certify.customer = res.customer;
            certify.area = res.workarea;
            certify.description = res.description;
            certify.inidate = res.startdate;
            certify.findate = res.enddate;
            certify.contact = res.contact;
            certify.brand = res.brand;
            certify.model = res.model;
            certify.plate = res.plate;
            certify.serie = res.serie;
            certify.quotationId = res.quoteid;
            certify.employee = res.employee;
            return certify;
        }

        try {
            this.setState({
                orders: await API.get(apiOrder),
                ...(orderid ? {
                        certifys: {
                            ...mapCertify(await API.get("order/" + orderid + "/quote")),
                            orderId: orderid
                        },
                        disabledOrderId: true
                    } : {disabledOrderId: false}
                ),
                loader: true
            });
        } catch (e) {
            this.setState({loader: true});
            await swal("Error!", Utils.getMessageError(e), "error");
        }
    }

    render() {
        const getApprovedOrdersId = () => {
            const order = this.state.orders;
            return order
                .filter(order =>
                    order.status === constantes.STATUS_FINISHED && order.action.flow
                )
                .map(order => {
                    return {value: order.id, label: utils.maskOrderId(order.id)}
                });
        }
        const handleChange = (e) => {
            let name = e.target.name;
            let value = e.target.value;
            let certifys = {...this.state.certifys};
            let thatRender = true;
            if (name === "orderid") {
                this.setState({loaded: false});
                certifys.orderId = value ? parseInt(value) : 0;
                thatRender = false;
                API.get("order/" + value + "/quote")
                    .then((res) => {
                        certifys.customer = res.customer;
                        certifys.area = res.workarea;
                        certifys.description = res.description;
                        certifys.inidate = res.startdate;
                        certifys.findate = res.enddate;
                        certifys.contact = res.contact;
                        certifys.brand = res.brand;
                        certifys.model = res.model;
                        certifys.plate = res.plate;
                        certifys.serie = res.serie;
                        certifys.quotationId = res.quoteid;
                        certifys.employee = res.employee;
                        this.setState({certifys: certifys, loaded: true});
                    })
                    .catch((err) => {
                        swal("Error!", Utils.getMessageError(err), "error");
                    });
            }
            if (name === "area") {
                certifys.area = value;
            }
            if (name === "description") {
                certifys.description = value;
            }
            if (name === "startdate") {
                if (certifys.inidate === value) {
                    thatRender = false;
                } else {
                    certifys.inidate = value;
                }
            }
            if (name === "enddate") {
                if (certifys.findate === value) {
                    thatRender = false;
                } else {
                    certifys.findate = value;
                }
            }
            if (name === "observation") {
                certifys.observation = value;
            }
            if (name === "pucharseorder") {
                certifys.pucharseorder = value;
            }
            if (thatRender) {
                this.setState({certifys: certifys});
            }
        };
        const validRenderComplete = () => {
            return true && this.state.loader && true;
        };
        return (
            <Content
                title={"Acta de entrega"}
                subTitle={"Crear"}
                breadCrumb={[
                    {title: "Acta de entrega", link: "/certify"},
                    {title: "Nuevo"},
                ]}
                loaded={validRenderComplete()}
                loader={this.state.loaded}
            >
                <WorkTableCertifys
                    optionsorders={getApprovedOrdersId()}
                    datacertify={this.state.certifys}
                    handleChange={handleChange}
                    hiddenStatus
                    dataorderstatus={this.state.disabledOrderId}
                />
                <Box>
                    <Col>
                        <CustomButton
                            text={"Guardar"}
                            icon={"save"}
                            handle={this.handleSubmit}
                            isLoad={this.state.isLoadButton}
                        />
                    </Col>
                </Box>
            </Content>
        );
    }
}

export default CertifyCreate;
