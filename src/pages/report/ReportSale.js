 import React, { Component } from 'react';
 import { Box, Col, Row } from "adminlte-2-react";
 import Content from "../../components/Content";
 import Moment from "react-moment";
 import Utils from "../../commons/Utils";
 import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
 import { Link } from 'react-router-dom';
 import DataTable from "../../components/DataTable/DataTable";
 import API from '../../commons/http-common';

 class ReportSale extends Component {
     constructor(props) {
         super(props);
         this.state = {
             reportsale: null,
         };
     }
     componentWillMount() {
        API.get('report/sales').then( res => {
            this.setState({ reportsale: res });
        }).catch(console.log);
     }
     render() {
         const validRenderComplete = () => {
             return true
                 && this.state.reportsale
                 && true;
         };
         const columns = [
             {
                 title: 'Nro OT', data: 'id', export: true, render: (e) => (
                     <Link to={'/order/' + e.toString()}>OT{e.toString().padStart(6, '0')}</Link>
                 )
             },
             {
                 title: 'Nro CT', data: 'idquote', export: true, render: (e) => (
                     <Link to={'/quote/' + e.toString()}>CT{e.toString().padStart(6, "0")}</Link>
                 )
             },
             { title: 'Cliente', data: 'customer', export: true },
             {
                 title: 'Fecha', data: 'regdate', export: true, render: e => (
                     <Moment title={e} format="DD/MM/YYYY">{e}</Moment>
                 ),
             },
             { title: 'Estado', data: 'status', export: true },
             { title: 'Nro Paños', data: 'totalcloths', export: true },
             { title: 'Nro hh', data: 'totalhours', export: true },
             { title: '# Trabajadores', data: 'workers', export: true },
             {
                 title: 'Total gastos', data: 'laborexpense', export: true, render: (a, d) =>
                     Utils.formatCurrency(d.laborexpense, d.currency)
             },
             {
                 title: 'Cotizacion', data: 'quotation', export: true, render: (a, d) =>
                     Utils.formatCurrency(d.quotation, d.currency)
             },
             {
                 title: 'Ganancia', data: 'gain', export: true, render: (a, d) =>
                     <>
                         {Utils.formatCurrency(d.gain, d.currency)}
                         <FontAwesomeIcon
                             pull={'right'}
                             color={Utils.indicatorGainColor(a)}
                             icon={Utils.indicatorGainIcon(a)}
                         />
                     </>
             },
         ];
         return (<Content title={"Ventas"} subTitle="Reporte" loaded={validRenderComplete()}>
             <Box>
                 <Row>
                     <Col xs={12}>
                         <DataTable
                            name={"REPORT_VENTA"}
                            columns={columns}
                            data={this.state.reportsale}
                            showSearch={true}
                            sortTable={true}
                            showRowsLimit={true}
                            exportButton={true}
                            responsive
                         />
                     </Col>
                 </Row>
             </Box>
         </Content>);
     }
 }
 export default ReportSale;
