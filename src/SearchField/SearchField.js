import React from 'react';
import PropTypes from 'prop-types';
import pick from 'lodash.pick';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import './searchField.css';

const SearchField = props => {
  let stations = props.stations
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

  const disableDates = date => +date <= +props.outboundDate;

  const style = {
    margin: 12,
    height: 38
  };

  const paperStyle = {
    height: 170,
    width: 830,
    margin: 20
  };

  return (
    <Paper style={paperStyle} zDepth={2}>
      <form className="search-field">
        <div className="yo">
          <SelectField
            className="airport-select"
            floatingLabelText="from"
            value={props.origin}
            onChange={props.handleOriginChange}
            errorText={props.validationErrorOrigin}
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
            value={props.destination}
            onChange={props.handleDestinationChange}
            errorText={props.validationErrorDestination}
          >
            {props.connections.map(connection => (
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
              value={props.outboundDate}
              onChange={props.handleOutboundDateChange}
              minDate={new Date()}
              errorText={props.validationErrorOutboundDate}
            />
            <DatePicker
              hintText="return"
              value={props.inboundDate}
              onChange={props.handleInboundDateChange}
              shouldDisableDate={disableDates}
            />
          </div>
        </div>
        <FlatButton
          label="search flights"
          style={style}
          onClick={props.handleSubmit}
        />
      </form>
    </Paper>
  );
};

SearchField.propTypes = {
  stations: PropTypes.arrayOf(PropTypes.object).isRequired,
  origin: PropTypes.string.isRequired,
  connections: PropTypes.array.isRequired,
  destination: PropTypes.string.isRequired,
  outboundDate: PropTypes.instanceOf(Date),
  inboundDate: PropTypes.instanceOf(Date),
  validationErrorOrigin: PropTypes.string.isRequired,
  validationErrorDestination: PropTypes.string.isRequired,
  validationErrorOutboundDate: PropTypes.string.isRequired,
  handleOriginChange: PropTypes.func.isRequired,
  handleDestinationChange: PropTypes.func.isRequired,
  handleOutboundDateChange: PropTypes.func.isRequired,
  handleInboundDateChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

export default SearchField;
