import React from 'react';
import ReactDOM from 'react-dom';
import Pagination from './Pagination';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Pagination count={0} current={1} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
