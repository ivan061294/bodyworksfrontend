import React from 'react';
import ReactDOM from 'react-dom';
import CustomButton from './CustomButton';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CustomButton />, div);
  ReactDOM.unmountComponentAtNode(div);
});