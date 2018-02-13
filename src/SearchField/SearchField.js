import React, { Component } from 'react';
import pick from 'lodash.pick';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import './searchField.css';

class SearchField extends Component {
  constructor() {
    super();
    this.state = {
      origin: localStorage.origin ? localStorage.getItem('origin') : '',
      connections: localStorage.destination
        ? [...localStorage.getItem('connections').split(',')]
        : [],
      destination: localStorage.getItem('destination') || '',
      outboundDate: null,
      inboundDate: null
    };
    this.handleOriginChange = this.handleOriginChange.bind(this);
    this.handleDestinationChange = this.handleDestinationChange.bind(this);
    this.handleOutboundDateChange = this.handleOutboundDateChange.bind(this);
    this.handleInboundDateChange = this.handleInboundDateChange.bind(this);
    this.disableDates = this.disableDates.bind(this);
  }

  handleOriginChange(event) {
    let origin = event.target.innerHTML;

    localStorage.setItem('destination', '');
    this.setState({ destination: '' });

    localStorage.setItem('origin', origin);
    this.setState({ origin }, () => this.calculateConnections());
  }

  handleDestinationChange(event) {
    let destination = event.target.innerHTML;
    localStorage.setItem('destination', destination);
    this.setState({ destination });
  }

  handleOutboundDateChange(event, date) {
    this.setState({ outboundDate: date });
  }

  handleInboundDateChange(event, date) {
    this.setState({ inboundDate: date })
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

  disableDates(date) {
    return +date <= +this.state.outboundDate;
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
        <SelectField
          className="airport-select"
          floatingLabelText="from"
          value={this.state.origin}
          onChange={this.handleOriginChange}
        >
          {stations.map(station => (
            <MenuItem
              key={station.iata}
              value={station.shortName}
              primaryText={station.shortName}
            />
          ))}
        </SelectField>
        <SelectField
          className="airport-select"
          floatingLabelText="to"
          value={this.state.destination}
          onChange={this.handleDestinationChange}
        >
          {this.state.connections.map(connection => (
            <MenuItem
              key={connection}
              value={connection}
              primaryText={connection}
            />
          ))}
        </SelectField>
        <div className="datepicker">
          <DatePicker
            hintText="departure"
            value={this.state.outboundDate}
            onChange={this.handleOutboundDateChange}
          />
          <DatePicker
            hintText="return"
            value={this.state.inboundDate}
            onChange={this.handleInboundDateChange}
            shouldDisableDate={this.disableDates}
          />
        </div>
      </form>
    );
  }
}

export default SearchField;
