import React, { Component} from 'react';
import PropTypes from 'prop-types';
import "./simpleTable.css";
import { v4 as uuidv4 } from 'uuid';

class SimpleTable extends Component {
    state = { key: uuidv4(), a:'' }

    mapCell(data, column, rowData, rowIdx) {
        const { key } = this.state;
        if (column.render) {
            return <td key={`${key}-${rowIdx}-${column.data}`} className={column.class}>{column.render(data, rowData, rowIdx)}</td>;
        }
        return <td key={`${key}-${rowIdx}-${column.data}`} className={column.class}>{data}</td>;
    }
    render() {
        const {
            data, columns, noMargin, condensed, striped, border, hover, responsive, messageNoRecords, rowIni, rowFin, sortTable, sortchange
        } = this.props;
        let columns_v = columns.filter( e => e.visibility !== false);
        const { key } = this.state;
        const mappedColumns = data && data.length > 0 ? data.slice(rowIni ? rowIni : 0, rowFin ? rowFin : data.length)
            //.filter(e => e.visibility !== false)
            .map((row, rowIdx) => (
            <tr key={`${key}-${rowIdx}`}>
                {columns_v.map(col => this.mapCell(row[col.data], col, row, rowIdx, sortTable))}
            </tr>
        )) : <tr><td colSpan={columns_v && columns_v.length ? columns_v.length * 2 : 0} className="text-center">{messageNoRecords ? messageNoRecords : 'No se encontraron registros'}</td></tr>;
        let headers;
        const hasHeaders = columns_v && columns_v.length ? columns_v.filter(p => p.title).length > 0 : [];
        if (hasHeaders) {
            headers = columns_v && columns_v.length ? columns_v.map((p, idx) => {
                let classArrow = "sorting";
                if (p.sortValue === 0) { classArrow = "sorting_desc" }
                if (p.sortValue === 1) { classArrow = "sorting_asc" }
                p.sort = p.sort === false ? false : true;
                if (sortTable && p.sort) {
                    return <th key={idx} className={`non-selectable ${classArrow}`} onClick={() => sortchange(p.data, p.sortValue)}>{p.title}</th>;
                } else {
                    return <th key={idx} className={`non-selectable sorting`}>{p.title}</th>;
                }
            }) : null;
        }
        const classNames = [
            'table',
            noMargin ? 'no-margin' : null,
            condensed ? 'table-condensed' : null,
            striped ? 'table-striped' : null,
            border ? 'table-bordered' : null,
            hover ? 'table-hover' : null,
        ].filter(p => p).join(' ');

        const table = (<table key={key} className={classNames + " dataTable"}>
            {hasHeaders && (
                <thead>
                    <tr role={'row'}>
                        {headers}
                    </tr>
                </thead>
            )}
            <tbody>
                {mappedColumns}
            </tbody>
        </table>);
        if (!responsive) {
            return table;
        }
        return <div className="table-responsive">{table}</div>;
    }
}

SimpleTable.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({

    })),
    columns: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        data: PropTypes.string,
        width: PropTypes.string,
        render: PropTypes.func,
    })),
    condensed: PropTypes.bool,
    striped: PropTypes.bool,
    noMargin: PropTypes.bool,
    border: PropTypes.bool,
    responsive: PropTypes.bool,
    hover: PropTypes.bool,
};

SimpleTable.defaultProps = {
    data: null,
    columns: null,
    condensed: false,
    striped: false,
    noMargin: false,
    border: false,
    responsive: false,
    hover: false,
};

export default SimpleTable;
