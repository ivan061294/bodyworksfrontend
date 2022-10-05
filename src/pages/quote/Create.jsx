import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Row, Col, Inputs } from "adminlte-2-react";

const { Text, Select2 } = Inputs;


export class QuoteCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    handleSubmit(e) { }
    componentWillMount() { }

    render() {
        const quote = { brand: "" };
        return (<div>
            <section className="content-header">
                <h1>Cotización <small>Crear</small></h1>
                <ol className="breadcrumb">
                    <li>
                        <Link to={"/"}>
                            <FontAwesomeIcon icon={['fas', 'tachometer-alt']} /> Home
                    </Link>
                    </li>
                    <li>
                        <Link to={"/quote"}>
                            Cotización
                    </Link>
                    </li>
                    <li className="active">Nuevo</li>
                </ol>
            </section>
            <section className="content">
                <Row>
                    <Col md={4}>
                        <Box title={"Datos Generales"}>
                            <Row>
                                <Col md={12}>
                                    <Select2
                                        name={'customer'}
                                        label={'Cliente'}
                                        options={[]}
                                        value={quote.customer}
                                        labelPosition={'above'}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <Text
                                        name={'contact'}
                                        labelPosition={'above'}
                                        label={'Solicitado por'}
                                        value={quote.brand}
                                    />
                                </Col>
                            </Row>
                        </Box>
                    </Col>
                    <Col md={8}>
                        <Box title={"Datos Vehiculo"}>
                            <Row>
                                <Col md={3}>
                                    <Text
                                        name={'brand'}
                                        labelPosition={'above'}
                                        label={'Marca'}
                                        value={quote.brand}
                                    />
                                </Col>
                                <Col md={3}>
                                    <Text
                                        name={'model'}
                                        labelPosition={'above'}
                                        label={'Modelo'}
                                        value={quote.model}
                                    />
                                </Col>
                                <Col md={3}>
                                    <Text
                                        name={'color'}
                                        labelPosition={'above'}
                                        label={'Color'}
                                        value={quote.color}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={3}>
                                    <Text
                                        name={'productype'}
                                        labelPosition={'above'}
                                        label={'Tipo De Producto'}
                                        value={quote.productype}
                                    />
                                </Col>
                                <Col md={3}>
                                    <Text
                                        name={'plate'}
                                        labelPosition={'above'}
                                        label={'N° Placa'}
                                        value={quote.plate}
                                    />
                                </Col>
                                <Col md={4}>
                                    <Text
                                        name={'serie'}
                                        labelPosition={'above'}
                                        label={'N° Serie'}
                                        value={quote.serie}
                                    />
                                </Col>
                            </Row>
                        </Box>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Box title={"Servicios/Repuestos"}>

                        </Box>
                    </Col>
                </Row>
            </section>
        </div>)
    }
}