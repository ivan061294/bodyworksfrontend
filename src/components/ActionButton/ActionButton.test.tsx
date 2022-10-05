import React from 'react';
import ReactDOM from 'react-dom';
import ActionButton from './ActionButton';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ActionButton  />, div);
  ReactDOM.unmountComponentAtNode(div);
});
