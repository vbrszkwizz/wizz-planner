import React, { Component } from 'react';
import { pink500 } from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import SearchField from '../SearchField/SearchField';
import FlightsList from '../FlightsList/FlightsList';

class App extends Component {
  constructor() {
    super();
    this.state = {
      stations: [],
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
      flights: [],
      flightsBack: []
    };
    this.handleOriginChange = this.handleOriginChange.bind(this);
    this.handleDestinationChange = this.handleDestinationChange.bind(this);
    this.handleOutboundDateChange = this.handleOutboundDateChange.bind(this);
    this.handleInboundDateChange = this.handleInboundDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    fetch('https://mock-air.herokuapp.com/asset/stations')
      .then(res => res.json())
      .then(stations => this.setState({ stations }))
      .catch(console.error);
  }

  handleOriginChange(event) {
    let origin = event.target.innerHTML;

    localStorage.setItem('destination', '');
    this.setState({ destination: '' });

    localStorage.setItem('origin', origin);
    this.setState({ origin }, () => this.calculateConnections());

    this.setState({ validationErrorOrigin: '', flights: [] });
  }

  handleDestinationChange(event) {
    let destination = event.target.innerHTML;
    localStorage.setItem('destination', destination);
    this.setState({ destination, validationErrorDestination: '', flights: [] });
  }

  handleOutboundDateChange(event, date) {
    this.setState({
      outboundDate: date,
      validationErrorOutboundDate: '',
      flights: []
    });
  }

  handleInboundDateChange(event, date) {
    this.setState({ inboundDate: date, flightsBack: [] });
  }

  handleSubmit() {
    let payload = {
      origin: this.getIataCode(this.state.stations, this.state.origin),
      destination: this.getIataCode(
        this.state.stations,
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

    if (this.state.inboundDate !== null) {
      fetch(
        `https://mock-air.herokuapp.com/search?departureStation=${
          payload.destination
        }&arrivalStation=${payload.origin}&date=${payload.inboundDate}`
      )
        .then(res => res.json())
        .then(flightsBack => this.setState({ flightsBack }))
        .catch(console.error);
    }
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
    let connectionData = this.state.stations.filter(
      e => e.shortName === this.state.origin
    )[0].connections;

    let connectionIataCodes = connectionData.map(e => e.iata);

    if (connectionIataCodes.some(e => e === undefined)) {
      this.setState({ connections: [] });
      return;
    }

    let connections = connectionIataCodes
      .map(e => this.state.stations.find(el => el.iata === e))
      .map(e => e.shortName)
      .sort();

    localStorage.setItem('connections', connections);
    this.setState({ connections });
  }

  render() {
    const muiTheme = getMuiTheme({
      palette: {
        primary1Color: pink500,
        primary2Color: pink500
      },
      datePicker: {
        headerColor: pink500
      }
    });

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <SearchField
            stations={this.state.stations}
            origin={this.state.origin}
            connections={this.state.connections}
            destination={this.state.destination}
            outboundDate={this.state.outboundDate}
            inboundDate={this.state.inboundDate}
            validationErrorOrigin={this.state.validationErrorOrigin}
            validationErrorDestination={this.state.validationErrorDestination}
            validationErrorOutboundDate={this.state.validationErrorOutboundDate}
            handleOriginChange={this.handleOriginChange}
            handleDestinationChange={this.handleDestinationChange}
            handleOutboundDateChange={this.handleOutboundDateChange}
            handleInboundDateChange={this.handleInboundDateChange}
            handleSubmit={this.handleSubmit}
          />
          {this.state.flights.length > 0 && (
            <FlightsList
              flights={this.state.flights}
              flightsBack={this.state.flightsBack}
              origin={this.state.origin}
              destination={this.state.destination}
            />
          )}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
