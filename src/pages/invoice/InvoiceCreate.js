import React, { Component } from "react";
import { Box, Col, Inputs, Row } from "adminlte-2-react";
import Content from "../../components/Content";
import SaleTable2 from "../../components/SaleTable2";
import Utils from "../../commons/Utils";
import Storage from "../../commons/Storage";
import { constantes } from "../../commons/Constantes";
import API from "../../commons/http-common";
import CustomButton from "../../components/CustomButton/CustomButton";
import swal from "sweetalert";
import { v4 as uuid } from 'uuid';
const { Text, Select2 } = Inputs;
class InvoiceCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invoice: {
        currency: "PEN",
        detail: [],
      },
      customers: [],
      products: [],
      loader: true,
      loaded:true,
      disabled: false,
      isLoadButton: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleDelItem = this.handleDelItem.bind(this);
  }
  handleAddItem(event) {
    let detail = {};
    detail.idx = uuid();
    detail.id = null;
    detail.quantity = 1;
    detail.product = 0;
    detail.description = "";
    detail.unitprice = 0.0;
    detail.price = 0.0;
    let invoice = { ...this.state.invoice };
    invoice.detail = [...this.state.invoice.detail, detail];
    this.setState({
      invoice: invoice,
    });
  }
  handleDelItem = (idx) => {
    let invoices = { ...this.state.invoice };
    invoices.detail = invoices.detail.filter((detail) => detail.idx !== idx);
    this.setState({
      invoice: invoices,
    });
  };
  ws = new WebSocket(constantes.API_URL_WS + "/ws");
  handleSubmit(event) {
    let title = "Desea guardar los cambios?";
    if (!this.state.invoice.quotationid) {
      swal("Advertencia", " Debe ingresar el numero de CT", "warning");
      return;
    }
    let invoice = { ...this.state.invoice };
    invoice.subtotal = Number((invoice.total / 1.18).toFixed(2));
    invoice.tax = Number((invoice.subtotal * 0.18).toFixed(2));
    swal({
      title: title,
      icon: "warning",
      buttons: ["Cancelar", "Guardar"]
    }).then((evl) => {
      this.setState({ isLoadButton: true });
      if (evl) return API.post("invoices", invoice);
    }).then((res) => {
      this.setState({ isLoadButton: false });
      if (res === undefined) return;
      this.ws.send("create invoice");
      this.ws.close();
      this.props.history.push("/invoice");
      swal("Exito!", "Se registro correctamente la factura", "success");
    }).catch((err) => {
      this.setState({ isLoadButton: false });
      swal("Error!", Utils.getMessageError(err), "error");
    });
  }

  handleChange(e) {
    let id = e.target.name.split("-")[1];
    let name =
      e.target.name.split("-").length > 0
        ? e.target.name.split("-")[0]
        : e.target.name;
    let value = e.target.value;
    let invoice = { ...this.state.invoice };
    let thatRender = true;
    if (name === "quotes") {
      invoice.quotationid = parseInt(value);
      thatRender = false;
      this.setState({ loader: false, disabled: true });
      let idquote = Storage.getidquote(value).id;
      API.get("certify/" + idquote + "/quote")
        .then((res) => {
          invoice.quotationid = parseInt(res.idquote);
          invoice.employeeid = res.employee_id;
          invoice.customerid = res.customer_id;
          invoice.ruc = res.ruc;
          invoice.direccion = res.direccion;
          invoice.contact = res.contact;
          invoice.currency = res.currency;
          invoice.total = res.total;
          invoice.detail = res.detail;
          this.setState({ invoice: invoice, loader: true, disabled: false });
        })
        .catch((err) => {
          alert(
            constantes.ICON_UNICODE_ERROR + " " + Utils.getMessageError(err)
          );
          this.setState({ loader: true, disabled: false });
        });
    }
    if (name === "currency") {
      const exchange = invoice.currency + "-" + value;
      for (let index = 0; index < invoice.detail.length; index++) {
        invoice.detail[index]["unitprice"] = Utils.currencyConverter(
          invoice.detail[index]["unitprice"],
          exchange
        );
      }
      invoice.currency = value;
    }
    if (name === "customer") {
      invoice.customer = parseInt(value);
    }
    if (name === "contact") {
      invoice.contact = value;
    }
    if (name === "product") {
      invoice.detail[id]["product"] = parseInt(value);
      invoice.detail[id]["unitprice"] = Utils.currencyConverter(
        this.state.products.find((p) => p.id === parseInt(value)).unitprice,
        "PEN-" + invoice.currency
      );
    }
    if (name === "description") {
      invoice.detail[id]["description"] = value;
    }
    if (name === "quantity") {
      invoice.detail[id]["quantity"] = parseInt(value);
    }
    if (name === "unitprice") {
      invoice.detail[id]["unitprice"] = parseFloat(value);
    }
    if (["product", "quantity", "unitprice"].includes(name)) {
      invoice.detail = invoice.detail.map((detail) => {
        detail.price = detail.quantity * detail.unitprice;
        return detail;
      });
      if (invoice.detail.length > 1)
        invoice.total =
          invoice.detail.map((q) => q.price).reduce((a, b) => a + b) * 1.18;
      else invoice.total = invoice.detail[0].price * 1.18;
    }
    if (thatRender) {
      this.setState({ invoice: invoice });
    }
  }

  componentWillMount() {
    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    const quoteid = parseInt(params.get("certify"));
    let apiCertify = Utils.getApi("certifys")
    let invoice = { ...this.state.invoice };
    if (quoteid) {
      this.setState({ loader: false, disabled: true });
      API.get("certify/" + quoteid + "/quote")
        .then((res) => {
          invoice.quotationid = parseInt(res.idquote);
          invoice.employeeid = res.employee_id;
          invoice.customerid = res.customer_id;
          invoice.ruc = res.ruc;
          invoice.direccion = res.direccion;
          invoice.contact = res.contact;
          invoice.currency = res.currency;
          invoice.total = res.total;
          invoice.detail = res.detail;
          this.setState({ invoice: invoice, loader: true });
        })
        .catch((err) => {
          swal("Error!", Utils.getMessageError(err), "error");
        });
    }else{
    this.setState({loaded:false})
    API.get(apiCertify)
    .then(res =>{
      this.setState({loaded:true})
    })
    .catch((err)=>{
      swal("Error!", Utils.getMessageError(err), "error");
    })
    }
  }
  render() {
    const validRenderComplete = () => {
      return true && this.state.loaded &&true;
    };
    return (
      <Content
        title={"Factura"}
        subTitle={"Crear"}
        breadCrumb={[
          { title: "Factura", link: "/invoice" },
          { title: "Nuevo" },
        ]}
        loaded={validRenderComplete()}
        loader={this.state.loader}
      >
        <Row>
          <Col xs={12}>
            <Box title={"Datos Generales"}>
              <Col xs={12}>
                <Row>
                  <Col md={3}>
                    <Select2
                      name={"quotes"}
                      label="Cotizacion"
                      labelPosition="above"
                      options={Storage.getquotesforinvoice()}
                      onChange={this.handleChange}
                      value={this.state.invoice.quotationid}
                      disabled={this.state.disabled}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <Select2
                      label="Razon Social"
                      options={Storage.getCustomers()}
                      name={"customer"}
                      value={this.state.invoice.customerid}
                      onChange={this.handleChange}
                      labelPosition="above"
                      disabled
                    />
                    <Text
                      label="Ruc"
                      name={"contact"}
                      value={this.state.invoice.ruc}
                      onChange={this.handleChange}
                      labelPosition="above"
                      disabled
                    />
                    <Text
                      label="Dirección"
                      name={"contact"}
                      value={this.state.invoice.direccion}
                      onChange={this.handleChange}
                      labelPosition="above"
                      disabled
                    />
                  </Col>
                </Row>
              </Col>
            </Box>
            <Box
              collapsable
              title={"Descripción general del Servicio/Repuesto"}
            >
              <Col xs={12}>
                <SaleTable2
                  invoicerestric={true}
                  details={this.state.invoice.detail}
                  handleAddItem={this.handleAddItem}
                  handleDelItem={this.handleDelItem}
                  handleChange={this.handleChange}
                  listProducts={Storage.getSuppliesAll()}
                  currency={this.state.invoice.currency}
                />
              </Col>
              <Col xs={12}>
                <CustomButton
                  text={"Guardar"}
                  icon={"save"}
                  handle={this.handleSubmit}
                  isLoad={this.state.isLoadButton}
                />
              </Col>
            </Box>
          </Col>
        </Row>
      </Content>
    );
  }
}
export default InvoiceCreate;
