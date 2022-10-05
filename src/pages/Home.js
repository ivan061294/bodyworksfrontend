import React, {Component} from 'react';
import AdminLTE, {Navbar, Sidebar} from 'adminlte-2-react';

import Storage from "../commons/Storage"
import {Redirect, Switch} from "react-router-dom";
import PublicRoute from "../routes/PublicRoute";
import PrivateRoute from "../routes/PrivateRoute";

import UserItem from '../components/UserItem';

import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Quote from '../pages/Quote';
import QuoteView from '../pages/quote/QuoteView';
import QuoteEdit from '../pages/quote/QuoteEdit';
import QuoteCreate from '../pages/quote/QuoteCreate';
import Order from '../pages/Order';
import OrderView from '../pages/order/OrderView';
import OrderEdit from '../pages/order/OrderEdit';
import OrderCreate from '../pages/order/OrderCreate';
import Certify from '../pages/Certify';
import CertifyView from '../pages/certify/CertifyView';
import CertifyEdit from '../pages/certify/CertifyEdit';
import CertifyCreate from '../pages/certify/CertifyCreate';
import Invoice from '../pages/Invoice';
import InvoiceView from '../pages/invoice/InvoiceView';
import InvoiceEdit from '../pages/invoice/InvoiceEdit';
import InvoiceCreate from '../pages/invoice/InvoiceCreate';
import CreditNote from '../pages/CreditnotePage/CreditnotePage';
import ReportSale from '../pages/report/ReportSale';
import ReportPucharse from '../pages/report/ReportPucharse';
import Setting from '../pages/setting/Setting';

const {Item, Header, UserPanel} = Sidebar;

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {

    }

    render() {
        const token = localStorage.getItem("token");
        const user = Storage.getUsername();
        const activeOnQuote = ['/quote/create', '/quote/[0-9]', '/quote/[0-9]/edit'];
        const activeOnOrder = ['/order/create', '/order/[0-9]', '/order/[0-9]/edit'];
        const activeOnCertify = ['/certify/create', '/certify/[0-9]', '/certify/[0-9]/edit'];
        const activeOnInvoice = ['/invoice/create', '/invoice/[0-9]', '/invoice/[0-9]/edit'];
        const activeOnCreditnote = ['/creditnote/create', '/creditnote/[0-9]', '/creditnote/[0-9]/edit'];

        if (!token) {
            return <Switch>
                <PublicRoute exact path={"/login"} component={Login}/><
                Redirect to={'/login'}/>
            </Switch>
        }

        return (<Switch>
            <AdminLTE title={["Bodyworks", ""]} titleShort={["B", "WS"]} hidden={true}>
                <Navbar.Core>
                    <UserItem
                        username={user.firstname + " " + user.lastname}
                        profile={user.profile}
                        email={user.email}
                        imageUrl={user.avatar}
                    />
                </Navbar.Core>
                <Sidebar.Core>
                    <UserPanel
                        imageUrl={user.avatar}
                        username={user.firstname + " " + user.lastname.split(" ")[0]}
                        status={"Online"}
                    />
                    <Header text="NAVEGACION PRINCIPAL"/>
                    <Item icon="fa-tag" key="sales" text="Ventas">
                        <Item text="Cotizacion" to="/quote" activeOn={activeOnQuote}/>
                        <Item text="Orden de trabajo" to="/order" activeOn={activeOnOrder}/>
                        <Item text="Acta de entrega" to="/certify" activeOn={activeOnCertify}/>
                        <Item text="Factura" to="/invoice" activeOn={activeOnInvoice}/>
                        <Item text="Nota de credito" to="/creditnote" activeOn={activeOnCreditnote}/>
                    </Item>
                    <Item icon="fa-shopping-cart" key="purchase" text="Compras">
                        <Item key="purchase" text="Compra" to="/purchase"/>
                        <Item key="inventory" text="Inventario" to="/inventory"/>
                    </Item>
                    <Item icon="fa-chart-pie" key="reports" text="Reportes">
                        <Item key="report-sale" text="Reporte de ventas" to="/report-sale"/>
                        <Item key="report-pucharse" text="Reporte de compras" to="/report-pucharse"/>
                    </Item>
                    <Item icon="fa-cog" key="setting" text="Configuracion" to="/setting"/>
                </Sidebar.Core>
                <PrivateRoute path={"/"} component={Dashboard} exact/>
                <PrivateRoute path={"/quote"} component={Quote} exact/>
                <PrivateRoute path={"/quote/create"} component={QuoteCreate} exact/>
                <PrivateRoute path={"/quote/:id"} component={QuoteView} exact/>
                <PrivateRoute path={"/quote/:id/edit"} component={QuoteEdit} exact/>
                <PrivateRoute path={"/order"} component={Order} exact/>
                <PrivateRoute path={"/order/create"} component={OrderCreate} exact/>
                <PrivateRoute path={"/order/create?quote=:quoteid"} component={OrderCreate} exact/>
                <PrivateRoute path={"/order/:id"} component={OrderView} exact/>
                <PrivateRoute path={"/order/:id/edit"} component={OrderEdit} exact/>
                <PrivateRoute path={"/certify"} component={Certify} exact/>
                <PrivateRoute path={"/certify/create"} component={CertifyCreate} exact/>
                <PrivateRoute path={"/certify/:id"} component={CertifyView} exact/>
                <PrivateRoute path={"/certify/:id/edit"} component={CertifyEdit} exact/>
                <PrivateRoute path={"/invoice"} component={Invoice} exact/>
                <PrivateRoute path={"/invoice/create"} component={InvoiceCreate} exact/>
                <PrivateRoute path={"/invoice/:id"} component={InvoiceView} exact/>
                <PrivateRoute path={"/invoice/:id/edit"} component={InvoiceEdit} exact/>
                <PrivateRoute path={"/creditnote"} component={CreditNote} exact/>
                <PrivateRoute path={"/report-sale"} component={ReportSale} exact/>
                <PrivateRoute path={"/report-pucharse"} component={ReportPucharse} exact/>
                <PrivateRoute path={"/setting"} component={Setting} exact/>
            </AdminLTE>
        </Switch>);
    }
}

export default Home;
