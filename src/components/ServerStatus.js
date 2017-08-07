import React from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';

import FETCH from '../redux/actions/fetch';
import { query } from '../redux/actions/mysqlws';

import ProcessList from './ProcessList';

class ServerStatus extends React.Component {
  constructor(...props) {
    super(...props);
    this.state = {
      query_id: null,
      next_query_id: null,
    }
  }

  updateMyId(id) {
    if(this.state.query_id === null) {
      this.setState({
        query_id: id,
      });
    }
    this.setState({
      next_query_id: id,
    });
  }

  componentWillReceiveProps(nextProps) {
    if(this.state.next_query_id !== null) {
      let next_query = this.state.next_query_id;
      if(nextProps.queries[next_query].status !== FETCH.FETCHING) {
        this.setState({
          query_id: next_query,
          next_query_id: null,
        });
      }
    }
  }

  componentWillMount() {
    let query = "SHOW GLOBAL STATUS";
    this.props.query(query, (id) => this.updateMyId(id));
    setInterval(() => {
      this.props.query(query, (id) => this.updateMyId(id));
    }, 5000);
  }

  formatBytes(count) {
    let multipliers = ["", "ki", "Mi", "Gi", "Ti"];
    let multiplier = 0;
    while(count >= 1000 && multiplier < multipliers.length) {
      multiplier += 1;
      count /= 1000;
    }

    return count.toFixed(2) + " " + multipliers[multiplier] + "B";
  }

  render() {
    let my_query = this.props.queries[this.state.query_id];
    if(my_query === undefined || my_query.status === FETCH.FETCHING) {
      return (
        <div>fetching</div>
      );
    }
    if(my_query.status === FETCH.ERROR) {
      return (
        <div>Error: {my_query.result.sqlMessage}</div>
      );
    }
    let server_status = new Map(
      my_query.result.results.map((e) => [e.Variable_name, e.Value])
    );
    return (
      <Paper>
        <Toolbar noGutter>
          <ToolbarGroup>
            <ToolbarTitle text="Server Status" />
          </ToolbarGroup>
        </Toolbar>
        <div>
          <div>
            Uptime: {server_status.get("Uptime")}
          </div>
          <div>
            Network:
            {this.formatBytes(server_status.get("Bytes_sent"))} sent,
            {this.formatBytes(server_status.get("Bytes_received"))} received.
          </div>
        </div>
        <ProcessList />
      </Paper>
    )
  }
}

export default connect(
  state => {
    return {
      queries: state.mysqlws.queries,
    };
  },
  dispatch => {
    return {
      query: (q, cb) => dispatch(query(q, cb)),
    }
  }
)(ServerStatus);
