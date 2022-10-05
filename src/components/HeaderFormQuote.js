import React, { Component } from 'react';
import { Box, Row, Col, Inputs } from "adminlte-2-react";
import Storage from "../commons/Storage";
import Utils from "../commons/Utils";


const { Text, Select2 } = Inputs;

class HeaderFormQuote extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentWillMount() {

    }

    static defaultProps = {
        disabledQuote: false,
        disabledCustomer: false,
        disabledContact: false,
        disabledColor: false,
        disabledBrand: false,
        disabledModel: false,
        disabledPlate: false,
        disabledSerie: false,
        disabledStatus: false,
        disabledAssigned: false,
        hiddenQuote: false,
        hiddenStatus: false,
        hiddenAssigned: false
    }

    render() {
        const {
            optionquote,
            data,
            handleChange,
            disabledQuote,
            disabledCustomer,
            disabledContact,
            disabledColor,
            disabledBrand,
            disabledModel,
            disabledPlate,
            disableproductype,
            disabledSerie,
            disabledStatus,
            disabledAssigned,
            hiddenQuote,
            hiddenStatus,
            hiddenAssigned,
            optionStatus,
            dataStatusOrder
        } = this.props;

        let dataQuote = data ? data.id : '';
        let dataCustomer = data ? data.customer_id : '';
        let dataContact = data ? data.contact : '';
        let dataColor = data ? data.color : '';
        let dataBrand = data ? data.brand : '';
        let dataModel = data ? data.model : '';
        let dataPlate = data ? data.plate : '';
        let dataproductype = data ? data.productype : '';
        let dataSerie = data ? data.serie : '';
        let dataStatus
        if (dataStatusOrder) {
            dataStatus = dataStatusOrder;
        } else {
            dataStatus = data ? Utils.getKeyStatus(data.status) : '';
        }
        let dataAssigned = data ? data.employee.id : '';
        let arrayStatus = optionStatus ? optionStatus : [
            { value: 'P', label: 'Pendiente' },
            { value: 'A', label: 'Aceptado' },
            { value: 'R', label: 'Rechazado' },
        ];

        let  arrayAssigned = Storage.getEmployeesPerCare(["SUPERVISOR", "USUARIO"])

        const inputQuote = !hiddenQuote ? optionquote.length ? <Select2
            name={'quoteid'}
            label={'Cotizacion'}
            options={optionquote}
            value={dataQuote}
            defaultValue={dataQuote}
            labelPosition={'above'}
            onChange={handleChange}
            disabled={disabledQuote}
        /> : <div className="form-group">
            <label>Cotizacion</label>
            <div className="input-group" style={{width: "100%"}}>
                <select className="form-control" disabled />
            </div>
        </div> : null;

        const inputStatus = !hiddenStatus ? <Select2
            name={'status'}
            labelPosition={'above'}
            label={'Estado'}
            options={arrayStatus}
            value={dataStatus}
            onChange={handleChange}
            disabled={disabledStatus}
        /> : null;

        const inputAssigned = !hiddenAssigned ? <Select2
            name={'employee'}
            label={'Asignado a'}
            labelPosition={'above'}
            options={arrayAssigned}
            value={dataAssigned}
            onChange={handleChange}
            disabled={disabledAssigned}
        /> : null;

        return (<>
            <Box title={'Datos Generales'}>
            <Col md={11}>
                {!hiddenStatus && !hiddenAssigned ?
                <Row>
                    <Col md={3}>
                    </Col>
                    <Col md={3} />
                    <Col md={3}>
                        <h4>Configuracion</h4>
                    </Col>
                    <Col md={1}/>
                </Row> : null}
                <Row>
                    <Col md={6} />
                    <Col md={4}>
                        {inputAssigned}
                    </Col>
                    <Col md={2}>
                        {inputStatus}
                    </Col>
                </Row>
                <Row>
                    <Col md={3}>
                        {inputQuote}
                    </Col>
                    <Col md={3} />
                    <Col md={3}>
                        <h4>Datos del vehiculo</h4>
                    </Col>
                    <Col md={1}/>

                </Row>
                <Row>
                    <Col md={4}>
                        <Select2
                            name={'customer'}
                            label={'Cliente'}
                            options={disabledCustomer?Storage.getCustomers():Storage.getCustomersForQuote(Storage.getUser())}
                            value={dataCustomer}
                            labelPosition={'above'}
                            onChange={handleChange}
                            disabled={disabledCustomer}
                        />
                    </Col>
                    <Col md={2} />
                    <Col md={2}>
                        <Text
                            name={'brand'}
                            labelPosition={'above'}
                            label={'Marca'}
                            value={dataBrand}
                            onChange={handleChange}
                            disabled={disabledBrand}
                        />
                    </Col>
                    <Col md={2}>
                        <Text
                            name={'model'}
                            labelPosition={'above'}
                            label={'Modelo'}
                            value={dataModel}
                            onChange={handleChange}
                            disabled={disabledModel}
                        />
                    </Col>
                    <Col md={2}>
                        <Text
                            name={'color'}
                            labelPosition={'above'}
                            label={'Color'}
                            value={dataColor}
                            onChange={handleChange}
                            disabled={disabledColor}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col md={4}>
                        <Text
                            name={'contact'}
                            labelPosition={'above'}
                            label={'Solicitado Por'}
                            value={dataContact}
                            onChange={handleChange}
                            disabled={disabledContact}
                        />
                    </Col>
                    <Col md={2} />

                    <Col md={2}>
                        <Text
                            name={'productype'}
                            labelPosition={'above'}
                            label={'Tipo De Producto'}
                            value={dataproductype}
                            onChange={handleChange}
                            disabled={disableproductype}
                        />
                    </Col>
                    <Col md={2}>
                        <Text
                            name={'plate'}
                            labelPosition={'above'}
                            label={'N° Placa'}
                            value={dataPlate}
                            onChange={handleChange}
                            disabled={disabledPlate}
                        />
                    </Col>
                    <Col md={2}>
                        <Text
                            name={'serie'}
                            labelPosition={'above'}
                            label={'N° Serie'}
                            value={dataSerie}
                            onChange={handleChange}
                            disabled={disabledSerie}
                        />
                    </Col>
                </Row>

            </Col>
        </Box>

        </>)
    }
}

export default HeaderFormQuote;
