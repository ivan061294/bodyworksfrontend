import React, { Component } from "react";
import Content from "../components/Content";
import { Box, Button, Row, Col } from "adminlte-2-react";
import Moment from "react-moment";
import Storage from "../commons/Storage";
import DataTable from "../components/DataTable/DataTable";
import { constantes } from "../commons/Constantes";
import Utils from "../commons/Utils";
import API from "../commons/http-common";
import swal from "sweetalert";
import Badge from "../components/Badge/Badge";

class Certify extends Component {
  ws = new WebSocket(constantes.API_URL_WS + "/ws");
  constructor(props) {
    super(props);
    this.state = {
      certifys: null,
    };
    this.columns = [
      { title: "Nro Acta", data: "id" },
      {
        title: "Fecha emision",
        data: "regdate",
        render: (e) => (
          <Moment title={e} format="DD/MM/YYYY HH:MM">
            {e}
          </Moment>
        ),
      },
      { title: "Cliente", data: "customer" },
      { title: "Marca", data: "brand" },
      { title: "Modelo", data: "model" },
      { title: "N° Placa", data: "plate" },
      { title: "Serie", data: "serie" },
      { title: "Solicitado por", data: "contact" },
      { title: "Orden de Compra", data: "pucharseorder" },
      { title: "Estado", data: "status",
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
                    this.props.history.push("/invoice/create?certify=" + d.id)
                  }
                />
                <Button
                  disabled={!d.action.view}
                  size={"xs"}
                  icon={"fa-eye"}
                  onClick={() => this.props.history.push("/certify/" + d.id)}
                />
                <Button
                  disabled={!d.action.edit}
                  size={"xs"}
                  icon={"fa-edit"}
                  onClick={() =>
                    this.props.history.push("/certify/" + d.id + "/edit")
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
                    this.props.history.push("/invoice/create?certify=" + d.id)
                  }
                />
                <Button
                  size={"xs"}
                  icon={"fa-eye"}
                  onClick={() => this.props.history.push("/certify/" + d.id)}
                />
                <Button
                  disabled={!d.manage}
                  size={"xs"}
                  icon={"fa-edit"}
                  onClick={() =>
                    this.props.history.push("/certify/" + d.id + "/edit")
                  }
                />
                <Button
                  disabled={!d.manage}
                  size={"xs"}
                  icon={"fa-trash"}
                  onClick={this.handleDeleteCertify.bind(this, d.id)}
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
                  this.props.history.push("/invoice/create?certify=" + d.id)
                }
              />
              <Button
                disabled={!d.action.view}
                size={"xs"}
                icon={"fa-eye"}
                onClick={() => this.props.history.push("/certify/" + d.id)}
              />
              <Button
                disabled={!d.action.edit}
                size={"xs"}
                icon={"fa-edit"}
                onClick={() =>
                  this.props.history.push("/certify/" + d.id + "/edit")
                }
              />
              <Button
                disabled={!d.action.drop}
                size={"xs"}
                icon={"fa-trash"}
                onClick={this.handleDeleteCertify.bind(this, d.id)}
              />
            </div>
          );
        },
      },
    ];
    this.handleDeleteCertify = this.handleDeleteCertify.bind(this);
  }
  componentWillMount() {
    let user = Storage.getUsername();
    let apiOrders = "employee/" + user.employeeid + "/certifys";
    if (user.profile === "Administrador") {
      apiOrders = "certifys";
    }
    API.get(apiOrders)
      .then((res) => {
        const certifys = res;
        this.setState({ certifys: certifys });
      })
      .catch((err) => {
        swal("Error!", Utils.getMessageError(err), "error");
      });
  }
  handleDeleteCertify(id) {
    swal({
      icon: "warning",
      title: "Eliminar acta de entrega",
      text: "Esta seguro de eliminar el Acta de entrega #" + id + "?",
      dangerMode: true,
      buttons: ["Cancelar", "Eliminar"]
    }).then((evl) => {
      if (evl) return API.delete("certifys/" + id);
    }).then((res) => {
      if (res === undefined) return;
      this.ws.send("delete certify");
      swal("Exito!", " Se ha eliminado el Acta de entrega #" + id, "success");
      const certifys = this.state.certifys.filter((certify) => certify.id !== id);
      this.setState({ certifys: certifys });
    }).catch((err) => {
      swal("Error!", Utils.getMessageError(err), "error");
    });

  }
  render() {
    const validRenderComplete = () => {
      return true && this.state.certifys && true;
    };
    return (
      <Content
        title={"Acta de entrega"}
        subTitle={"Lista"}
        loaded={validRenderComplete()}
      >
        <Box
          header={
            <Button
              to={"certify/create"}
              text={"Nueva Acta de entrega"}
              type={"danger"}
              pullRight
            />
          }
        >
          <Row>
            <Col xs={12}>
              <DataTable
                name={"ACTA_DE_ENTREGA"}
                columns={this.columns}
                data={this.state.certifys}
                messageNoRecords={"No existe ninguna Acta de entrega"}
                showSearch={true}
                sortTable={true}
                showRowsLimit={true}
                exportButton={false}
                responsive
              />
            </Col>
          </Row>
        </Box>
      </Content>
    );
  }
}
export default Certify;
