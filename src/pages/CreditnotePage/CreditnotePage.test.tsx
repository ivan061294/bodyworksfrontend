import React from 'react';
import ReactDOM from 'react-dom';
import CreditnotePage from './CreditnotePage';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CreditnotePage />, div);
  ReactDOM.unmountComponentAtNode(div);
});