import React, {Component} from 'react';
import Content from "../../components/Content";
import {Box, Col, Inputs} from "adminlte-2-react";
import HeaderFormQuote from "../../components/HeaderFormQuote";
import Utils from "../../commons/Utils";
import utils from "../../commons/Utils";
import CustomButton from "../../components/CustomButton/CustomButton";
import WorkTableRepuestos from '../../components/WorkTableRepuestos';
import WorkTableTrabajos from '../../components/WorkTableTrabajos';
import WorkTableServices from "../../components/WorkTableServices";
import QuoteService from '../../services/QuoteService';
import Storage from "../../commons/Storage";
import {constantes} from '../../commons/Constantes';
import API from "../../commons/http-common";
import swal from "sweetalert";
import {v4 as uuid} from 'uuid';

const {Select2, DateRange, Text} = Inputs;

class OrderEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoadButton: false,
            order: {},
            quote: {}
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    ws = new WebSocket(constantes.API_URL_WS + '/ws');

    handleSubmit(event) {
        const quoteid = this.state.order.quoteid;
        const order = this.state.order;
        console.log(order)
        const ordertotal = Utils.calcTotalFromOrder(order);
        const quotetotal = Utils.formatCurrencytoPen(quoteid);
        if (!quoteid) {
            swal("Advertencia", " Debe ingresar el número de cotización", "warning")
            return
        }
        if (!order.startdate) {
            swal("Advertencia", " Debe Ingresar la fecha de inicio", "warning");
            return;
        }
        if (!order.enddate) {
            swal("Advertencia", " Debe Ingresar la fecha fin", "warning");
            return;
        }
        const id = this.props.match.params.id;
        const isExceedBudget = (ordertotal - quotetotal > 0)
        let title = "";
        let text = "Desea actualizar los cambios?";
        let icon = ""
        if (isExceedBudget) {
            title = "Desea Continuar?";
            text = "El monto total de esta Orden de trabajo supera al monto total de la cotizacion";
            icon = "warning";
        }
        swal({
            title: title,
            text: text,
            icon: icon,
            buttons: ["Cancelar", "Actualizar"]
        }).then((evl) => {
            this.setState({isLoadButton: true});
            if (evl) return API.put("orders/" + id, this.state.order);
        }).then((res) => {
            this.setState({isLoadButton: false});
            if (res === undefined) return;
            this.ws.send("update order");
            this.ws.close();
            this.props.history.push("/order");
            swal("Exito!", "Se actualizó correctamente la orden de trabajo", "success");
        }).catch(err => {
            this.setState({isLoadButton: false});
            swal("Error!", Utils.getMessageError(err), "error");
        });
    }

    async componentWillMount() {
        const orderId = this.props.match.params.id;
        try {
            const order = await API.get("orders/" + orderId);
            this.setState({
                order: order,
                quote: await API.get("quotes/" + order.quoteid)
            })
        } catch (e) {
            alert(constantes.ICON_UNICODE_ERROR + " " + Utils.getMessageError(e));
        }

    }

    render() {
        const validRenderComplete = () => {
            return true
                && this.state.order.id >= 0
                && this.state.quote.id >= 0
                && true;
        };
        const handleChange = e => {
            let value = e.target.value;
            let subid = e.target.name.split('-').length > 2 ? e.target.name.split('-')[2] : e.target.id;
            let id = e.target.name.split('-').length > 1 ? e.target.name.split('-')[1] : e.target.id;
            let name = e.target.name.split('-').length > 0 ? e.target.name.split('-')[0] : e.target.name;
            let order = {...this.state.order};
            let thatRender = true;
            if (name === "quoteid") {
                order.quoteid = value ? parseInt(value) : 0;
                QuoteService.get(value)
                    .then(response => {
                        this.setState({quote: response.data})
                    })
                    .catch(e => {
                    });
            }
            if (name === "workarea") {
                order.workarea = value;
            }
            if (name === "startdate" && value) {

                order.startdate = value;
                order.enddate = value;
            }
            if (name === "enddate" && value) {
                if (order.enddate === value) {
                    thatRender = false;
                } else {
                    order.enddate = value;
                }
            }
            if (name === "status") {
                order.status = value;
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
                order.services[id].details[subid].salary = Storage.getEmployeePerId(value).salary;
            }
            if (name === "hours") {
                order.services[id].details[subid].hours = value ? parseFloat(value) : value;
            }
            if (name === "cloths") {
                order.services[id].details[subid].cloths = value ? parseFloat(value) : value;
            }
            //REPUESTOS
            if (name === "item") {
                order.supplies[id].item = value;
            }
            if (name === "description") {
                order.supplies[id].description = value;
                order.supplies[id].codigo = Storage.getSuppliesCodePerDescription(value).code;
                order.supplies[id].saleprice = parseFloat(Storage.getSuppliesCodePerDescription(value).unitprice);
                order.supplies[id].unit = Storage.getSuppliesCodePerDescription(value).measurement;
            }
            if (name === "description") {
                order.supplies[id].description = value;
            }
            if (name === "code") {
                order.supplies[id].codigo = value;
            }
            if (name === "saleprice") {
                order.supplies[id].saleprice = value ? parseFloat(value) : value;
            }
            if (name === "unit") {
                order.supplies[id].unit = value;
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
                order.externals[id].details[subid].purcharsecost = value ? parseFloat(value) : value;
            }
            if (name === "salepriceT") {
                order.externals[id].details[subid].saleprice = value ? parseFloat(value) : value;
            }
            if (name === "quantityT") {
                order.externals[id].details[subid].quantity = value ? parseFloat(value) : value;
            }
            if (thatRender) {
                this.setState({order: order});
            }
        }
        const handleAddService = (e) => {
            let order = {...this.state.order};
            let newService = {
                idx: uuid(),
                description: "",
                details: []
            };
            order.services = [...this.state.order.services ? this.state.order.services : [], newService];
            this.setState({
                order: order
            })
        };
        const handleDelService = idx => {
            let order = {...this.state.order};
            order.services = order.services.filter(services => services.idx !== idx);
            this.setState({
                order: order
            })
        };
        const handleAddRepuesto = (e) => {
            let order = {...this.state.order};
            let newrepuesto = {
                idx: uuid(),
                item: 0,
                description: "",
                codigo: "",
                saleprice: 0.00,
                unit: "",
                quantity: 0
            };
            order.supplies = [...this.state.order.supplies ? this.state.order.supplies : [], newrepuesto];
            this.setState({
                order: order
            })
        };
        const handleDelRepuestos = idx => {
            let order = {...this.state.order};
            order.supplies = order.supplies.filter(supplies => supplies.idx !== idx);
            this.setState({
                order: order
            })
        };
        const handleAddTrabajos = idx => {
            let order = {...this.state.order};
            let newtrabajo = {
                idx: uuid(),
                description: "",
                details: []
            };
            order.externals = [...this.state.order.externals ? this.state.order.externals : [], newtrabajo]
            this.setState({
                order: order
            })
        };
        const handleDelTrabajo = idx => {
            let order = {...this.state.order};
            order.externals = order.externals.filter(external => external.idx !== idx);
            this.setState({
                order: order
            })
        };
        const handleadddetailtrabajo = idx => {
            let order = {...this.state.order}
            let id = order.externals.findIndex(d => d.idx === idx);
            let subdetail = {};//} new Object();
            subdetail.idx = uuid();
            subdetail.docnum = "";
            subdetail.fullname = "";
            subdetail.purcharsecost = 0.00;
            subdetail.saleprice = 0.00;
            subdetail.quantity = 0;
            order.externals[id].details = [...order.externals[id].details ? order.externals[id].details : [], subdetail];
            this.setState({
                order: order
            });
        }
        const handleDeldDetailTrabajo = (idx, subidx) => {
            let order = {...this.state.order};
            let id = order.externals.findIndex(d => d.idx === idx);
            order.externals[id].details = order.externals[id].details.filter(detail => detail.idx !== subidx);
            this.setState({
                order: order
            })
        };

        const handleAddSubitem = idx => {
            let order = {...this.state.order};
            let id = order.services.findIndex(d => d.idx === idx);
            let subdetail = {};
            subdetail.idx = uuid();
            subdetail.worktype = "";
            subdetail.employee = "";
            subdetail.hours = 0;
            subdetail.cloths = 0;
            order.services[id].details = [...order.services[id].details ? order.services[id].details : [], subdetail];
            this.setState({
                order: order
            });
        }
        const handleDelSubitem = (idx, subidx) => {
            let order = {...this.state.order};
            let id = order.services.findIndex(d => d.idx === idx);
            order.services[id].details = order.services[id].details.filter(detail => detail.idx !== subidx);
            this.setState({
                order: order
            })
        };
        let isDisabledCustomer = true;
        const search = this.props.location.search;
        const params = new URLSearchParams(search);
        const quoteid = parseInt(params.get('quoteid'));
        if (quoteid) {
            isDisabledCustomer = true;
        }

        const getApprovedQuotesId = () => {
            const { id: quoteId } = this.state.quote
            return [{value: quoteId, label: utils.maskQuoteId(quoteId)}];
        }

        return (<Content
            title={"Orden de trabajo"}
            subTitle={'Modificación'}
            breadCrumb={[
                {title: "Orden de trabajo", link: "/order"},
                {title: this.props.match.params.id},
            ]}
            loaded={validRenderComplete()}
        >
            <HeaderFormQuote
                optionquote={getApprovedQuotesId()}
                data={this.state.quote}
                handleChange={handleChange}
                disabledQuote
                disabledCustomer={isDisabledCustomer}
                disabledContact
                disabledBrand
                disabledModel
                disabledSerie
                disabledPlate
                disableproductype
                disabledColor
                hiddenStatusQuote
                optionStatus={[
                    {value: 'E', label: 'En proceso'},
                    {value: 'T', label: 'Terminado'},
                    {value: 'R', label: 'Rechazado'},
                    {value: 'F', label: 'Facturado'}
                ]}
                dataStatusOrder={this.state.order.status}
            />
            <Box>
                <Col md={4}>
                    <Select2
                        name={'workarea'}
                        label={'Area de trabajo'}
                        options={['PDI', 'TALLER', 'SINIESTROS', 'COMERCIAL', 'ALMACEN']}
                        value={this.state.order.workarea}
                        labelPosition={'above'}
                        onChange={handleChange}
                    />
                </Col>
                <Col md={4}>
                    <DateRange
                        label={'Fecha Inicio y Fin de Entrega'}
                        labelPosition={'above'}
                        startDateId={'startdate'}
                        endDateId={'enddate'}
                        dateRangeProps={{isOutsideRange: () => null, withFullScreenPortal: false}}
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
                supplies={Storage.getSupplies()}
            />
            <WorkTableTrabajos
                trabajos={this.state.order.externals}
                handleAddTrabajos={handleAddTrabajos}
                handleadddetailtrabajo={handleadddetailtrabajo}
                handleDelTrabajo={handleDelTrabajo}
                handleDeldDetailTrabajo={handleDeldDetailTrabajo}
                handleChange={handleChange}
            />
            <Box>
                <Col>
                    <Text
                        name={'observation'}
                        inputType={'textarea'}
                        labelPosition={'above'}
                        value={this.state.order.observation}
                        label={'Observaciones'}
                        onChange={handleChange}
                    />
                </Col>
            </Box>
            <Box>
                <Col>
                    <CustomButton
                        icon={'save'}
                        text={'Actualizar'}
                        isLoad={this.state.isLoadButton}
                        handle={this.handleSubmit}
                        pullRight
                    />
                </Col>
            </Box>
        </Content>)
    }
}

export default OrderEdit;
