import React from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import FETCH from '../redux/actions/fetch';

class QueryResultTable extends React.Component {
  render() {
    let {query, ...subprops} = this.props;
    if(query === undefined || query.status === FETCH.FETCHING) {
      return (
        <div>fetching</div>
      );
    }
    if(query.status === FETCH.ERROR) {
      return (
        <div>Error: {query.result}</div>
      );
    }
    let fields = query.result.fields.map(c => c.name);
    return (
      <Table {...subprops}>
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={false}>
          <TableRow>
            {fields.map(c =>
              <TableHeaderColumn key={c}>{c}</TableHeaderColumn>
            )}
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}>
          {query.result.results.map((row, i) => (
            <TableRow key={i} >
              {fields.map(f =>
                <TableRowColumn key={f}>{row[f]}</TableRowColumn>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
}

export default QueryResultTable;
