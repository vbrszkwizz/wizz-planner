import React, { Component } from 'react';
import { pink500 } from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import SearchField from '../SearchField/SearchField';
import FlightsList from '../FlightsList/FlightsList';
import Summary from '../Summary/Summary';
import './app.css';

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
      flightsBack: [],
      selectedOutbound: [],
      selectedInbound: [],
      selectedOutboundValues: [],
      selectedInboundValues: []
    };
  }

  componentDidMount() {
    fetch('https://mock-air.herokuapp.com/asset/stations')
      .then(res => res.json())
      .then(stations => this.setState({ stations }))
      .catch(console.error);
  }

  handleOriginChange = event => {
    const origin = this.getValueFromSelect(event);

    localStorage.setItem('destination', '');
    this.setState({ destination: '' });

    localStorage.setItem('origin', origin);
    this.setState({ origin }, () => this.calculateConnections());

    this.setState({ validationErrorOrigin: '', flights: [] });
  };

  handleDestinationChange = event => {
    const destination = this.getValueFromSelect(event);
    localStorage.setItem('destination', destination);
    this.setState({ destination, validationErrorDestination: '', flights: [] });
  };

  getValueFromSelect = event =>
    event.target.childNodes[0].lastElementChild === undefined
      ? event.target.innerText
      : event.target.childNodes[0].lastElementChild.innerText
          .replace(/(\\n)/, '')
          .trim();

  handleOutboundDateChange = (event, date) => {
    this.setState({
      outboundDate: date,
      validationErrorOutboundDate: '',
      flights: []
    });
  };

  handleInboundDateChange = (event, date) => {
    this.setState({ inboundDate: date, flightsBack: [] });
  };

  handleSubmit = () => {
    const payload = {
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
  };

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

  formatDate = date =>
    date === null
      ? null
      : `${date.getUTCFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${date
          .getDate()
          .toString()
          .padStart(2, '0')}`;

  getIataCode = (stations, city) =>
    city === '' ? '' : stations.find(e => e.shortName === city).iata;

  calculateConnections() {
    const connectionData = this.state.stations.filter(
      e => e.shortName === this.state.origin
    )[0].connections;

    const connectionIataCodes = connectionData.map(e => e.iata);

    if (connectionIataCodes.some(e => e === undefined)) {
      this.setState({ connections: [] });
      return;
    }

    const connections = connectionIataCodes
      .map(e => this.state.stations.find(el => el.iata === e))
      .map(e => e.shortName)
      .sort();

    localStorage.setItem('connections', connections);
    this.setState({ connections });
  }

  handleRowSelectionOutbound = selectedRows => {
    this.setState({
      selectedOutbound: selectedRows
    });
  };

  handleRowSelectionInbound = selectedRows => {
    this.setState({
      selectedInbound: selectedRows
    });
  };

  handleCellClickOutbound = (row, col, event) => {
    this.setState({
      selectedOutboundValues: [
        event.currentTarget.parentNode.childNodes[1].innerHTML,
        event.currentTarget.parentNode.childNodes[2].innerHTML,
        event.currentTarget.parentNode.childNodes[3].innerHTML,
        event.currentTarget.parentNode.childNodes[4].innerHTML
      ]
    });
  };

  handleCellClickInbound = (row, col, event) => {
    this.setState({
      selectedInboundValues: [
        event.currentTarget.parentNode.childNodes[1].innerHTML,
        event.currentTarget.parentNode.childNodes[2].innerHTML,
        event.currentTarget.parentNode.childNodes[3].innerHTML,
        event.currentTarget.parentNode.childNodes[4].innerHTML
      ]
    });
  };

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
        <div className="planner-app">
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
              selectedOutbound={this.state.selectedOutbound}
              selectedInbound={this.state.selectedInbound}
              handleRowSelectionOutbound={this.handleRowSelectionOutbound}
              handleRowSelectionInbound={this.handleRowSelectionInbound}
              handleCellClickOutbound={this.handleCellClickOutbound}
              handleCellClickInbound={this.handleCellClickInbound}
            />
          )}
          {(this.state.selectedOutbound.length > 0 ||
            this.state.selectedInbound.length > 0) && (
            <Summary
              selectedOutbound={this.state.selectedOutbound}
              selectedInbound={this.state.selectedInbound}
              selectedOutboundValues={this.state.selectedOutboundValues}
              selectedInboundValues={this.state.selectedInboundValues}
              origin={this.state.origin}
              destination={this.state.destination}
              outboundDate={this.formatDate(this.state.outboundDate)}
              inboundDate={this.formatDate(this.state.inboundDate)}
            />
          )}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
