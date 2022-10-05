import React, { Component } from 'react'
import { Box, Button, Inputs, Row, Col } from "adminlte-2-react";
import { v4 as uuid } from 'uuid';

const { Text, Select2 } = Inputs;

class WorkTableRepuestos extends Component {
     render() {
          const { repuestos, handleDelRepuestos, handleAddRepuesto, handleChange, supplies } = this.props;
          const tbody = repuestos ? repuestos.map((repuesto, idx) => {
               repuesto.idx = repuesto.idx ? repuesto.idx : uuid();
               return (<Col md={12} key={idx}><Row>
                    <Col />
                    <Col md={1}>
                         <Button
                              className={"btn-spacetop"}
                              icon={'fa-trash'}
                              type={'danger'}
                              onClick={() => handleDelRepuestos(repuesto.idx)}
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
                    <Col md={4}>
                         <Select2
                              name={'description-' + idx}
                              type={'Text'}
                              label={'Descripcion Material/Insumo'}
                              options={supplies}
                              labelPosition={'above'}
                              onChange={handleChange}
                              value={repuesto.description}
                         />
                    </Col>
                    <Col md={2}>
                         <Text
                              name={'code-' + idx}
                              label={'Codigo'}
                              labelPosition={'above'}
                              onChange={handleChange}
                              value={repuesto.codigo}
                              disabled
                         />
                    </Col>
                    <Col md={1}>
                         <Text
                              name={'saleprice-' + idx}
                              type={'Text'}
                              label={'PV S/'}
                              labelPosition={'above'}
                              onChange={handleChange}
                              value={repuesto.saleprice}
                              disabled
                         />
                    </Col>
                    <Col md={1}>
                         <Text
                              name={'unit-' + idx}
                              type={'Text'}
                              label={'Unid.'}
                              labelPosition={'above'}
                              onChange={handleChange}
                              value={repuesto.unit}
                              disabled
                         />
                    </Col>
                    <Col md={1}>
                         <Text
                              name={'quantity-' + idx}
                              type={'Text'}
                              label={'Cantidad'}
                              inputType={'number'}
                              labelPosition={'above'}
                              onChange={handleChange}
                              value={repuesto.quantity}
                         />
                    </Col>
               </Row>
               </Col>)
          }) : null;
          return (<Box title={"Materiales e insumos"} header={
               <Button type="danger" text="Agregar" onClick={handleAddRepuesto}
                    pullRight icon={'fa-plus'} />}>
               {tbody}
          </Box>);
     }
}
export default WorkTableRepuestos;
