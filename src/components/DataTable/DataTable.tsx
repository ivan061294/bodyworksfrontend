import React, { useState, ChangeEvent, useEffect } from 'react';
import styles from './DataTable.module.scss';
import SimpleTable from '../SimpleTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Pagination from '../Pagination/Pagination';
import ExportButton from '../../components/ExportButton/ExportButton';
import moment from 'moment';
import Utils from '../../commons/Utils';

interface Props2 {
  handleSearch: any;
  search: string;
}

interface Col {
  title: string;
  data: string;
  sortValue?: number;
  sort?: boolean;
  export?: boolean;
}

interface Props {
  name: string;
  columns: Array<Col>;
  data: any;
  showRowsLimit: boolean;
  showSearch: boolean;
  messageNoRecords: string;
  sortTable: boolean;
  responsive: boolean;
  exportButton?: boolean;
  selectable?: boolean;
}
interface IPage {
  currentPage: number;
  totalPage: number;
  startRow: number;
  endedRow: number;
  totalRows: number;
  showRows: number;
}

class Page implements IPage {
  currentPage: number;
  totalPage: number;
  startRow: number;
  endedRow: number;
  totalRows: number;
  showRows: number;
  constructor(totalRows: number) {
    this.currentPage = 1;
    this.totalPage = Math.ceil(totalRows / 10) > 0 ? Math.ceil(totalRows / 10) : 1;
    this.startRow = totalRows > 0 ? 1 : 0;
    this.endedRow = totalRows < 10 ? totalRows : 10;
    this.totalRows = totalRows;
    this.showRows = 10;
  }
}

const SearchTable: React.FC<Props2> = (props) => {
  return (
    <div className="form-group pull-right">
      <div className="input-group" style={{ width: '100%' }}>
        <input type="search" placeholder="Buscar..." className="form-control input-md" value={props.search} onChange={props.handleSearch} />
        <span className="input-group-addon">
          <FontAwesomeIcon icon={'search'} />
        </span>
      </div>
    </div>
  );
}

