import React, {Component} from "react";
import Content from "../../components/Content";
import {Box, Col, Inputs} from "adminlte-2-react";
import WorkTableServices from "../../components/WorkTableServices";
import HeaderFormQuote from "../../components/HeaderFormQuote";
import Utils from "../../commons/Utils";
import utils from "../../commons/Utils";
import WorkTableRepuestos from "../../components/WorkTableRepuestos";
import WorkTableTrabajos from "../../components/WorkTableTrabajos";
import Storage from "../../commons/Storage";
import {constantes} from "../../commons/Constantes";
import API from "../../commons/http-common";
import CustomButton from "../../components/CustomButton/CustomButton";
import swal from 'sweetalert';
import "./OrderCreate.css";
import {v4 as uuid} from 'uuid';
import Axios from "axios";

const {Select2, DateRange, Text} = Inputs;

async function getQuoteAndLines(quoteId) {
    const [quoteData, quoteLinesData] = await Axios.all([
        API.get(`quotes/${quoteId}`),
        API.get(`quotes/${quoteId}/quoteLines`)
    ])
    return {quote: quoteData, quoteLines: quoteLinesData}
}

class OrderCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoadButton: false,
            startDate: null,
            endDate: null,
            focusedInput: null,
            order: {
                quoteid: parseInt(
                    new URLSearchParams(this.props.location.search).get("quoteid")
                ),
                employees: [],
                services: [],
                supplies: [],
                externals: [],
                aprovedate: "",
                deliverydate: "",
                collaborators: "",
                totalhours: 0,
                totalcloths: 0,
                startdate: null,
                enddate: null,
                employeeid: null,
            },
            service: [],
            customers: [],
            supplies: [],
            products: [],
            employees: [],
            quotes: [],
            quote: null,
            loader: false,
            loaded: true,
            btndisabled: false,
            textbtn: "Guardar",
            clasbtn: "fa-save",
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //ws = new WebSocket(constantes.API_URL_WS + "/ws");

    async handleSubmit(saveto) {
        const {order, quote} = this.state;

        if (!order.quoteid) {
            await swal("Advertencia", "Debe ingresar el número de cotización", "warning");
            return;
        }
        if (!order.workarea) {
            await swal("Advertencia", "Debe ingresar el area de trabajo", "warning");
            return;
        }
        if (!order.startdate) {
            await swal("Advertencia", "Debe Ingresar la fecha de inicio", "warning");
            return;
        }
        if (!order.enddate) {
            await swal("Advertencia", "Debe Ingresar la fecha fin", "warning");
            return;
        }
        const validServices = (order) => {
            if (order.services.length) {
                return order.services.every(service => service.details ? service.details.length : false)
            }
            return true
        }
        if (!validServices(order)) {
            await swal("Advertencia", "Debe Agregar almenos 1 trabajo por cada servicio", "warning");
            return;
        }
        const orderTotal = Utils.calcTotalFromOrder(order);
        const quoteTotal = quote.total;
        if (orderTotal > quoteTotal) {
            const priceDifference = Utils.formatCurrency(orderTotal - quoteTotal, quote.currency);
            const message = `El monto total de esta Orden de trabajo supera el de la cotizacion por ${priceDifference}`
            await swal("Información", message, "info");
        }
        const alert = await swal({
            text: "Desea guardar los cambios?",
            buttons: {
                cancel: "Cancelar",
                save: "Guardar",
                continue: "Guardar y continuar",
            },
        });

        if (!alert || alert === "cancel") return;

        try {
            const orderData = await API.post("orders", order)
            await swal("Exito", "Se registró correctamente la orden de trabajo", "success");
            this.setState({isLoadButton: false});
            if (alert === "continue") {
                this.props.history.push(`/order/${orderData.id}/edit`);
            }
            if (alert === "save") {
                this.props.history.push(`/order`);
            }
        } catch (e) {
            console.error(e);
            this.setState({isLoadButton: false});
            swal("Error!", Utils.getMessageError(e), "error");
        }
    }


    async componentWillMount() {
        const search = this.props.location.search;
        const params = new URLSearchParams(search);
        const quoteId = parseInt(params.get("quoteid"));
        try {
            const {profile, employeeid: employeeId} = Storage.getUsername()
            this.setState({loader: false});
            const quotes = profile === constantes.ROLE_ADNISTRATOR ?
                await API.get(`quotes`) : await API.get(`employee/${employeeId}/quotes`);
            this.setState({
                quotes: quotes,
                ...(quoteId && {
                    quote: await API.get(`quotes/${quoteId}`),
                    order: {
                        ...this.state.order,
                        services: await API.get(`quotes/${quoteId}/quoteLines`),
                    },
                }),
                loader: true,
            });
        } catch (error) {
            alert(`${constantes.ICON_UNICODE_ERROR} ${Utils.getMessageError(error)}`);
            this.setState({loader: true});
        }
    }

    render() {
        const getApprovedQuotesId = () => {
            const quotes = this.state.quotes;
            return quotes
                .filter(quote =>
                    quote.status === constantes.STATUS_ACEPTED && quote.action.flow
                )
                .map(quote => {
                    return {value: quote.id, label: utils.maskQuoteId(quote.id)}
                });
        }
        const handleChange = async (e) => {
            let value = e.target.value;
            let subid =
                e.target.name.split("-").length > 2
                    ? e.target.name.split("-")[2]
                    : e.target.id;
            let id =
                e.target.name.split("-").length > 1
                    ? e.target.name.split("-")[1]
                    : e.target.id;
            let name =
                e.target.name.split("-").length > 0
                    ? e.target.name.split("-")[0]
                    : e.target.name;
            let order = {...this.state.order};
            if (name === "quoteid") {
                this.setState({loader: false});
                order.quoteid = value ? parseInt(value) : 0;
                const quoteId = value;
                try {
                    const {quote, quoteLines} = await getQuoteAndLines(quoteId)
                    this.setState({
                        quote: quote,
                        loader: true
                    });
                    order = {...order, services: quoteLines};
                } catch (error) {
                    alert(`${constantes.ICON_UNICODE_ERROR} ${Utils.getMessageError(error)}`);
                }
                console.log(this.state.order)
            }
            if (name === "workarea") {
                order.workarea = value;
            }
            let thatRender = true;
            if (name === "startdate" && value) {
                if (order.startdate === value) {
                    thatRender = false;
                } else {
                    order.startdate = value;
                    order.enddate = value;
                }
            }
            if (name === "enddate" && value) {
                if (order.enddate === value) {
                    thatRender = false;
                } else {
                    order.enddate = value;
                }
            }
            if (name === "observation") {
                order.observation = value;
            }
            //SERVICIOS
            if (name === "Description") {
                order.services[id].description = value;
            }
            if (name === "Worktype") {
                order.services[id].details[subid].worktype = value;
            }
            if (name === "employee") {
                order.services[id].details[subid].employee = parseInt(value);
                order.services[id].details[subid].salary = Storage.getEmployeePerId(
                    value
                ).salary;
            }
            if (name === "hours") {
                order.services[id].details[subid].hours = value
                    ? parseFloat(value)
                    : value;
            }
            if (name === "cloths") {
                order.services[id].details[subid].cloths = value
                    ? parseFloat(value)
                    : value;
            }
            //REPUESTOS
            if (name === "item") {
                order.supplies[id].item = value;
            }
            if (name === "description") {
                order.supplies[id].description = value;
                order.supplies[id].codigo = Storage.getSuppliesCodePerDescription(
                    value
                ).code;
                order.supplies[id].saleprice = parseFloat(
                    Storage.getSuppliesCodePerDescription(value).unitprice
                );
                order.supplies[id].unit = Storage.getSuppliesCodePerDescription(
                    value
                ).measurement;
                order.supplies[id].quantity = 2;
            }
            if (name === "quantity") {
                order.supplies[id].quantity = value ? parseFloat(value) : value;
            }
            //TRABAJOS
            if (name === "descriptionT") {
                order.externals[id].description = value;
            }
            if (name === "document") {
                order.externals[id].details[subid].docnum = value;
            }
            if (name === "businessname") {
                order.externals[id].details[subid].fullname = value;
            }
            if (name === "purcharse") {
                order.externals[id].details[subid].purcharsecost = value
                    ? parseFloat(value)
                    : value;
            }
            if (name === "salepriceT") {
                order.externals[id].details[subid].saleprice = value
                    ? parseFloat(value)
                    : value;
            }
            if (name === "quantityT") {
                order.externals[id].details[subid].quantity = value
                    ? parseFloat(value)
                    : value;
            }
            if (thatRender) {
                this.setState({order: order});
            }
        };
        const handleAddSubitem = (idx) => {
            let order = {...this.state.order};
            let id = order.services.findIndex((d) => d.idx === idx);
            let subdetail = {};
            subdetail.idx = uuid();
            subdetail.worktype = "";
            subdetail.employee = "";
            subdetail.hours = 0;
            subdetail.cloths = 0;
            order.services[id].details = [
                ...(order.services[id].details ? order.services[id].details : []),
                subdetail,
            ];
            this.setState({
                order: order,
            });
        };
        const handleDelSubitem = (idx, subidx) => {
            let order = {...this.state.order};
            let id = order.services.findIndex((d) => d.idx === idx);
            order.services[id].details = order.services[id].details.filter(
                (detail) => detail.idx !== subidx
            );
            this.setState({
                order: order,
            });
        };
        const validRenderComplete = () => {
            return true && this.state.loaded && true;
        };
        const handleAddService = (e) => {
            let order = {...this.state.order};
            let newService = {
                idx: uuid(),
                description: "",
                details: [],
            };
            order.services = [...this.state.order.services, newService];
            this.setState({
                order: order,
            });
        };
        const handleDelService = (idx) => {
            let order = {...this.state.order};
            order.services = order.services.filter(
                (services) => services.idx !== idx
            );
            this.setState({
                order: order,
            });
        };
        const handleAddRepuesto = (e) => {
            let order = {...this.state.order};
            let newrepuesto = {
                idx: uuid(),
                item: 0,
                description: "",
                codigo: "",
                saleprice: 0.0,
                unit: "u",
                quantity: 1,
            };
            order.supplies = [
                ...(this.state.order.supplies ? this.state.order.supplies : []),
                newrepuesto,
            ];
            this.setState({
                order: order,
            });
        };
        const handleDelRepuestos = (idx) => {
            let order = {...this.state.order};
            order.supplies = order.supplies.filter(
                (supplies) => supplies.idx !== idx
            );
            this.setState({
                order: order,
            });
        };
        const handleAddTrabajos = (idx) => {
            let order = {...this.state.order};
            let newtrabajo = {
                idx: uuid(),
                description: "",
                details: [],
            };
            order.externals = [
                ...(this.state.order.externals ? this.state.order.externals : []),
                newtrabajo,
            ];
            this.setState({
                order: order,
            });
        };
        const handleDelTrabajo = (idx) => {
            let order = {...this.state.order};
            order.externals = order.externals.filter(
                (external) => external.idx !== idx
            );
            this.setState({
                order: order,
            });
        };
        const handleadddetailtrabajo = (idx) => {
            let order = {...this.state.order};
            let id = order.externals.findIndex((d) => d.idx === idx);
            let subdetail = {};
            subdetail.idx = uuid();
            subdetail.docnum = "";
            subdetail.fullname = "";
            subdetail.purcharsecost = 0.0;
            subdetail.saleprice = 0.0;
            subdetail.quantity = 0;
            order.externals[id].details = [
                ...(order.externals[id].details ? order.externals[id].details : []),
                subdetail,
            ];
            this.setState({
                order: order,
            });
        };
        const handleDeldDetailTrabajo = (idx, subidx) => {
            let order = {...this.state.order};
            let id = order.externals.findIndex((d) => d.idx === idx);
            order.externals[id].details = order.externals[id].details.filter(
                (detail) => detail.idx !== subidx
            );
            this.setState({
                order: order,
            });
        };
        let isDisableQuoteSelect = false;
        const search = this.props.location.search;
        const params = new URLSearchParams(search);
        const quoteid = parseInt(params.get("quoteid"));
        if (quoteid) {
            isDisableQuoteSelect = true;
        }
        return (
            <Content
                title={"Orden de trabajo"}
                subTitle={"Crear"}
                breadCrumb={[
                    {title: "Orden de trabajo", link: "/order"},
                    {title: "Nuevo"},
                ]}
                loaded={validRenderComplete()}
                loader={this.state.loader}
            >
                <HeaderFormQuote
                    optionquote={getApprovedQuotesId()}
                    data={this.state.quote}
                    disabledQuote={isDisableQuoteSelect}
                    handleChange={handleChange}
                    disabledCustomer
                    disabledContact
                    disabledBrand
                    disabledModel
                    disabledSerie
                    disabledPlate
                    disabledColor
                    disableproductype
                    hiddenAssigned
                    hiddenStatus
                />
                <Box>
                    <Col md={4}>
                        <Select2
                            name={"workarea"}
                            label={"Area de trabajo"}
                            options={["PDI", "TALLER", "SINIESTROS", "COMERCIAL", "ALMACEN"]}
                            value={this.state.order.worktype}
                            labelPosition={"above"}
                            onChange={handleChange}
                        />
                    </Col>
                    <Col md={4}>
                        <DateRange
                            dateRangeProps={{
                                isOutsideRange: () => false,
                                withFullScreenPortal: false,
                            }}
                            label={"Fecha Inicio y Fin de Entrega"}
                            labelPosition={"above"}
                            startDateId={"startdate"}
                            endDateId={"enddate"}
                            startDate={this.state.order.startdate}
                            endDate={this.state.order.enddate}
                            onStartChange={handleChange}
                            onEndChange={handleChange}
                            readOnly={true}
                            type={"primary"}
                        />
                    </Col>
                </Box>
                <WorkTableServices
                    services={this.state.order.services}
                    handleAddSubitem={handleAddSubitem}
                    handleDelSubitem={handleDelSubitem}
                    handleChange={handleChange}
                    employees={Storage.getEmployees()}
                    handleAddService={handleAddService}
                    handleDelService={handleDelService}
                />
                <WorkTableRepuestos
                    repuestos={this.state.order.supplies}
                    handleAddRepuesto={handleAddRepuesto}
                    handleDelRepuestos={handleDelRepuestos}
                    handleChange={handleChange}
                    supplies={Storage.getOptionSuppliesOrMaterials()}
                />
                <WorkTableTrabajos
                    trabajos={this.state.order.externals}
                    handleChange={handleChange}
                    handleAddTrabajos={handleAddTrabajos}
                    handleadddetailtrabajo={handleadddetailtrabajo}
                    handleDelTrabajo={handleDelTrabajo}
                    handleDeldDetailTrabajo={handleDeldDetailTrabajo}
                />
                <Box>
                    <Col>
                        <Text
                            name={"observation"}
                            inputType={"textarea"}
                            labelPosition={"above"}
                            value={this.state.order.observation}
                            label={"Observaciones"}
                            onChange={handleChange}
                        />
                    </Col>
                </Box>
                <Box>
                    <Col md={12}>
                        <CustomButton
                            text={"Guardar"}
                            icon={"save"}
                            handle={this.handleSubmit}
                            isLoad={this.state.isLoadButton}
                            pullRight
                        />
                    </Col>
                </Box>
            </Content>
        );
    }
}

export default OrderCreate;
