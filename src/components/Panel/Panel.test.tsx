import React from 'react';
import ReactDOM from 'react-dom';
import Panel from './Panel';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Panel />, div);
  ReactDOM.unmountComponentAtNode(div);
});
