import React from 'react';
import {Bar} from 'react-chartjs-2';
import moment from 'moment';

class SaleLine extends React.Component {
    render() {
        const {saleForMonth} = this.props;
        let months = [];
        let saleLastYear = [];
        let saleLastYearTemp = [];
        let saleNowYear = [];
        let saleNowYearTemp = [];
        const nowyear = moment();
        const lastyear = moment().subtract(1, "year");
        if (saleForMonth != null) {
            months = moment.monthsShort()
            saleLastYearTemp = saleForMonth.filter(m => moment(m.month).isSame(lastyear, 'year'));
            saleNowYearTemp = saleForMonth.filter(m => moment(m.month).isSame(nowyear, 'year'));
            let i;
            for (i = 0; i < saleNowYearTemp.length; i++) {
                const temp = saleNowYearTemp[i];
                const index = moment(temp.month).format('M');
                saleNowYear[index - 1] = temp;
            }
            let j;
            for (j = 0; j < saleLastYearTemp.length; j++) {
                const temp = saleLastYearTemp[j];
                const index = moment(temp.month).format('M');
                saleLastYear[index - 1] = temp;
            }
        }
        const data = {
            labels: months,
            datasets: [
                {
                    label: 'Este año',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: '#2b96e0',
                    data: saleNowYear.map(e => e.sale)
                },
                {
                    label: 'Año pasado',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: '#c3c3c3',
                    data: saleLastYear.map(e => e.sale)
                }
            ]
        };
        return (
            <div>
                <Bar data={data}/>
            </div>
        );
    }
}

export default SaleLine;
