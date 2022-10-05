import React, { Component } from 'react';
import Content from "../../components/Content";
import { Box, Col, Row } from "adminlte-2-react";
import SaleTable2 from "../../components/SaleTable2";
import HeaderFormQuote from "../../components/HeaderFormQuote";
import Utils from "../../commons/Utils";
import { constantes } from '../../commons/Constantes';
import API from "../../commons/http-common";
import CustomButton from '../../components/CustomButton/CustomButton';
import swal from "sweetalert";
import { v4 as uuid } from 'uuid';
import Storage from "../../commons/Storage";

class QuoteEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quotation: {},
            customers: [],
            products: [],
            isLoadButton: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    ws = new WebSocket(constantes.API_URL_WS + '/ws');
    handleSubmit(event) {

        let id = this.props.match.params.id;
        let title = "Desea actualizar los cambios?"
        if (!(this.state.quotation.detail != null && this.state.quotation.detail.length > 0)) {
            swal("Advertencia", ' La cotización debe tener al menos un item', "warning")
            return
        }
        swal({
            title: title,
            icon: "warning",
            buttons: ["Cancelar", "Actualizar"]
        }).then((evl) => {
            this.setState({ isLoadButton: true });
            const quote = {...this.state.quotation, status: Utils.getKeyStatus(this.state.quotation.status)}
            console.log(quote)
            if (evl) return API.put("quotes/" + id, quote);
        }).then(res => {
            this.setState({ isLoadButton: false });
            if (res === undefined) return;
            this.ws.send("update quote");
            this.ws.close();
            this.props.history.push("/quote");
            swal("Exito!", "Se actualizó correctamente la cotización", "success");
        }).catch(err => {
            this.setState({ isLoadButton: false });
            swal("Error!", Utils.getMessageError(err), "error")
        });
    }

    async componentWillMount() {

        try {
            const quoteId = this.props.match.params.id;
            const quote = await API.get(`quotes/${quoteId}`);
            const quoteLines = await API.get(`quotes/${quoteId}/quoteLines`);
            this.setState({quotation: {...quote, detail: quoteLines}});
            console.log(quote)
            console.log(quoteLines)
        } catch (e) {
            alert(constantes.ICON_UNICODE_ERROR + " " + Utils.getMessageError(e));
        }
    }
    render() {
        const handleChange = e => {
            const calculateAmount = (product) => {
                const { rate, quantity } = product;
                return parseFloat(rate * quantity);
            }

            let id = e.target.name.split('-')[1];
            let name = e.target.name.split('-').length > 0 ? e.target.name.split('-')[0] : e.target.name;
            let value = e.target.value;
            let quotation = { ...this.state.quotation };
            if (name === 'brand') {
                quotation.brand = value;
            }
            if (name === 'model') {
                quotation.model = value;
            }
            if (name === 'plate') {
                quotation.plate = value;
            }
            if (name === 'serie') {
                quotation.serie = value;
            }
            if (name === 'color') {
                quotation.color = value;
            }
            if (name === 'productype') {
                quotation.productype = value;
            }
            if (name === 'currency') {
                const exchange = quotation.currency + "-" + value;
                for (let index = 0; index < quotation.detail.length; index++) {
                    quotation.detail[index]["unitprice"] = Utils.currencyConverter(quotation.detail[index]["unitprice"], exchange);
                }
                quotation.currency = value;
            }
            if (name === 'customer') {
                quotation.customer_id = parseInt(value);
            }
            if (name === 'category') {
                quotation.detail[id]["category"] = value;
            }
            if (name === 'status') {
                quotation.status = value;
            }
            if (name === 'employee') {
                quotation.employee.id = parseInt(value);
            }
            if (name === 'contact') {
                quotation.contact = value;
            }
            if (name === 'product_id') {
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
            if (name === 'description') {
                quotation.detail[id]["description"] = value;
            }
            if (name === 'quantity') {
                quotation.detail[id]["quantity"] = parseFloat(value);
                quotation.detail[id]["amount"] = calculateAmount(quotation.detail[id])
            }
            if (name === 'rate') {
                quotation.detail[id]["rate"] = parseFloat(value);
                quotation.detail[id]["amount"] = calculateAmount(quotation.detail[id])
            }
            quotation.total = quotation.detail && quotation.detail.length > 0 ?
                quotation.detail.map(q => q.amount).reduce((a, b) => a + b) * constantes.IVG : 0;
            this.setState({
                quotation: quotation
            });
        };
        const handleAddItem = () => {
            let detail = {};
            detail.idx = uuid();
            detail.id = null;
            detail.product_id = 0;
            detail.description = '';
            detail.rate = 0.00;
            detail.quantity = 1;
            detail.amount = 0.00;
            let quotation = { ...this.state.quotation };
            quotation.detail = [...this.state.quotation.detail ? this.state.quotation.detail : [], detail];
            this.setState({
                quotation: quotation
            });
        };
        const handleDelItem = idx => {
            let quotation = { ...this.state.quotation };
            quotation.detail = quotation.detail.filter(detail => detail.idx !== idx);
            quotation.total = quotation.detail && quotation.detail.length > 0 ?
                quotation.detail.map(q => q.amount).reduce((a, b) => a + b) * constantes.IVG : 0;
            this.setState({
                quotation: quotation
            })
        };
        const validRenderComplete = () => {
            return true
                && this.state.quotation.id >= 0
                && true;
        };
        const ButtonUpdate = () => {
            return <CustomButton
                text={"Actualizar"}
                icon={"edit"}
                handle={this.handleSubmit}
                isLoad={this.state.isLoadButton}
            />
        };

        return (<Content title={"Cotización"} subTitle={'Modificación'} breadCrumb={[
            { title: "Cotización", link: "/quote" },
            { title: this.props.match.params.id },
        ]} loaded={validRenderComplete()} loader={this.state.loader}>

            <HeaderFormQuote
                data={this.state.quotation}
                handleChange={handleChange}
                hiddenQuote
                disabledCustomer
            />
            <Box footer={<ButtonUpdate />} title={'Servicios/Repuestos'}>
                <Row>
                    <Col xs={12}>
                        <SaleTable2
                            details={this.state.quotation.detail}
                            handleAddItem={handleAddItem}
                            handleDelItem={handleDelItem}
                            handleChange={handleChange}
                            currency={this.state.quotation.currency}
                        />
                    </Col>
                </Row>
            </Box>
        </Content>)
    }
}
export default QuoteEdit;
