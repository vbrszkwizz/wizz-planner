import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import './summary.css';

const Summary = ({
  selectedOutbound,
  selectedInbound,
  selectedOutboundValues,
  selectedInboundValues,
  origin,
  destination,
  outboundDate,
  inboundDate
}) => {
  const style = {
    width: 830
  };

  const countTotal = () => {
    const outBoundPrice =
      selectedOutbound.length > 0 ? selectedOutboundValues[1].slice(2) : '0';
    const inBoundPrice =
      selectedInbound.length > 0 ? selectedInboundValues[1].slice(2) : '0';
    return parseInt(outBoundPrice, 10) + parseInt(inBoundPrice, 10);
  };

  const renderSummaryRow = (origin, destination, date, values) => (
    <section className="summary-row">
      <div>
        {origin}
        <span>&nbsp;</span>
        <i className="material-icons">arrow_forward</i>
        <span>&nbsp;</span>
        {destination}
      </div>
      <div>
        <i className="material-icons">today</i>
        <span>&nbsp;</span>
        {date}
      </div>
      <div>
        <i className="material-icons">flight_takeoff</i>
        <span>&nbsp;</span>
        {values[2]}
        <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <i className="material-icons">flight_land</i>
        <span>&nbsp;</span>
        {values[3]}
      </div>
      <div className="ticket-type">type: {values[0]}</div>
      <div className="ticket-price">
        <i className="material-icons">euro_symbol</i>
        <span>&nbsp;</span>
        {values[1].slice(2)}
      </div>
    </section>
  );

  return (
    <Card style={style} zDepth={2} className="summary">
      <CardTitle title="summary" />
      <CardText>
        {selectedOutbound.length > 0 &&
          renderSummaryRow(
            origin,
            destination,
            outboundDate,
            selectedOutboundValues
          )}
        {selectedInbound.length > 0 && (
          renderSummaryRow(
            destination,
            origin,
            inboundDate,
            selectedInboundValues
          )
        )}
        <p className="total">
          TOTAL SUM<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
          {countTotal()} EUR
        </p>
      </CardText>
    </Card>
  );
};

Summary.propTypes = {
  selectedOutbound: PropTypes.arrayOf(PropTypes.number),
  selectedInbound: PropTypes.arrayOf(PropTypes.number),
  selectedOutboundValues: PropTypes.arrayOf(PropTypes.string),
  selectedInboundValues: PropTypes.arrayOf(PropTypes.string),
  origin: PropTypes.string.isRequired,
  destination: PropTypes.string.isRequired,
  outboundDate: PropTypes.string.isRequired,
  inboundDate: PropTypes.string
};

export default Summary;
