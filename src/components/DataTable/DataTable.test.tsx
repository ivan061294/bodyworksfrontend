import React from 'react';
import ReactDOM from 'react-dom';
import DataTable from './DataTable';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DataTable name="" showRowsLimit showSearch columns={[]} data={[]} sortTable messageNoRecords="" responsive />, div);
  ReactDOM.unmountComponentAtNode(div);
});