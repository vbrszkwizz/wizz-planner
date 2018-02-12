import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { stations } from '../testHelper';

it('renders without crashing', () => {
  const div = document.createElement('div');
  fetch.mockResponse(JSON.stringify({ stations }));
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
