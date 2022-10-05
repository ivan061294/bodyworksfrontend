import React, {Component} from 'react';
import {Button, Col, Inputs, Row} from "adminlte-2-react";
import {Redirect} from 'react-router-dom';
import {constantes} from '../commons/Constantes';
import API from '../commons/http-common';
import Utils from '../commons/Utils';
import Axios from 'axios';
import jwt from "jwt-decode";
import './Login.css';

const {Text} = Inputs;

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                username: "",
                password: "",
            },
            alert: {},
            isLoad: false,
            redirectToReferrer: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        const user = this.state.user;
        let alert = {};
        if (!user.username || !user.password) {
            alert.type = "danger";
            alert.message = "Debe ingresar las credenciales";
            this.setState({alert: alert});
            return;
        }
        this.setState({isLoad: true});
        Axios.post(constantes.API_URL_HTTP + "/api/v1/token", user)
            .then(res => {
                let token = res.data;
                localStorage.setItem('token', token);
                if (token) {
                    const user = jwt(token).user;
                    const userId = user.id;
                    const employeeId = user.employeeid;
                    const userProfile = user.profile;
                    let apiCustomers = 'employee/' + employeeId + '/customers';
                    if (userProfile === 'Administrador') {
                        apiCustomers = "customers";
                    }
                    Axios.all([
                        API.get('users/' + userId),
                        API.get('settings'),
                        API.get('employees'),
                        API.get('products'),
                        API.get(apiCustomers),
                        API.get('quotes'),
                    ]).then(Axios.spread((...responses) => {
                        const users = responses[0];
                        const settings = responses[1];
                        const employees = responses[2];
                        const products = responses[3];
                        const customers = responses[4];
                        const quotes = responses[5]
                        localStorage.setItem('users', JSON.stringify(users));
                        localStorage.setItem('settings', JSON.stringify(settings));
                        localStorage.setItem('employees', JSON.stringify(employees));
                        localStorage.setItem('products', JSON.stringify(products));
                        localStorage.setItem('customers', JSON.stringify(customers));
                        localStorage.setItem('quotes',JSON.stringify(quotes))
                        this.setState({redirectToReferrer: true});
                    })).catch(err => {
                        alert.type = "danger";
                        alert.message = constantes.ICON_UNICODE_ERROR + " " + Utils.getMessageError(err);
                        localStorage.clear();
                        this.setState({alert: alert, isLoad: false});
                    });
                }
            }).catch(err => {
            alert.type = "danger";
            alert.message = constantes.ICON_UNICODE_ERROR + " " + Utils.getMessageError(err);
            localStorage.clear();
            this.setState({alert: alert, isLoad: false});
        })
        event.preventDefault();
    }

    render() {
        if (this.state.redirectToReferrer || sessionStorage.getItem('userData')) {
            return (<Redirect to={'/'}/>)
        }
        const handleChange = (e) => {
            let name = e.target.name;
            let value = e.target.value;
            let user = {...this.state.user};
            if (name === "username") {
                user.username = value;
            }
            if (name === "password") {
                user.password = value;
            }
            this.setState({user: user})
        };
        const ButtonLogin = this.state.isLoad ? <Button
            pullRight
            type={"primary"}
            text={"Cargando ..."}
            disabled
        /> : <Button
            pullRight
            type={'primary'}
            text={"Ingresar"}
            onClick={this.handleSubmit}
        />;
        return (<Row className={"hold-transition login-page"}>
            <Col md={12}>
                <div className="login-box">
                    <div className="login-logo">
                        <a href="/"><b>Bodyworks</b></a>
                    </div>
                    <div className="login-box-body">
                        <p className="login-box-msg">Inicia sesión para comenzar</p>
                        <div className={"msg-error text-center"}>
                            {this.state.alert.message}
                        </div>
                        <br/>
                        <form>
                            <Text
                                name={"username"}
                                labelPosition={"none"}
                                placeholder={"Usuario"}
                                value={this.state.user.username}
                                onChange={handleChange}
                                iconLeft={"fa-user"}
                            />
                            <Text
                                name={"password"}
                                labelPosition={"none"}
                                placeholder={"Contraseña"}
                                inputType={"password"}
                                value={this.state.user.password}
                                onChange={handleChange}
                                iconLeft={"fa-lock"}
                            />
                            <Row>
                                <Col md={8}/>
                                <Col md={4}>
                                    {ButtonLogin}
                                </Col>
                            </Row>
                        </form>
                    </div>
                </div>
            </Col>
        </Row>);
    }
}

export default Login;
