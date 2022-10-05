import React, { Component } from "react";
import { Box, Col, Row } from "adminlte-2-react";
import { withRouter } from 'react-router';
import Content from "../components/Content";
import { Button } from "adminlte-2-react";
import Moment from "react-moment";
import Storage from "../commons/Storage";
import { constantes } from "../commons/Constantes";
import DataTable from "../components/DataTable/DataTable";
import swal from "sweetalert";
import API from "../commons/http-common";
import Utils from "../commons/Utils";
import Avatar from "../components/Avatar/Avatar";
import Badge from "../components/Badge/Badge";

class Order extends Component {
  ws = new WebSocket(constantes.API_URL_WS + "/ws");
  constructor(props) {
    super(props);
    this.state = {
      orders: null,
    };
    this.columns = [
      { title: "Nro OT", data: "id", export: true },
      { title: "Nro CT", data: "id_quote" },
      {
        title: "Fecha Transac",
        data: "regdate",
        export: true,
        render: (e) => (
          <Moment title={e} format="DD/MM/YYYY HH:mm">
            {e}
          </Moment>
        ),
      },
      { title: "Vendedor", data: "seller", export: true,
        render: (e, d) => {
          return (<Avatar src={d.seller_avatar} size={'2.6em'} title={e} />);
        }
      },
      { title: "Cliente", data: "customer", export: true },
      { title: "Tipo De Producto", data: "productype", export: true,
        render: (e, d) => {
          return (
              <>
                <span>Tipo: <small className={"text-muted"}>{d.productype}</small></span><br/>
                <span>Serie: <small className={"text-muted"}>{d.serie}</small></span><br/>
                <span>Placa: <small className={"text-muted"}>{d.plate}</small></span>
              </>
          )
        }
      },
      { title: "Serie", data: "serie", export: true, visibility: false },
      { title: "N° Placa", data: "plate", export: true, visibility: false },
      {
        title: "Fecha de inicio",
        data: "startdate",
        export: true,
        render: (e) => (
          <Moment title={e} format="DD/MM/YYYY">
            {e}
          </Moment>
        ),
      },
      {
        title: "Fecha de entrega",
        data: "enddate",
        export: true,
        render: (e) => (
          <Moment title={e} format="DD/MM/YYYY">
            {e}
          </Moment>
        ),
      },
      { title: "Estado", data: "status", export: true,
        render: e => <Badge variant={Utils.getVariantOfStatus(e)}>{e}</Badge>
      },
      {
        title: "Acción",
        data: "action",
        sort: false,
        render: (e, d) => {
          if (Storage.getUsername().profile === "vendedor") {
            return (
              <div style={{ minWidth: "101px" }}>
                <Button
                  disabled={!d.action.flow}
                  size={"xs"}
                  icon={"fa-truck"}
                  onClick={() =>
                    this.props.history.push("/certify/create?order=" + d.id)
                  }
                />
                <Button
                  disabled={!d.action.view}
                  size={"xs"}
                  icon={"fa-eye"}
                  onClick={() => this.props.history.push("/order/" + d.id)}
                />
                <Button
                  disabled={!d.action.edit}
                  size={"xs"}
                  icon={"fa-edit"}
                  onClick={() =>
                    this.props.history.push("/order/" + d.id + "/edit")
                  }
                />
              </div>
            );
          }
          if (Storage.getUsername().profile === "Administrador") {
            return (
              <div style={{ minWidth: "101px" }}>
                <Button
                  disabled={!d.action.flow}
                  size={"xs"}
                  icon={"fa-truck"}
                  onClick={() =>
                    this.props.history.push("/certify/create?order=" + d.id)
                  }
                />
                <Button
                  size={"xs"}
                  icon={"fa-eye"}
                  onClick={() => this.props.history.push("/order/" + d.id)}
                />
                <Button
                  disabled={!d.manage}
                  size={"xs"}
                  icon={"fa-edit"}
                  onClick={() =>
                    this.props.history.push("/order/" + d.id + "/edit")
                  }
                />
                <Button
                  disabled={!d.manage}
                  size={"xs"}
                  icon={"fa-trash"}
                  onClick={this.handleDeleteorder.bind(this, d.id)}
                />
              </div>
            );
          }
          return (
            <div style={{ minWidth: "101px" }}>
              <Button
                disabled={!d.action.flow}
                size={"xs"}
                icon={"fa-truck"}
                onClick={() =>
                  this.props.history.push("/certify/create?order=" + d.id)
                }
              />
              <Button
                disabled={!d.action.view}
                size={"xs"}
                icon={"fa-eye"}
                onClick={() => this.props.history.push("/order/" + d.id)}
              />
              <Button
                disabled={!d.action.edit}
                size={"xs"}
                icon={"fa-edit"}
                onClick={() =>
                  this.props.history.push("/order/" + d.id + "/edit")
                }
              />
              <Button
                disabled={!d.action.drop}
                size={"xs"}
                icon={"fa-trash"}
                onClick={this.handleDeleteorder.bind(this, d.id)}
              />
            </div>
          );
        },
      },
    ];
    this.handleDeleteorder = this.handleDeleteorder.bind(this);
  }

  handleDeleteorder(id) {
    swal({
      icon: "warning",
      title: "Eliminar orden de trabajo",
      text: "Esta seguro de eliminar la orden de trabajo #" + id + "?",
      dangerMode: true,
      buttons: ["Cancelar", "Eliminar"]
    }).then((evl) => {
      if (evl) return API.delete("orders/" + id);
    }).then((res) => {
      if (res === undefined) return;
      this.ws.send("delete order");
      swal("Exito!", " Se ha eliminado la orden de trabajo #" + id, "success");
      const orders = this.state.orders.filter((order) => order.id !== id);
      this.setState({ orders: orders });
    }).catch((err) => {
      swal("Error!", Utils.getMessageError(err), "error");
    });
  }

  componentWillMount() {
    let user = Storage.getUsername();
    let apiOrders = "employee/" + user.employeeid + "/orders";
    if (user.profile === "Administrador") {
      apiOrders = "orders";
    }
    API.get(apiOrders)
      .then((res) => {
        const orders = res;
        this.setState({ orders: orders });
      })
      .catch((err) => {
        swal("Error!", Utils.getMessageError(err), "error");
      });
  }
  componentWillUnmount() {
    if (this.ws) this.ws.close();
  }
  render() {
    this.handleDeleteorder = this.handleDeleteorder.bind(this);
    const validRenderComplete = () => {
      return true && this.state.orders && true;
    };
    return (
      <Content
        title={"Orden de trabajo"}
        subTitle="Lista"
        loaded={validRenderComplete()}
      >
        <Box
          header={
            <Button
              to={"order/create"}
              text={"Nueva Orden de trabajo"}
              type={"danger"}
              pullRight
            />
          }
        >
          <Row>
            <Col xs={12}>
              <DataTable
                name={"ORDEN_DE_TRABAJO"}
                columns={this.columns}
                data={this.state.orders}
                messageNoRecords={"No existe ninguna orden de trabajo"}
                showSearch={true}
                sortTable={true}
                showRowsLimit={true}
                exportButton={true}
                responsive
              />
            </Col>
          </Row>
        </Box>
      </Content>
    );
  }
}

export default withRouter(Order);
