import React from 'react';
import { Box, Inputs, Col } from "adminlte-2-react";
import CustomButton from "./CustomButton/CustomButton"

const { Text } = Inputs;

class FormCertificado extends React.Component {

    render() {
        const {
            certificate, handleChangeCert, handleSubmitCert, isLoadButton
        } = this.props;
        return (<Box title={"Certificado"} solid>
            <Col md={5}>
            <div className="form-group">
                <label for="3bcd0fa5-0cf0-4fea-ac85-988962f35741">Certificado</label>
                <div className="input-group">
                    <input type="file" name="file" onChange={handleChangeCert} accept={'.pfx'}/>
                </div>
            </div>
            <Text
                name={'password'}
                labelPosition={'above'}
                label={'Contraseña'}
                value={certificate.password}
                onChange={handleChangeCert}
                inputType={"password"}
            />
            <CustomButton
              text={"Guardar"}
              icon={"save"}
              handle={handleSubmitCert}
              isLoad={isLoadButton}
              pullLeft
            />
            </Col>
            </Box>);
    }
}
export default FormCertificado;