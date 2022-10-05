import React, { Component } from 'react'
import { Box, Button, Inputs, Row, Col } from "adminlte-2-react";
import { v4 as uuid } from 'uuid';
const { Text } = Inputs;
export default class WorkTableTrabajos extends Component {
    render() {
        const {
            trabajos, handleChange, handleAddTrabajos, handleadddetailtrabajo, handleDelTrabajo
            , handleDeldDetailTrabajo
        } = this.props;
        const subtbody = (idFather, data, idxFather) => {
            return data ? data.map((data, idx) => {
                data.idx=data.idx?data.idx:uuid()
                return (
                    <Row key={data.idx}>
                        <Col md={1} />
                        <Col md={1}>
                            <Button
                                className={"btn-spacetop"}
                                icon={'fa-trash'}
                                type={'danger'}
                                onClick={() => handleDeldDetailTrabajo(idxFather, data.idx)}
                            />
                        </Col>
                        <Col md={1}>
                            <Text 
                                label={'Item'}
                                labelPosition={'above'}
                                value={idx + 1}
                                disabled
                            />
                        </Col>
                        <Col md={2}>
                            <Text
                                name={'document-' + idFather + '-' + idx}
                                label={'Nro de Documento'}
                                labelPosition={'above'}
                                onChange={handleChange}
                                value={data.docnum}
                            />
                        </Col>
                        <Col md={4}>
                            <Text
                                name={'businessname-' + idFather + '-' + idx}
                                label={'Razon social del Proveedor'}
                                labelPosition={'above'}
                                onChange={handleChange}
                                value={data.fullname}
                            />
                        </Col>
                        <Col md={1}>
                            <Text
                                name={'purcharse-' + idFather + '-' + idx}
                                label={'PC S/'}
                                labelPosition={'above'}
                                inputType={'number'}
                                onChange={handleChange}
                                value={data.purcharsecost}
                            />
                        </Col>
                        <Col md={1}>
                            <Text
                                name={'salepriceT-' + idFather + '-' + idx}
                                label={'PV S/'}
                                labelPosition={'above'}
                                inputType={'number'}
                                onChange={handleChange}
                                value={data.saleprice}
                            />
                        </Col>
                        <Col md={1}>
                            <Text
                                name={'quantityT-' + idFather + '-' + idx}
                                label={'Cantidad'}
                                labelPosition={'above'}
                                inputType={'number'}
                                onChange={handleChange}
                                value={data.quantity}
                            />
                        </Col>
                    </Row>)
            }) : null;
        }
        const tbody = trabajos ? trabajos.map((trabajo, idx) => {
            trabajo.idx = trabajo.idx ? trabajo.idx : uuid();
            return (<Col key={trabajo.idx} md={12}><Row>
                <Col md={1}>
                    <Button
                        className={"btn-spacetop"}
                        icon={'fa-trash'}
                        type={'danger'}
                        onClick={() => handleDelTrabajo(trabajo.idx)}
                    />
                </Col>
                <Col md={5}>
                    <Text
                        name={'descriptionT-' + idx}
                        type={'Text'}
                        label={'Descripcion'}
                        labelPosition={'above'}
                        onChange={handleChange}
                        value={trabajo.description}
                    />
                </Col>
                <Col md={3}>
                    <Button
                        className={'btn-spacetop'}
                        icon={'fa-plus'}
                        text={'Agregar'}
                        type={'danger'}
                        onClick={() => handleadddetailtrabajo(trabajo.idx)}
                    />
                </Col>
            </Row>
                {subtbody(idx, trabajo.details, trabajo.idx)}
            </Col>)
        }) : null;
        return (<Box title={"Trabajos Externos"} header={
            <Button text="Agregar" type="danger"
                pullRight
                icon={'fa-plus'}
                onClick={handleAddTrabajos} />
        }>
            {tbody}
        </Box>);
    }
}
