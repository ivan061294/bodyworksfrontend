import React from 'react';
import MultiSelect from "../MultiSelect/MultiSelect";
import Storage from "../../commons/Storage";
import { ButtonGroup, Button, Col, Row, Box, Inputs } from "adminlte-2-react";

const { Select2 } = Inputs;

interface Props {
    data?: any;
    handleChange?: any;
    handleRemoveAll?: any;
    handleRemove?: any;
    handleAdd?: any;
    handleAddAll?: any;
    handleSubmit?: any;
    isLoadButton?: boolean;
}
const FormResource: React.FC<Props> = (props) => {
    const {
        data,
        handleChange,
        handleRemoveAll,
        handleRemove,
        handleAdd,
        handleAddAll,
        handleSubmit,
        isLoadButton
    } = props;
    return (<Box title={"Recursos"} solid
        footer={<Button
            disabled={!data.customer || isLoadButton}
            onClick={handleSubmit}
            text={'Guardar'}
            type={'danger'}
            icon={"fa-save"}
        />}
    >
        <Row>
            <Col md={6} />
            <Col md={5}>
                <Select2
                    name={'customer'}
                    labelPosition={'above'}
                    label={'Cliente'}
                    options={Storage.customers().map(e => {
                        return {
                            value: e.id,
                            text: e.fullname
                        }
                    })}
                    value={data.customer}
                    onChange={handleChange}
                />
            </Col>
        </Row>
        <Row>
            <Col xs={5} md={5}>
                <MultiSelect
                    size={7}
                    disabled={false}
                    name={"employees"}
                    label={"Empleados"}
                    options={Storage.supervisoryEmployees().filter(e => {
                        return !data.assigned.some(a => a.value === e.id);
                    }).map(e => {
                        return {
                            value: e.id,
                            text: e.name + " " + e.lastname
                        }
                    })}
                    value={data.employees}
                    onChange={handleChange}
                />
            </Col>
            <Col xs={2} md={1}>
                <div style={{ marginTop: 18 }}></div>
                <ButtonGroup vertical margin={12}>
                    <Button
                        disabled={!data.customer}
                        onClick={handleRemoveAll}
                        icon={"fa-angle-double-left"}
                    />
                    <Button
                        disabled={!data.customer}
                        onClick={handleRemove}
                        icon={"fa-angle-left"}
                    />
                    <Button
                        disabled={!data.customer}
                        onClick={handleAdd}
                        icon={"fa-angle-right"}
                    />
                    <Button
                        disabled={!data.customer}
                        onClick={handleAddAll}
                        icon={"fa-angle-double-right"}
                    />
                </ButtonGroup>
            </Col>
            <Col xs={5} md={5}>
                <MultiSelect
                    size={7}
                    disabled={!data.customer}
                    name={"selected_employees"}
                    label={"Asignados al cliente"}
                    options={data.assigned}
                    value={data.selected_employees}
                    onChange={handleChange}
                />
            </Col>
        </Row>
    </Box>);
};
export default FormResource;