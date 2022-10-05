import React, { Component } from "react";
import Content from "../../components/Content";
import { Box, Col, Row } from "adminlte-2-react";
import Moment from "react-moment";
import { constantes } from "../../commons/Constantes";
import "../../components/CustomTable.css";
import API from "../../commons/http-common";
import Storage from "../../commons/Storage";
import Utils from "../../commons/Utils";

class QuoteView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quotations: {},
    };
    this.columns = [
      {
        title: "Descripcion",
        width: 200,
        data: "description",
        render: (e, idx, d) => (
          <div>
            {d.description}
            <br />
            <i>{d.description2}</i>
          </div>
        ),
      },
      { title: "Cantidad", width: 10, align: "right", data: "amount" },
      {
        title: "Precio unitario",
        width: 10,
        align: "right",
        data: "unitprice",
      },
      { title: "Precio total", width: 10, align: "right", data: null },
    ];
  }
  componentDidMount() {
    const id = this.props.match.params.id;
    API.get("viewquotes/" + id)
      .then((res) => {
        this.setState({ quotations: res });
      })
      .catch((err) => {
        alert(constantes.ICON_UNICODE_ERROR + " " + Utils.getMessageError(err));
      });
  }
  render() {
    const id = this.props.match.params.id;
    const breadCrumb = [{ title: "Cotizacion", link: "/quote" }, { title: id }];
    const details = this.state.quotations.detail;
    const formatCurrency = this.state.quotations.currency;

    const currency = formatCurrency ? formatCurrency : "PEN";
    const formatter = new Intl.NumberFormat(
      currency === "PEN" ? "es-PE" : "en-US",
      {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
      }
    );
    const convertCurrency =
      currency === "PEN" ? 1 : 1 / Storage.getDollarPrice();

    const price = details
      ? details.map((d) => d.amount * d.unitprice).reduce((a, b) => a + b)
      : null * convertCurrency;
    const igv = price * 0.18;
    const total = price + igv;
    const validRenderComplete = () => {
      return true && this.state.quotations.id >= 0 && true;
    };
    return (
      <Content
        title={"Cotización"}
        subTitle="Detalle"
        breadCrumb={breadCrumb}
        loaded={validRenderComplete()}
      >
        <Box title={""} solid>
          <Row>
            <Col md={1} />
            <Col xs={7}>
              <h3>
                <img
                  alt={""}
                  src={"../../logo.png"}
                  height={64}
                  align={"left"}
                />
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
              <h3 className={"text-center"}>
                Nro de Cotizacion
                <span className={"square-code"}>
                  CT000{this.state.quotations.id}
                </span>
              </h3>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col xs={1} />
            <Col xs={7}>
              <table className={"table table-bordered-bw"}>
                <tbody>
                  <tr>
                    <th style={{ width: 120 }}>Cliente: </th>
                    <td>{this.state.quotations.customer}</td>
                  </tr>
                  <tr>
                    <th>Atención: </th>
                    <td>{this.state.quotations.contact}</td>
                  </tr>
                  <tr>
                    <th>Elaborado por: </th>
                    <td>{this.state.quotations.seller}</td>
                  </tr>
                  <tr>
                    <th style={{ width: 150 }}>Fecha:</th>
                    <td>
                      <Moment
                        title={this.state.quotations.issue}
                        format="DD/MM/YYYY"
                      >
                        {this.state.quotations.issue}
                      </Moment>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Col>
            <Col xs={3}>
              <table className={"table table-bordered-bw"}>
                <tbody>
                  <tr>
                    <th style={{ width: 150 }}>Marca:</th>
                    <td>{this.state.quotations.brand}</td>
                  </tr>
                  <tr>
                    <th>Modelo:</th>
                    <td>{this.state.quotations.model}</td>
                  </tr>
                  <tr>
                    <th>Color: </th>
                    <td>{this.state.quotations.color}</td>
                  </tr>
                  <tr>
                    <th>Tipo De Producto: </th>
                    <td>{this.state.quotations.productype}</td>
                  </tr>
                  <tr>
                    <th>Placa:</th>
                    <td>{this.state.quotations.plate}</td>
                  </tr>
                  <tr>
                    <th>Serie:</th>
                    <td>{this.state.quotations.serie}</td>
                  </tr>
                </tbody>
              </table>
            </Col>
            <Col xs={1} />
          </Row>
          <Row>
            <Col xs={1} />
            <Col xs={10}>
              <table className={"table table-bordered-bw"}>
                <thead>
                  <tr>
                    <th className={"text-center"} style={{ width: 40 }}>
                      Item
                    </th>
                    <th className={"text-center"} style={{ width: 300 }}>
                      Descripcion
                    </th>
                    <th className={"text-center"} style={{ width: 60 }}>
                      Cantidad
                    </th>
                    <th className={"text-center"} style={{ width: 60 }}>
                      P. Unit.
                    </th>
                    <th className={"text-center"} style={{ width: 60 }}>
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {details
                    ? details.map((detail, idx) => {
                        return (
                          <tr key={idx}>
                            <td className={"text-center"}>{idx + 1}</td>
                            <td className={"text-left"}>
                              {detail.description}
                            </td>
                            <td className={"text-center"}>{detail.amount}</td>
                            <td className={"text-right"}>
                              {formatter.format(detail.unitprice)}
                            </td>
                            <td className={"text-right"}>
                              {formatter.format(
                                detail.amount * detail.unitprice
                              )}
                            </td>
                          </tr>
                        );
                      })
                    : null}
                  <tr>
                    <td colSpan={3} rowSpan={3} className={"no-border"}></td>
                    <th>Valor Venta</th>
                    <td className={"text-right"}>{formatter.format(price)}</td>
                  </tr>
                  <tr>
                    <th>IGV</th>
                    <td className={"text-right"}>{formatter.format(igv)}</td>
                  </tr>
                  <tr>
                    <th>Precio Total</th>
                    <td className={"text-right"}>{formatter.format(total)}</td>
                  </tr>
                </tbody>
              </table>
            </Col>
          </Row>
        </Box>
      </Content>
    );
  }
}
export default QuoteView;
