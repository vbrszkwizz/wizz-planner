import React, { Component } from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import flatten from 'lodash.flatten';

class FlightsList extends Component {
  constructor() {
    super();
    this.state = {
      selected: []
    };
  }

  isSelected = index => {
    return this.state.selected.indexOf(index) !== -1;
  };

  handleRowSelection = selectedRows => {
    this.setState({
      selected: selectedRows
    });
  };

  render() {
    let flights = flatten(
      this.props.flights.map(e =>
        e.fares.map(el => ({
          departure: e.departure.slice(11, 16),
          arrival: e.arrival.slice(11, 16),
          bundle: el.bundle,
          price: el.price
        }))
      )
    );

    return (
      <Table onRowSelection={this.handleRowSelection} width="300px">
        <TableHeader>
          <TableRow>
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
        <TableBody>
          {flights.map((e, i) => (
            <TableRow key={i} selected={this.isSelected(i)}>
              <TableRowColumn>{e.bundle}</TableRowColumn>
              <TableRowColumn>{e.price}</TableRowColumn>
              <TableRowColumn>{e.departure}</TableRowColumn>
              <TableRowColumn>{e.arrival}</TableRowColumn>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

export default FlightsList;
