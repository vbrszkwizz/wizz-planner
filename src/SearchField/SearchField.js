import React from 'react';
import pick from 'lodash.pick';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
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
    margin: 12
  };

  return (
    <form>
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
      <RaisedButton
        label="search flights"
        style={style}
        onClick={props.handleSubmit}
      />
    </form>
  );
};

export default SearchField;
