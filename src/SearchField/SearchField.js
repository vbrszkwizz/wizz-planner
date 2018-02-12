import React, { Component } from 'react';
import pick from 'lodash.pick';

class SearchField extends Component {
  constructor() {
    super();
    this.state = {
      origin: localStorage.getItem('origin') || '',
      connections: localStorage.destination
        ? [...localStorage.getItem('connections').split(',')]
        : [],
      destination: localStorage.getItem('destination') || ''
    };
    this.handleOriginChange = this.handleOriginChange.bind(this);
    this.handleDestinationChange = this.handleDestinationChange.bind(this);
  }

  handleOriginChange(event) {
    let origin = event.target.value;

    localStorage.setItem('destination', '');
    this.setState({ destination: '' });

    localStorage.setItem('origin', origin);
    this.setState({ origin }, () => this.calculateConnections());
  }

  handleDestinationChange(event) {
    let destination = event.target.value;
    localStorage.setItem('destination', destination);
    this.setState({ destination });
  }

  calculateConnections() {
    let connectionData = this.props.stations.filter(
      e => e.shortName === this.state.origin
    )[0].connections;

    let connectionIataCodes = connectionData.map(e => e.iata);

    if (connectionIataCodes.some(e => e === undefined)) {
      this.setState({ connections: [] });
      return;
    }

    let connections = connectionIataCodes
      .map(e => this.props.stations.find(el => el.iata === e))
      .map(e => e.shortName)
      .sort();

    localStorage.setItem('connections', connections);
    this.setState({ connections });
  }

  render() {
    let stations = this.props.stations
      .map(e => pick(e, ['iata', 'shortName']))
      .sort((a, b) => {
        if (a.shortName < b.shortName) {
          return -1;
        }
        if (a.shortName > b.shortName) {
          return 1;
        }
        return 0;
      });

    return (
      <form>
        <label>
          from
          <select value={this.state.origin} onChange={this.handleOriginChange}>
            {stations.map(station => (
              <option key={station.iata} value={station.shortName}>
                {station.shortName}
              </option>
            ))}
          </select>
        </label>
        <label>
          to
          <select
            value={this.state.destination}
            onChange={this.handleDestinationChange}
          >
            {this.state.connections.map(connection => (
              <option key={connection} value={connection}>
                {connection}
              </option>
            ))}
          </select>
        </label>
      </form>
    );
  }
}

export default SearchField;
