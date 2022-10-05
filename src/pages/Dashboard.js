import React, { Component } from 'react';
import { Box, Col, Infobox, Row } from "adminlte-2-react";
import SaleChart from '../components/SaleChart';
import SaleLine from '../components/SaleLine';
import SaleBar from '../components/SaleBar';
import Content from "../components/Content";
import { Link } from 'react-router-dom';
import { constantes } from '../commons/Constantes';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quoteCount: 0,//Storage.countQuotes(),
            orderCount: 0,//Storage.countOrders(),
            certifyCount: 0,//Storage.countCertifys(),
            invoiceCount: 0,//Storage.countInvoices(),
            saleForMonth: null,
        };
    }
    ws = new WebSocket(constantes.API_URL_WS + '/ws');
    componentWillMount() {
        this.ws.onopen = () => {
            this.ws.send('init report')
        };
        this.ws.onmessage = e => {
            let report = JSON.parse(e.data);
            this.setState({
                quoteCount: report.countQuote,
                orderCount: report.countOrder,
                certifyCount: report.countCertify,
                invoiceCount: report.countInvoice,
                saleForMonth: report.saleForMonth
            });
        };
        this.ws.onclose = () => {
        };
    }
    componentWillUnmount() {
        this.ws.close()
    }
    render() {
        const validRenderComplete = () => {
            return true
        };
        const data = [{
            icon: 'fa-file-invoice',
            color: 'orange',
            number: <Link to={"quote"}>{this.state.quoteCount}</Link>,
            text: 'Cotizaciones',
        },
        {
            icon: 'fa-briefcase',
            color: 'blue',
            number: <Link to={"order"}>{this.state.orderCount}</Link>,
            text: 'Ordenes de trabajo',
        },
        {
            icon: 'fa-vote-yea',
            color: 'red',
            number: <Link to={"certify"}>{this.state.certifyCount}</Link>,
            text: 'Actas de entrega',
        },
        {
            icon: 'fa-file-invoice-dollar',
            color: 'green',
            number: <Link to={"invoice"}>{this.state.invoiceCount}</Link>,
            text: 'Facturas',
        }];
        return (<Content title={"Dashboard"} subTitle="" loaded={validRenderComplete()}>
            <Row>
                {
                    data.map((props, index) => (
                        <Col key={`upperInfoBox${index}`} md={3}>
                            <Infobox {...props} />
                        </Col>
                    ))
                }
            </Row>
            <Row>
                <Col md={6}>
                    <Box collapsable>
                        <SaleChart
                            countQuote={this.state.quoteCount}
                            countOrder={this.state.orderCount}
                            countCertify={this.state.certifyCount}
                            countInvoice={this.state.invoiceCount}
                        />
                    </Box>
                </Col>
                <Col md={6}>
                    <Box collapsable>
                        <SaleLine saleForMonth={this.state.saleForMonth} />
                    </Box>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Box collapsable>
                        <SaleBar saleForMonth={this.state.saleForMonth} />
                    </Box>
                </Col>
            </Row>
        </Content>);
    }
}

export default Dashboard;
