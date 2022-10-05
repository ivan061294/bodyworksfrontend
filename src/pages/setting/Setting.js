import React, {Component} from 'react';
import {Box, Button, Col, Inputs, Row} from "adminlte-2-react";
import Content from "../../components/Content";
import {constantes} from "../../commons/Constantes";
import Storage from "../../commons/Storage";
import storage from "../../commons/Storage";
import API from "../../commons/http-common";
import Utils from "../../commons/Utils";
import DataTable from "../../components/DataTable/DataTable";
import Panel from "../../components/Panel/Panel";
import FormCertificado from "../../components/FormCertificado";
import FormResource from "../../components/FormResource/FormResource"
import swal from "sweetalert";
import Moment from "react-moment";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import "./Setting.css"
import ChangePassword from '../../components/ChangePassword/ChangePassword';
import ChangeProfile from "../../components/ChangeProfile/ChangeProfile";

const {Text} = Inputs;

class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: true,
            dollar: Storage.getDollarPrice(),
            file: null,
            certificates: null,
            certificate: {
                password: null,
            },
            resource: {
                customer: null,
                employees: [],
                assigned: [],
                selected_employees: []
            },
            password: {
                password_old: "",
                password_new: "",
                password_repeat: "",
            },
            isDisabledResource: true,
            user: Storage.getUsername(),
        }
        this.handleSubmitCert = this.handleSubmitCert.bind(this);
        this.handleChangeCert = this.handleChangeCert.bind(this);
        this.handleChangeResource = this.handleChangeResource.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleSubmitPassword = this.handleSubmitPassword.bind(this);
    }

    _handleReaderLoader(e) {
        let binaryString = e.target.result;
        this.setState({
            base64TextString: btoa(binaryString)
        })
    }

    handleSubmitPassword(e) {
        const password = {...this.state.password};
        const user = Storage.getUsername();
        if (!password.password_old) {
            swal("Advertencia!", "Ingresa la contraseña actual", "warning");
            return
        }
        if (!password.password_new) {
            swal("Advertencia!", "Ingresa la nueva contraseña", "warning");
            return
        }
        if (password.password_new !== password.password_repeat) {
            swal("Advertencia!", "Las contraseñas no coinciden", "warning");
            return
        }
        swal({
            title: "Actualizar contraseña",
            text: "Esta seguro de actualizar su contraseña?",
            icon: "warning",
            buttons: ["Cancelar", "Guardar"]
        }).then((evl) => {
            if (evl) {
                this.setState({isLoadButton: true});
                this.setState({loader: false})
                return API.put("/users/" + user.id + "/password", {
                    oldPassword: password.password_old,
                    newPassword: password.password_new
                })
            }
        }).then(res => {
            this.setState({isLoadButton: false});
            if (res === undefined) return;
            swal("Exito!", "Cambios guardados", "success");
            this.setState({loader: true})
        }).catch(err => {
            this.setState({isLoadButton: false});
            swal("Error!", Utils.getMessageError(err), "error");
            this.setState({loader: true})
        });
    }

    handleChangePassword(e) {
        const {name, value} = e.target;
        let password = {...this.state.password};
        password[name] = value;
        this.setState({password: password});
    }

    handleChangeCert(e) {
        const {name, value} = e.target;
        let certificate = {...this.state.certificate}
        if (name === "file") {
            certificate.file = e.target.files[0];
        }
        if (name === "password") {
            certificate.password = value;
        }
        this.setState({certificate: certificate});
    }

    handleChangeResource(e) {
        const {name, value} = e.target;
        const values = Array.from(e.target.selectedOptions, option => option.value);
        let resource = {...this.state.resource};
        if (name === "customer") {
            this.setState({loader: false});
            API.get("customer/" + value + "/employees").then(res => {
                const assigned = res.map(e => {
                    return {
                        value: e.id,
                        text: e.name + " " + e.lastname
                    }
                });
                resource["assigned"] = assigned;
                this.setState({resource: resource});
                this.setState({loader: true});
            }).catch(err => {
                swal("Error!", Utils.getMessageError(err), "error");
                this.setState({loader: true});
            });
            resource[name] = value;
        }
        if (name === "employees") {
            resource[name] = values;
        }
        if (name === "selected_employees") {
            resource[name] = values;
        }
        this.setState({resource: resource});
    }

    handleSubmitCert() {
        const certfile = this.state.certificate.file;
        const password = this.state.certificate.password;
        if (!certfile) {
            swal("Advertencia!", "Debe seleccionar un certificado [.pfx]", "warning");
            return
        }
        if (certfile.type !== "application/x-pkcs12") {
            swal("Advertencia!", "El archivo seleccionado no es un certificado", "warning");
            return
        }
        if (!password) {
            swal("Advertencia!", "Debe ingresar la clave del certificado", "warning");
            return
        }
        swal({
            title: "Subir certificado",
            text: "Esta seguro de subir el certificado: " + certfile.name + "?",
            icon: "warning",
            buttons: ["Cancelar", "Subir"]
        }).then((evl) => {
            this.setState({loader: false})
            const formData = new FormData();
            this.setState({isLoadButton: true});
            formData.append('DOLLAR_PRICE', this.state.dollar);
            formData.append('CERTIFICADO', this.state.certificate.file);
            formData.append('CERTIFICADO_PASS', this.state.certificate.password);
            if (evl) return API.post("settings", formData)
        }).then((res) => {
            this.setState({isLoadButton: false});
            if (res === undefined) return;
            localStorage.setItem('dollarPrice', this.state.dollar);
            swal("Exito!", "Cambios guardados", "success");
            this.setState({loader: true})
        }).catch(err => {
            this.setState({isLoadButton: false});
            swal("Error!", Utils.getMessageError(err), "error");
            this.setState({loader: true})
        });
    }

    componentWillMount() {
        API.get("certificates").then(res => {
            this.setState({"certificates": res});
        }).catch(err => {
            swal("Error!", Utils.getMessageError(err), "error");
        });
    }

    render() {
        const toBase64 = file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
        const handleChangeProfile = e => {
            const {name, value} = e.target;
            let user = {...this.state.user};
            if (name === "avatar") {
                let file = e.target.files[0];
                if (file) {
                    toBase64(file).then(data => {
                        user[name] = data;
                        this.setState({user: user});
                    });
                }
            } else {
                user[name] = value;
            }
            this.setState({user: user});
        }
        const handleSubmitProfile = e => {
            let user = this.state.user;
            user.img = this.state.base64TextString;
            API.put("users/" + user.id, user).then(() => {
                swal("Exito!", "Cambios guardados", "success");
            }).catch(err => {
                swal("Error!", Utils.getMessageError(err), "error");
            });
        }

        const handleSubmitResource = e => {
            let id = this.state.resource.customer;
            let employees = this.state.resource.assigned.map(e => {
                return {id: e.value}
            });
            this.setState({loader: false, isLoadButton: true});
            API.put("customer/" + id + "/employees", employees).then(() => {
                swal("Exito!", "Cambios guardados", "success");
                this.setState({loader: true, isLoadButton: false});
            }).catch(err => {
                swal("Error!", Utils.getMessageError(err), "error");
                this.setState({loader: true, isLoadButton: false});
            });
        }

        const activarCertificado = id => {
            let certificates = [...this.state.certificates];
            for (var i in certificates) {
                if (certificates[i].id === id) {
                    certificates[i].status = "Pendiente";
                }
            }
            this.setState({certificates: certificates});
            API.put("certificates/" + id).then(() => {
                for (var i in certificates) {
                    if (certificates[i].id === id) {
                        certificates[i].status = "Activo";
                    } else {
                        certificates[i].status = "Desactivo";
                    }
                }
                this.setState({certificates: certificates});
            }).catch(err => {
                swal("Error!", Utils.getMessageError(err), "error");
            })
        }

        const handleAddAllResource = () => {
            let resource = {...this.state.resource};
            resource["assigned"] = storage.supervisoryEmployees().map(e => {
                return {
                    value: e.id,
                    text: e.name + " " + e.lastname
                }
            })
            this.setState({resource: resource});
        }
        const handleAddResource = () => {
            let resource = {...this.state.resource};
            if (!resource["employees"].length) return;
            resource["assigned"] = resource["assigned"].concat(storage.supervisoryEmployees().filter(e =>
                resource["employees"].includes(e.id.toString())
            ).map(e => {
                return {
                    value: e.id,
                    text: e.name + " " + e.lastname
                }
            }));
            resource["employees"] = [];
            this.setState({resource: resource});
        }
        const handleRemoveResource = () => {
            let resource = {...this.state.resource};
            if (!resource["selected_employees"].length) return;
            resource["assigned"] = resource["assigned"].filter(e =>
                !resource["selected_employees"].includes(e.value.toString())
            );
            resource["selected_employees"] = [];
            this.setState({resource: resource});
        }
        const handleRemoveAllResource = () => {
            let resource = {...this.state.resource};
            resource["assigned"] = [];
            this.setState({resource: resource});
        }

        const validRenderComplete = () => {
            return true &&
                this.state.certificates != null;
        };
        const PanelGeneral = () => {
            return (<Box title={"General"} solid>
                <Row>
                    <Col md={12}>
                        <Text
                            name={'dollar'}
                            labelPosition={'above'}
                            label={'Precio del dolar'}
                            value={this.state.dollar}
                            onChange={this.handleChangeCert}
                        />
                    </Col>
                </Row>
                <Button
                    onClick={handleSubmitProfile}
                    text={'Guardar'}
                    type={'danger'}
                    icon={"fa-save"}
                />
            </Box>);
        }
        const PanelCertificado = () => {
            return (
                <Box solid>
                    <DataTable
                        columns={[
                            {title: '#', data: 'id'},
                            {title: 'Numero de serie', data: 'serialnumber'},
                            {
                                title: 'Nombre del archivo', data: 'filename', render: (e) => {
                                    return <a href={`${constantes.API_URL_HTTP}/api/v1/documents/${e}`} download>{e}</a>
                                }
                            },
                            {title: 'Emitido por', data: 'issued'},
                            {
                                title: 'Valido desde',
                                data: 'fromdate',
                                render: (e) => <Moment title={e} format="DD/MM/YYYY">{e}</Moment>
                            },
                            {
                                title: 'Valido hasta',
                                data: 'todate',
                                render: (e) => <Moment title={e} format="DD/MM/YYYY">{e}</Moment>
                            },
                            {
                                title: "Acción",
                                data: "action",
                                sort: false,
                                render: (e, d) => {
                                    switch (d.status) {
                                        case 'Activo':
                                            return 'Activo'
                                        case 'Pendiente':
                                            return <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FontAwesomeIcon
                                                icon="circle-notch" spin/></span>
                                        default:
                                            return <span className={"link"}
                                                         onClick={() => activarCertificado(d.id)}>Activar</span>;
                                    }
                                }
                            }
                        ]}
                        data={this.state.certificates}
                        messageNoRecords={"No existe ningun certificado"}
                        showSearch={true}
                        sortTable={true}
                        showRowsLimit={true}
                        responsive
                    />
                </Box>);
        }
        return (<Content title={"Configuración"} loader={this.state.loader} loaded={validRenderComplete()}>
            <Panel>
                <div id={"tab-1"} title={"General"} active>
                    <PanelGeneral/>
                </div>
                <div id={"tab-2"} title={"Perfil"}>
                    <ChangeProfile
                        firstname={this.state.user.firstname}
                        lastname={this.state.user.lastname}
                        username={this.state.user.username}
                        avatar={this.state.user.avatar}
                        onChange={handleChangeProfile}
                        onSubmit={handleSubmitProfile}
                        disabledButton={this.state.isLoadButton}
                    />
                </div>
                <div id={"tab-3"} title={"Contraseña"}>
                    <ChangePassword
                        password_old={this.state.password.password_old}
                        password_new={this.state.password.password_new}
                        password_repeat={this.state.password.password_repeat}
                        onChange={this.handleChangePassword}
                        onSubmit={this.handleSubmitPassword}
                        disabledButton={this.state.isLoadButton}
                    />
                </div>
                {Storage.getUsername().profile === "Administrador" ?
                    <div id={"tab-4"} title={"Recursos"}>
                        <FormResource
                            isLoadButton={this.state.isLoadButton}
                            data={this.state.resource}
                            handleRemoveAll={handleRemoveAllResource}
                            handleRemove={handleRemoveResource}
                            handleAdd={handleAddResource}
                            handleAddAll={handleAddAllResource}
                            handleChange={this.handleChangeResource}
                            handleSubmit={handleSubmitResource}
                        />
                    </div> : null}
                {Storage.getUsername().profile === "Administrador" ?
                    <div id={"tab-5"} title={"Roles"}>
                        <Box title={"Roles"} solid>Roles</Box>
                    </div> : null}
                {Storage.getUsername().profile === "Administrador" ?
                    <div id={"tab-6"} title={"Permisos"}>
                        <Box title={"Permisos"} solid>Permisos</Box>
                    </div> : null}
                {Storage.getUsername().profile === "Administrador" ?
                    <div id={"tab-7"} title={"Certificado"}>
                        <FormCertificado
                            certificate={this.state.certificate}
                            handleChangeCert={this.handleChangeCert}
                            handleSubmitCert={this.handleSubmitCert}
                            isLoadButton={this.state.isLoadButton}
                        />
                        <PanelCertificado/>
                    </div> : null}
            </Panel>
        </Content>);
    }
}

export default Setting;
