import React, { Component } from 'react';
import pick from 'lodash.pick';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
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
      inboundDate: null,
      validationErrorOrigin: '',
      validationErrorDestination: '',
      validationErrorOutboundDate: '',
      flights: []
    };
    this.handleOriginChange = this.handleOriginChange.bind(this);
    this.handleDestinationChange = this.handleDestinationChange.bind(this);
    this.handleOutboundDateChange = this.handleOutboundDateChange.bind(this);
    this.handleInboundDateChange = this.handleInboundDateChange.bind(this);
    this.disableDates = this.disableDates.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleOriginChange(event) {
    let origin = event.target.innerHTML;

    localStorage.setItem('destination', '');
    this.setState({ destination: '' });

    localStorage.setItem('origin', origin);
    this.setState({ origin }, () => this.calculateConnections());

    this.setState({ validationErrorOrigin: '' });
  }

  handleDestinationChange(event) {
    let destination = event.target.innerHTML;
    localStorage.setItem('destination', destination);
    this.setState({ destination });
    this.setState({ validationErrorDestination: '' });
  }

  handleOutboundDateChange(event, date) {
    this.setState({ outboundDate: date });
    this.setState({ validationErrorOutboundDate: '' });
  }

  handleInboundDateChange(event, date) {
    this.setState({ inboundDate: date });
  }

  handleSubmit() {
    let payload = {
      origin: this.getIataCode(this.props.stations, this.state.origin),
      destination: this.getIataCode(
        this.props.stations,
        this.state.destination
      ),
      outboundDate: this.formatDate(this.state.outboundDate),
      inboundDate: this.formatDate(this.state.inboundDate)
    };

    this.validateForm();

    if (
      this.state.origin === '' ||
      this.state.destination === '' ||
      this.state.outboundDate === null
    ) {
      return;
    }

    fetch(
      `https://mock-air.herokuapp.com/search?departureStation=${
        payload.origin
      }&arrivalStation=${payload.destination}&date=${payload.outboundDate}`
    )
      .then(res => res.json())
      .then(flights => this.setState({ flights }))
      .catch(console.error);
  }

  validateForm() {
    if (this.state.origin === '') {
      this.setState({ validationErrorOrigin: 'departure is required' });
    } else {
      this.setState({ validationErrorOrigin: '' });
    }
    if (this.state.destination === '') {
      this.setState({ validationErrorDestination: 'destination is required' });
    } else {
      this.setState({ validationErrorDestination: '' });
    }
    if (this.state.outboundDate === null) {
      this.setState({
        validationErrorOutboundDate: 'departure date is required'
      });
    } else {
      this.setState({ validationErrorOutboundDate: '' });
    }
  }

  formatDate(date) {
    return date === null
      ? null
      : `${date.getUTCFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${date
          .getDate()
          .toString()
          .padStart(2, '0')}`;
  }

  getIataCode(stations, city) {
    return city === '' ? '' : stations.find(e => e.shortName === city).iata;
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

    const style = {
      margin: 12
    };

    return (
      <form>
        <SelectField
          className="airport-select"
          floatingLabelText="from"
          value={this.state.origin}
          onChange={this.handleOriginChange}
          errorText={this.state.validationErrorOrigin}
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
          errorText={this.state.validationErrorDestination}
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
            minDate={new Date()}
            errorText={this.state.validationErrorOutboundDate}
          />
          <DatePicker
            hintText="return"
            value={this.state.inboundDate}
            onChange={this.handleInboundDateChange}
            shouldDisableDate={this.disableDates}
          />
        </div>
        <RaisedButton
          label="search flights"
          style={style}
          onClick={this.handleSubmit}
        />
      </form>
    );
  }
}

export default SearchField;
