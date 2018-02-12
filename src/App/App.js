import React, { Component } from 'react';
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
    return <SearchField stations={this.state.stations} />;
  }
}

export default App;
