import React, {Component} from "react";
import {Box, Col, Inputs, Row} from "adminlte-2-react";
import Storage from "../commons/Storage";
import "../pages/certify/CertifyView.css";

const {Text, Select2, DateRange} = Inputs;

class WorkTableCertifys extends Component {
    render() {
        const {
            optionsorders,
            disabledStatus,
            datacertify,
            handleChange,
            hiddenStatus,
            optionStatus,
            dataStatuscertify,
            dataorderstatus,
        } = this.props;
        let orderid = datacertify ? datacertify.orderId : null;
        let purcharseorder = datacertify ? datacertify.pucharseorder : null;
        let quoteid = datacertify ? datacertify.quotationId : null;
        let dataBrand = datacertify ? datacertify.brand : null;
        let dataPlate = datacertify ? datacertify.plate : null;
        let dataserie = datacertify ? datacertify.serie : null;
        let datamodel = datacertify ? datacertify.model : null;
        let datacustomer = datacertify ? datacertify.customer : null;
        let datacontact = datacertify ? datacertify.contact : null;
        let employee = datacertify ? datacertify.employee : null;
        let datadescription = datacertify ? datacertify.description : null;
        let dataobservation = datacertify ? datacertify.observation : null;
        let inidate = datacertify ? datacertify.inidate : null;
        let enddate = datacertify ? datacertify.findate : null;
        let dataworktype = datacertify ? datacertify.area : null;
        let dataStatus;
        if (dataStatuscertify) {
            dataStatus = dataStatuscertify;
        } else {
            dataStatus = datacertify ? datacertify.status : null;
        }
        let arrayStatus = optionStatus
            ? optionStatus
            : [
                {value: "A", label: "Aprobado"},
                {value: "P", label: "Pendiente"},
                {value: "R", label: "Rechazado"},
            ];
        const inputStatus = !hiddenStatus ? (
            <Select2
                name={"status"}
                labelPosition={"above"}
                label={"Estado"}
                options={arrayStatus}
                value={dataStatus}
                onChange={handleChange}
                disabled={disabledStatus}
            />
        ) : null;
        return (
            <>
                <Box title={"Datos Generales"}>
                    <Col md={12}>
                        <Row>
                            <Col md={3}>
                                {optionsorders.length ? <Select2
                                    name={"orderid"}
                                    label={"Nro de OT BWP"}
                                    labelPosition={"above"}
                                    options={optionsorders}
                                    onChange={handleChange}
                                    value={orderid}
                                    disabled={dataorderstatus}
                                /> : <div className="form-group">
                                    <label>Nro de OT BWP</label>
                                    <div className="input-group" style={{width: "100%"}}>
                                        <select className="form-control" disabled/>
                                    </div>
                                </div>}
                            </Col>
                            <Col md={5}/>
                            <Col md={2}>{inputStatus}</Col>
                        </Row>
                        <Row>
                            <Col md={4}>
                                <Select2
                                    name={"customer"}
                                    label={"Cliente"}
                                    options={Storage.getCustomers()}
                                    value={datacustomer}
                                    labelPosition={"above"}
                                    onChange={handleChange}
                                    disabled={true}
                                />
                            </Col>
                            <Col md={2}/>
                            <Col md={4}>
                                <Text
                                    name={"area"}
                                    label={"Area"}
                                    labelPosition={"above"}
                                    onChange={handleChange}
                                    value={dataworktype}
                                    disabled
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4}>
                                <Text
                                    name={"contact"}
                                    label={"Solicitado"}
                                    labelPosition={"above"}
                                    value={datacontact}
                                    onChange={handleChange}
                                    disabled={true}
                                />
                            </Col>
                            <Col md={2}/>
                            <Col md={4}>
                                <Text
                                    name={"pucharseorder"}
                                    label={"Nro de OC"}
                                    labelPosition={"above"}
                                    onChange={handleChange}
                                    value={purcharseorder}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4}>
                                <Text
                                    name={"brand"}
                                    labelPosition={"above"}
                                    label={"Marca"}
                                    value={dataBrand}
                                    onChange={handleChange}
                                    disabled={true}
                                />
                            </Col>
                            <Col md={2}/>
                            <Col md={4}>
                                <Text
                                    name={"model"}
                                    label={"Modelo"}
                                    labelPosition={"above"}
                                    value={datamodel}
                                    disabled={true}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4}>
                                <Text
                                    name={"serie"}
                                    labelPosition={"above"}
                                    label={"Serie"}
                                    value={dataserie}
                                    onChange={handleChange}
                                    disabled={true}
                                />
                            </Col>

                            <Col md={2}/>
                            <Col md={4}>
                                <Text
                                    name={"plate"}
                                    labelPosition={"above"}
                                    label={"Placa"}
                                    value={dataPlate}
                                    onChange={handleChange}
                                    disabled={true}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Box>
                <Box>
                    <Col md={12}>
                        <Row>
                            <Col md={4}>
                                <Select2
                                    name={"employee"}
                                    label={"Atendido por:"}
                                    labelPosition={"above"}
                                    options={Storage.getEmployees()}
                                    value={employee}
                                    onChange={handleChange}
                                    disabled={true}
                                />
                            </Col>
                            <Col md={2}/>
                            <Col md={4}>
                                <Text
                                    name={"quotation"}
                                    label={"Nro de Cotizacion"}
                                    labelPosition={"above"}
                                    value={quoteid}
                                    onChange={handleChange}
                                    disabled={true}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}/>
                            <Col md={4}>
                                <DateRange
                                    label={"Fecha Inicio y Fin de Entrega"}
                                    labelPosition={"above"}
                                    startDateId={"startdate"}
                                    endDateId={"enddate"}
                                    startDate={inidate}
                                    endDate={enddate}
                                    onStartChange={handleChange}
                                    onEndChange={handleChange}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Box>
                <Box>
                    <Col md={11}>
                        <Text
                            className={"bordercss"}
                            name={"description"}
                            labelPosition={"above"}
                            label={"Descripcion detallada del servicio"}
                            inputType={"textarea"}
                            onChange={handleChange}
                            value={datadescription}
                        />
                        <Text
                            name={"observation"}
                            label={"Observaciones"}
                            labelPosition={"above"}
                            inputType={"textarea"}
                            onChange={handleChange}
                            value={dataobservation}
                        />
                    </Col>
                    <Col md={1}/>
                </Box>
            </>
        );
    }
}

export default WorkTableCertifys;
