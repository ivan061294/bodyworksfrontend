import React from 'react';
import {Line} from 'react-chartjs-2';
import moment from 'moment';

class SaleLine extends React.Component {
    render() {
        const {saleForMonth} = this.props;
        let months;
        if (saleForMonth != null) {
            months = saleForMonth.map(m => {
                let strmonth;
                strmonth = moment(m.month).format('MMM');
                return strmonth.charAt(0).toUpperCase() + strmonth.slice(1)
            })
        }
        const data = {
            labels: months,
            datasets: [
                {
                    label: 'Ventas',
                    fill: false,
                    lineTension: 0.1,
                    borderColor: '#e0ac00',
                    data: saleForMonth != null ? saleForMonth.map(m => {
                        //return moment(m.sale)
                        return m.sale
                    }) : null
                },
                /*{
                    label: 'Orden de trabajo',
                    fill: false,
                    lineTension: 0.1,
                    borderColor: '#3371ca',
                    data: saleForMonth != null ? saleForMonth.map(m=>moment(m.sale)) : null
                },
                {
                    label: 'Acta de entrega',
                    fill: false,
                    lineTension: 0.1,
                    borderColor: '#ca3333',
                    data: saleForMonth != null ? saleForMonth.map(m=>moment(m.sale)) : null
                },
                {
                    label: 'Factura',
                    fill: false,
                    lineTension: 0.1,
                    borderColor: '#34aa1e',
                    data: saleForMonth != null ? saleForMonth.map(m=>moment(m.sale)) : null
                }*/
            ]
        };
        return (
            <div>
                <Line data={data}/>
            </div>
        );
    }
}
export default SaleLine;
