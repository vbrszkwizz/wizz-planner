import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SearchField from '../SearchField/SearchField';

class App extends Component {
  constructor() {
    super();
    this.state = {
      stations: []
    };
  }

  componentDidMount() {
    fetch('https://mock-air.herokuapp.com/asset/stations')
      .then(res => res.json())
      .then(stations => this.setState({ stations }))
      .catch(console.error);
  }

  render() {
    return (
      <MuiThemeProvider>
        <SearchField stations={this.state.stations} />
      </MuiThemeProvider>
    );
  }
}

export default App;
