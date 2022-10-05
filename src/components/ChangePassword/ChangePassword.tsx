import React from 'react';
import { Inputs, Button, Box, Col } from "adminlte-2-react";

const { Text } = Inputs;

interface IChangePassword {
    password_old: string;
    password_new: string;
    password_repeat: string;
    onChange: any;
    onSubmit: any;
    disabledButton: boolean;
}

const ChangePassword: React.FC<IChangePassword> = (props) => {
    const { password_old,
        password_new,
        password_repeat,
        onChange,
        onSubmit,
        disabledButton } = props;
    return (<Box title={"Actualizar la contraseña"} solid
        footer={<Button
            disabled={disabledButton}
            onClick={onSubmit}
            text={'Guardar'}
            type={'danger'}
            icon={"fa-save"}
        />}>
        <Col md={6}>
            <p>
                Actualice la contraseña del usuario de su cuenta de Bodyworks. Use la nueva contraseña la próxima vez que inicie sesión.
            </p>
            <Text
                name={'password_old'}
                labelPosition={'above'}
                label={'Contraseña Actual'}
                value={password_old}
                onChange={onChange}
                inputType={"password"}
            />
            <Text
                name={'password_new'}
                labelPosition={'above'}
                label={'Nueva contraseña'}
                value={password_new}
                onChange={onChange}
                inputType={"password"}
            />
            <Text
                name={'password_repeat'}
                labelPosition={'above'}
                label={'Confirmar la contraseña nueva'}
                value={password_repeat}
                onChange={onChange}
                inputType={"password"}
            />
        </Col>
    </Box>);
};

export default ChangePassword;