import React, {Component} from "react";
import Content from "../../components/Content";
import {Box, Col, Row} from "adminlte-2-react";
import SaleTable2 from "../../components/SaleTable2";
import HeaderFormQuote from "../../components/HeaderFormQuote";
import Storage from "../../commons/Storage";
import Utils from "../../commons/Utils";
import {constantes} from "../../commons/Constantes";
import CustomButton from "../../components/CustomButton/CustomButton";
import API from "../../commons/http-common";
import swal from "sweetalert";
import {v4 as uuid} from 'uuid';

class QuoteCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quotation: {
                currency: "PEN",
                employee: {
                    id: Storage.getUsername().employeeid
                },
                detail: [],
                contact: "",
            },
            products: [],
            loader: true,
            isLoadButton: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    ws = new WebSocket(constantes.API_URL_WS + "/ws");

    handleSubmit(e) {
        let title = "Desea guardar los cambios?";
        if (!this.state.quotation.customer_id) {
            swal("Advertencia", "Debe ingresar el cliente", "warning");
            return;
        }
        if (!this.state.quotation.detail.length > 0) {
            swal("Advertencia", "La cotización debe tener al menos un item", "warning");
            return;
        }
        if (!Utils.itemsOnArrayIsNotZero(this.state.quotation.detail)) {
            swal("Advertencia", "Porfavor seleccione un codigo de producto", "warning");
            return;
        }
        swal({
            title: title,
            icon: "warning",
            buttons: ["Cancelar", "Guardar"]
        }).then((evl) => {
            this.setState({isLoadButton: true});
            if (evl) return API.post("quotes", this.state.quotation);
        }).then((res) => {
            this.setState({isLoadButton: false});
            if (res === undefined) return;
            this.ws.send("create quote");
            this.ws.close();
            this.props.history.push("/quote");
            swal("Exito!", " Se registró correctamente la cotización", "success");
        }).catch((err) => {
            this.setState({isLoadButton: false});
            swal("Error!", Utils.getMessageError(err), "error");
        });
    }

    componentWillMount() {
    }

    render() {
        const calculateAmount = (product) => {
            const {rate, quantity} = product;
            return parseFloat(rate * quantity);
        }
        const handleChange = (e) => {
            let id = e.target.name.split("-")[1];
            let name =
                e.target.name.split("-").length > 0
                    ? e.target.name.split("-")[0]
                    : e.target.name;
            let value = e.target.value;
            let quotation = {...this.state.quotation};
            if (name === "brand") {
                quotation.brand = value;
            }
            if (name === "model") {
                quotation.model = value;
            }
            if (name === "productype") {
                quotation.productype = value;
            }
            if (name === "plate") {
                quotation.plate = value;
            }
            if (name === "serie") {
                quotation.serie = value;
            }
            if (name === "color") {
                quotation.color = value;
            }
            if (name === "currency") {
                if (quotation.detail && quotation.detail.length > 0) {
                    swal({
                        title: "Advertencia!",
                        text: "Los items agregados se eliminaran!, estas seguro que desea continuar?",
                        icon: "warning",
                        buttons: ["No", "Si"]
                    }).then((evl) => {
                        if (evl) {
                            quotation.detail = [];
                            quotation.currency = value;
                        }
                        this.setState({
                            quotation: quotation,
                        });
                    });
                } else {
                    quotation.currency = value;
                }
            }
            if (name === "customer") {
                quotation.customer_id = parseInt(value);
                if (quotation.detail && quotation.detail.length > 0) {
                    swal("Advertencia!", "Todos los item seleccionados se eliminaran", "warning");
                    quotation.detail = [];
                }
            }
            if (name === "contact") {
                quotation.contact = value;
            }

            if (name === "category") {
                quotation.detail[id]["category"] = value;
            }
            if (name === "product_id") {
                const product = Storage.findProductsPerId(parseInt(value));
                if (product.currency !== quotation.currency) {
                    swal("Advertencia!", "No se puede seleccionar un producto con tipo de moneda: " + product.currency, "warning");
                    return;
                }
                quotation.detail[id]["product_id"] = parseInt(value);
                quotation.detail[id]["description"] = product.description;
                quotation.detail[id]["rate"] = product.unitprice;
                quotation.detail[id]["amount"] = calculateAmount(quotation.detail[id])
            }
            if (name === "description") {
                quotation.detail[id]["description"] = value;
            }
            if (name === "quantity") {
                quotation.detail[id]["quantity"] = parseFloat(value);
                quotation.detail[id]["amount"] = calculateAmount(quotation.detail[id])
            }
            if (name === "rate") {
                quotation.detail[id]["rate"] = parseFloat(value);
                quotation.detail[id]["amount"] = calculateAmount(quotation.detail[id])
            }
            if (["product_id", "quantity", "rate"].includes(name)) {
                quotation.total =
                    quotation.detail && quotation.detail.length > 0
                        ? quotation.detail
                        .map((q) => q.amount)
                        .reduce((a, b) => a + b) * constantes.IVG
                        : 0;
            }
            this.setState({
                quotation: quotation,
            });
        };
        const handleAddItem = () => {
            let quotation = {...this.state.quotation};
            if (!quotation.customer_id) {
                swal("Advertencia!", "No puede agregar items, Antes debe seleccionar un cliente.", "warning");
                return;
            }
            let detail = {};
            detail.idx = uuid();
            detail.id = null;
            detail.quantity = 1;
            detail.product_id = 0;
            detail.description = "";
            detail.rate = 0;
            detail.category = "0";
            detail.amount = 0;
            quotation.detail = [...this.state.quotation.detail, detail];
            this.setState({
                quotation: quotation,
            });
        };
        const handleDelItem = (idx) => {
            let quotation = {...this.state.quotation};
            quotation.detail = quotation.detail.filter(
                (detail) => detail.idx !== idx
            );
            this.setState({
                quotation: quotation,
            });
        };

        const ButtonCreate = () => {
            return (
                <CustomButton
                    text={"Guardar"}
                    icon={"save"}
                    handle={this.handleSubmit}
                    isLoad={this.state.isLoadButton}
                />
            );
        };
        return (
            <Content
                title={"Cotización"}
                subTitle={"Crear"}
                breadCrumb={[
                    {title: "Cotización", link: "/quote"},
                    {title: "Nuevo"},
                ]}
                loaded={true}
                loader={this.state.loader}
            >
                <HeaderFormQuote
                    data={this.state.quotation}
                    handleChange={handleChange}
                    hiddenQuote
                    hiddenStatus
                    hiddenAssigned
                />
                <Box footer={<ButtonCreate/>} title={"Servicios/Repuestos"}>
                    <Row>
                        <Col xs={12}>
                            <SaleTable2
                                details={this.state.quotation.detail}
                                handleAddItem={handleAddItem}
                                handleDelItem={handleDelItem}
                                handleChange={handleChange}
                                currency={this.state.quotation.currency}
                                inputservicetype={this.typeservice}
                            />
                        </Col>
                    </Row>
                </Box>
            </Content>
        );
    }
}

export default QuoteCreate;
