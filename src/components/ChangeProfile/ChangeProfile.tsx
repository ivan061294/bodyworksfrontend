import React from 'react';
import { Inputs, Button, Box, Col } from "adminlte-2-react";
import Avatar from "../Avatar/Avatar";

const { Text } = Inputs;

interface IChangePassword {
    firstname: string;
    lastname: string;
    username: string;
    avatar: string;
    onChange: any;
    onSubmit: any;
    disabledButton: boolean;
}

const ChangePassword: React.FC<IChangePassword> = (props) => {
    const {
        firstname,
        lastname,
        username,
        avatar,
        onChange,
        onSubmit,
        disabledButton } = props;
    return (<Box title={"Actualizar el perfil"} solid
    footer={<Button
        disabled={disabledButton}
        onClick={onSubmit}
        text={'Guardar'}
        type={'danger'}
        icon={"fa-save"}
    />}>
        <Col md={1} />
        <Col md={3}>
            <div style={{height: '30px'}} />
                <Avatar
                    src={avatar}
                    onChange={onChange}
                    size={'160px'}
                />
            </Col>
            <Col md={4}>
                <Text
                    name={'firstname'}
                    labelPosition={'above'}
                    label={'Nombres'}
                    onChange={onChange}
                    value={firstname}
                />
                <Text
                    name={'lastname'}
                    labelPosition={'above'}
                    label={'Apellidos'}
                    onChange={onChange}
                    value={lastname}
                />
                <Text
                    name={'username'}
                    labelPosition={'above'}
                    label={'Usuario'}
                    onChange={onChange}
                    value={username}
                />
            </Col>
        </Box>);
};

export default ChangePassword;