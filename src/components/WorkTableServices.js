import React, {Component} from 'react';
import {Box, Button, Col, Inputs, Row} from "adminlte-2-react";
import {v4 as uuid} from 'uuid';

const {Text, Select2} = Inputs;

class WorkTableServices extends Component {
    render() {
        const {
            services, handleAddSubitem, handleDelSubitem, handleChange, employees,
            handleAddService, handleDelService
        } = this.props;
        console.log(services)
        const subtbody = (idFather, data, idxFather) => {
            return data ? data.map((data, idx) => {
                data.idx = data.idx ? data.idx : uuid()
                return (
                    <Row key={idx}>

                        <Col md={1}/>
                        <Col md={1}>
                            <Button
                                className={"btn-spacetop"}
                                icon={'fa-trash'}
                                type={'danger'}
                                onClick={() => handleDelSubitem(idxFather, data.idx)}
                            />
                        </Col>
                        <Col md={3}>
                            <Select2
                                name={'Worktype-' + idFather + '-' + idx}
                                label={'Tipo de trabajo'}
                                options={['101 Pintura', '102 Carroceria', '103 Lavado', '104 Mecanica']}
                                labelPosition={'above'}
                                value={data.worktype}
                                onChange={handleChange}
                            />
                        </Col>
                        <Col md={3}>
                            <Select2
                                name={'employee-' + idFather + '-' + idx}
                                label={'Seleccione'}
                                options={employees}
                                labelPosition={'above'}
                                value={data.employee}
                                onChange={handleChange}
                            />
                        </Col>
                        <Col md={1}>
                            <Text
                                name={'hours-' + idFather + '-' + idx}
                                type={'Text'}
                                label={'Nro HH'}
                                labelPosition={'above'}
                                inputType={'number'}
                                value={data.hours}
                                onChange={handleChange}
                            />
                        </Col>
                        <Col md={1}>
                            <Text
                                name={'cloths-' + idFather + '-' + idx}
                                type={'Text'}
                                label={'Nro Paños'}
                                labelPosition={'above'}
                                inputType={'number'}
                                value={data.cloths}
                                onChange={handleChange}
                            />
                        </Col>
                    </Row>)
            }) : null;
        }
        const tbody = services ? services.map((service, idx) => {
            service.idx = service.idx ? service.idx : uuid();
            return (<Col key={idx} md={12}><Row>

                <Col md={1}>
                    <Button
                        className={"btn-spacetop"}
                        icon={'fa-trash'}
                        type={'danger'}
                        onClick={() => handleDelService(service.idx)}

                    />
                </Col>
                <Col md={1}><Text
                    label={'Item'}
                    labelPosition={'above'}
                    value={idx + 1}
                    disabled
                /></Col>
                <Col md={5}>
                    <Text
                        name={'Description-' + idx}
                        type={'Text'}
                        label={'Descripción'}
                        labelPosition={'above'}
                        onChange={handleChange}
                        value={service.description}
                    />
                </Col>
                <Col md={3}>
                    <Button
                        className={"btn-spacetop"}
                        icon={'fa-plus'}
                        text={'Agregar'}
                        type={'danger'}
                        onClick={() => handleAddSubitem(service.idx)}

                    />
                </Col>
            </Row>
                {subtbody(idx, service.details, service.idx)}
            </Col>)
        }) : null;

        return (<Box title={"Servicios"} header={
            <Button
                pullRight
                icon={'fa-plus'}
                text={'Agregar'}
                type={'danger'}
                onClick={handleAddService}/>
        }>
            {tbody}
        </Box>);
    }
}

export default WorkTableServices;
