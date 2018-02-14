import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import Card from 'material-ui/Card';
import flatten from 'lodash.flatten';
import './flightsList.css';

class FlightsList extends Component {
  isSelectedOutbound = index => this.props.selectedOutbound.includes(index);
  isSelectedInbound = index => this.props.selectedInbound.includes(index);

  getProperties = array =>
    flatten(
      array.map(e =>
        e.fares.map(el => ({
          departure: e.departure.slice(11, 16),
          arrival: e.arrival.slice(11, 16),
          bundle: el.bundle,
          price: el.price
        }))
      )
    );

  render() {
    let flights = this.getProperties(this.props.flights);
    let flightsBack = this.getProperties(this.props.flightsBack);

    const style = {
      width: 830,
      margin: 20
    };

    return (
      <Card style={style} zDepth={2}>
        <div className="flights-list">
          <Table
            onRowSelection={this.props.handleRowSelectionOutbound}
            onCellClick={this.props.handleOnCellClickOutbound}
          >
            <TableHeader>
              <TableRow>
                §
                <TableHeaderColumn colSpan="4" style={{ textAlign: 'center' }}>
                  {this.props.origin} - {this.props.destination}
                </TableHeaderColumn>
              </TableRow>
              <TableRow>
                <TableHeaderColumn>type</TableHeaderColumn>
                <TableHeaderColumn>price</TableHeaderColumn>
                <TableHeaderColumn>departure</TableHeaderColumn>
                <TableHeaderColumn>arrival</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody deselectOnClickaway={false}>
              {flights.map((e, i) => (
                <TableRow key={i} selected={this.isSelectedOutbound(i)}>
                  <TableRowColumn>{e.bundle}</TableRowColumn>
                  <TableRowColumn>€ {e.price}</TableRowColumn>
                  <TableRowColumn>{e.departure}</TableRowColumn>
                  <TableRowColumn>{e.arrival}</TableRowColumn>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {this.props.flightsBack.length > 0 && (
            <Table
              onRowSelection={this.props.handleRowSelectionInbound}
              onCellClick={this.props.handleOnCellClickInbound}
            >
              <TableHeader>
                <TableRow>
                  <TableHeaderColumn
                    colSpan="4"
                    style={{ textAlign: 'center' }}
                  >
                    {this.props.destination} - {this.props.origin}
                  </TableHeaderColumn>
                </TableRow>
                <TableRow>
                  <TableHeaderColumn>type</TableHeaderColumn>
                  <TableHeaderColumn>price</TableHeaderColumn>
                  <TableHeaderColumn>departure</TableHeaderColumn>
                  <TableHeaderColumn>arrival</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody deselectOnClickaway={false}>
                {flightsBack.map((e, i) => (
                  <TableRow key={i} selected={this.isSelectedInbound(i)}>
                    <TableRowColumn>{e.bundle}</TableRowColumn>
                    <TableRowColumn>€ {e.price}</TableRowColumn>
                    <TableRowColumn>{e.departure}</TableRowColumn>
                    <TableRowColumn>{e.arrival}</TableRowColumn>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    );
  }
}

FlightsList.propTypes = {
  flights: PropTypes.arrayOf(PropTypes.object).isRequired,
  flightsBack: PropTypes.arrayOf(PropTypes.object).isRequired,
  origin: PropTypes.string.isRequired,
  destination: PropTypes.string.isRequired,
  selectedOutbound: PropTypes.arrayOf(PropTypes.number),
  selectedInbound: PropTypes.arrayOf(PropTypes.number),
  handleRowSelectionOutbound: PropTypes.func.isRequired,
  handleRowSelectionInbound: PropTypes.func.isRequired,
  handleOnCellClickOutbound: PropTypes.func.isRequired,
  handleOnCellClickInbound: PropTypes.func.isRequired
};

export default FlightsList;
