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
        detail: [],
      },
      customers: [],
      products: [],
      loader: true,
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
    const id = this.props.match.params.id;
    swal({
      title: "Desea actualizar los cambios?",
      icon: "warning",
      buttons: ["Cancelar", "Actualizar"]
    })
      .then((evl) => {
        this.setState({ isLoadButton: true });
        if (evl) return API.put("invoices/" + id, this.state.invoice);
      })
      .then((res) => {
        this.setState({ isLoadButton: false });
        if (res === undefined) return;
        this.ws.send("update invoice");
        this.ws.close();
        this.props.history.push("/invoice");
        swal("Exito!", "Se actualizo correctamente la factura #" + id, "success");
      })
      .catch((err) => {
        this.setState({ isLoadButton: false });
        swal("Exito!", Utils.getMessageError(err), "success");
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
      this.setState({ loader: false });
      let idquote = Storage.getidquote(value).id;
      API.get("certify/" + idquote + "quote/")
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
          alert(
            constantes.ICON_UNICODE_ERROR + " " + Utils.getMessageError(err)
          );
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
    if (name === "status") {
      invoice.status = value;
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
    const id = this.props.match.params.id;
    API.get("invoices/" + id)
      .then((res) => {
        this.setState({ invoice: res });
      })
      .catch((err) => {
        alert(constantes.ICON_UNICODE_ERROR + " " + Utils.getMessageError(err));
      });
  }
  render() {
    const validRenderComplete = () => {
      return true && this.state.invoice.id > 0 && true;
    };
    return (
      <Content
        title={"Factura"}
        subTitle={"Modificacion"}
        breadCrumb={[
          { title: "Factura", link: "/invoice" },
          { title: this.props.match.params.id },
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
                      options={Storage.getQuotesedit()}
                      onChange={this.handleChange}
                      value={this.state.invoice.quotationid}
                      disabled
                    />
                  </Col>
                  <Col md={2} />
                  <Col md={2}>
                    <Select2
                      name={"status"}
                      labelPosition={"above"}
                      label={"Estado"}
                      options={[
                        { value: "P", label: "Registrado" },
                        { value: "A", label: "Aprobado" },
                        { value: "E", label: "Emitido" },
                        { value: "O", label: "Observado" },
                      ]}
                      value={this.state.invoice.status}
                      onChange={this.handleChange}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <Select2
                      label="Razon social"
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
                  text={"Actualizar"}
                  icon={"edit"}
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