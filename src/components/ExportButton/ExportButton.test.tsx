import React from 'react';
import ReactDOM from 'react-dom';
import ExportButton from './ExportButton';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ExportButton />, div);
  ReactDOM.unmountComponentAtNode(div);
});