const DataTable: React.FC<Props> = (props) => {
  const showRowsLimit = props.showRowsLimit ? props.showRowsLimit : false;
  const showSearch = props.showSearch ? props.showSearch : false;
  const sorTable = props.sortTable ? props.sortTable : false;
  const responsive = props.responsive ? props.responsive : false;
  const exportButton = props.exportButton ? props.exportButton : false;
  const [data, setData] = useState(props.data ? props.data : []);
  const [search, setSearch] = useState("");
  const [keymemory, setkey] = useState("");
  const [direccions, setdirection] = useState("arrow");
  const [columns, setColumns] = useState(props.columns);
  const [messageNoRecords, setMessageNoRecords] = useState(props.messageNoRecords);
  const [setup, setSetup] = useState(new Page(data.length || 0));

  useEffect(() => { setData(props.data) }, [props.data]);

  function updateSetup(param: any) {
    let newTotalPage: number = setup.totalPage;
    let newStartRow: number = setup.startRow;
    let newEndedRow: number = setup.endedRow;
    let newTotalRows: number = setup.totalRows;
    let newCurrentPage: number = setup.currentPage;
    let newShowRows: number = setup.showRows;
    if (param.k === 'totalRows') {
      newTotalRows = param.v;
    }
    if (param.k === 'showRows') {
      newShowRows = param.v;
    }
    newTotalPage = Math.ceil(newTotalRows / newShowRows) > 0 ? Math.ceil(newTotalRows / newShowRows) : 1;
    if (param.k === 'currentPage') {
      newCurrentPage = param.v;
    } else {
      newCurrentPage = newCurrentPage > newTotalPage ? newTotalPage : newCurrentPage;
    }
    newStartRow = newTotalRows > 0 ? ((newCurrentPage - 1) * newShowRows) + 1 : 0;
    newEndedRow = newShowRows * newCurrentPage > newTotalRows ? newTotalRows : newShowRows * newCurrentPage;

    let newSetup: Page = {
      currentPage: newCurrentPage,
      totalPage: newTotalPage,
      startRow: newStartRow,
      endedRow: newEndedRow,
      totalRows: newTotalRows,
      showRows: newShowRows
    };
    return newSetup;
  }

  function handleChangeLimit(e: { target: { value: React.Key; }; }) {
    const newShowRows = +e.target.value;
    let newSetup: Page = updateSetup({ k: 'showRows', v: newShowRows });
    setSetup(newSetup);
  };
  function handleChangePage(page: number) {
    if (page >= 1 && page <= setup.totalPage) {
      let newSetup: Page = updateSetup({ k: 'currentPage', v: page });
      setSetup(newSetup);
    }
  };
  function useSortableData(key: string, dir: number) {
    let newColumns = props.columns;
    for (let i = 0; i < newColumns.length; i++) {
      const col = newColumns[i]["data"];
      if (key === col) {
        newColumns[i]["sortValue"] = dir === 0 ? 1 : 0;
      } else {
        newColumns[i]["sortValue"] = 2;//null;
      }
    }
    setColumns(newColumns);
    let direction = 'ascending';
    if (key && key === keymemory && direction === direccions) {
      direction = 'descending';
    } else {
      direction = 'ascending'
    }
    let isFinder = false;
    var Data = [...data];
    if (key !== null) {
      Data.sort((a, b) => {
        if (a[key] < b[key]) {
          isFinder = true
          return direction === 'ascending' ? -1 : 1;
        }
        if (a[key] > b[key]) {
          isFinder = true
          return direction === 'ascending' ? 1 : -1;
        }

        return 0
      }
      );
    }
    if (isFinder) {
      setdirection(direction)
      setkey(key)
      setData(Data);
    } else {
      setData(data);
    }
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toString();
    var isFinder: Boolean = false;
    var newData: any[] = [];
    let dataTable = props.data;
    if (value) {
      for (let i = 0; i < dataTable.length; i++) {
        isFinder = false;
        for (let j = 0; j < columns.length; j++) {
          let str: String = dataTable[i][columns[j]["data"]] + "";
          if (str != null && str !== "" && str.toLowerCase().indexOf(value.toLowerCase()) > -1) {
            isFinder = true;
            continue;
          }
        }
        if (isFinder) {
          newData.push(dataTable[i]);
        }
      }
    } else {
      newData = props.data;
    }
    if (newData.length === 0) {
      setMessageNoRecords("No se encontro ningun resultado")
    }
    setData(newData);
    setSearch(value);
    let newSetup: Page = updateSetup({ k: 'totalRows', v: newData.length });
    setSetup(newSetup);
    return;
  }
  const RowsLimit: React.FC = () => {
    const options = [10, 25, 50, 100];
    return (
      <div className="dataTables_length" id="externally-controlled_length">
        <label>
          Mostrar <select name="externally-controlled_length" aria-controls="externally-controlled" className="form-control input-md"
            onChange={handleChangeLimit}
            value={setup.showRows}>
            {
              options.map((option, idx) => <option key={`option-${idx}`} value={option}>{option}</option>)
            }
          </select> registros</label>
      </div>
    )
  };

  const handleExport = (head: Array<any>, csv: Array<any>) => {
    const cols: Array<any> = head.filter(e => e.export);
    const rows: Array<any> = csv.map(v => cols.map(c => v[c.data])).map(e => Object.values(e));
    let csvContent = cols.map(e => e.title).join(";") + "\n" + rows.map(e => e.join(";")).join("\n");
    var formattedDate = moment(new Date()).format('YYYYMMDD');
    const csvName = props.name + "_" + formattedDate + ".csv";
    Utils.downloadCSV(csvContent, csvName).click();
  }

  return (
    <div className={styles.DataTable}>
      <div className="box-body">
        <div className="row">
          <div className="col-md-12">
            <div className="datatable-controlled-elems">
              <div id="externally-controlled_wrapper" className="dataTables_wrapper form-inline dt-bootstrap no-footer">
                <div className="row">
                  <div className="col-xs-6">
                    {showRowsLimit ? <RowsLimit /> : null}
                  </div>
                  <div className="col-xs-6">
                    {exportButton ? <ExportButton handle={() => handleExport(columns, data)} /> : null}
                    {showSearch ? <SearchTable search={search} handleSearch={handleSearch} /> : null}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12"><br /></div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <SimpleTable
                      columns={columns}
                      data={data}
                      rowIni={setup.startRow - 1}
                      rowFin={setup.endedRow}
                      messageNoRecords={messageNoRecords}
                      sortTable={sorTable}
                      sortchange={data.length > 0 ? useSortableData : () => false}
                      classSort={direccions}
                      responsive={responsive}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-5">
                    <div className="dataTables_info">Mostrando {setup.startRow} a {setup.endedRow} de {setup.totalRows} registros</div>
                  </div>
                  <div className="col-md-7">
                    <Pagination count={setup.totalPage} current={setup.currentPage} handlePage={handleChangePage} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
export default DataTable;