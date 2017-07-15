import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import FETCH from '../redux/actions/fetch';
import { initialize, createPool } from '../redux/actions/mysqlws';
import './Connect.css';

class Connect extends Component {
  constructor(...props) {
    super(...props);
    this.state = {
      host: "localhost",
      username: "",
      password: "",
    }
  }

  componentWillMount() {
    this.props.initialize("ws://localhost:3000/ws/");
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  submit(ev) {
    this.props.createPool({
      host: this.state.host,
      user: this.state.username,
      password: this.state.password,
    });
    ev.preventDefault();
  }

  render() {
    if(this.props.ws === null) {
      return (
        <div>
          Connecting...
        </div>
      )
    }
    if(this.props.pool === null || this.props.pool.status !== FETCH.SUCCESS) {
      let enabled = this.props.pool === null ||
        this.props.pool.status === FETCH.ERROR;
      let error = this.props.pool !== null &&
        this.props.pool.status === FETCH.ERROR;
      let error_element = "";
      if(error) {
        let error_message = this.props.pool.result.sqlMessage ||
                      this.props.pool.result.code || "";
        error_element = (
          <div>
            <h4>An error occured</h4>
            <p>{error_message}</p>
          </div>
        )
      }
      return (
        <div className="login-page">
          <form onSubmit={this.submit.bind(this)}>
            <h1>Connect</h1>
            {error_element}
            <TextField
              name="host"
              floatingLabelText="Host"
              type="text"
              value={this.state.host}
              disabled={!enabled}
              onChange={this.handleChange.bind(this)} />
              <br />
            <TextField
              name="username"
              floatingLabelText="Username"
              type="text"
              value={this.state.username}
              disabled={!enabled}
              onChange={this.handleChange.bind(this)} />
              <br />
            <TextField
              name="password"
              floatingLabelText="password"
              type="password"
              value={this.state.password}
              disabled={!enabled}
              onChange={this.handleChange.bind(this)} />
              <br />
            <RaisedButton
              label="Connect"
              primary
              type="submit" />
            {
              enabled ? "" :
              <RefreshIndicator
                status="loading"
                className="loading" />
            }
          </form>
        </div>
      )
    }
    return (
      <div>
        TODO
      </div>
    );
  }
}

export default connect(
  state => {
    return {
      ws: state.mysqlws.mysql,
      pool: state.mysqlws.pool,
    }
  },
  dispatch => {
    return {
      initialize: address => dispatch(initialize(address)),
      createPool: pool_options => dispatch(createPool(pool_options)),
    }
  }
)(Connect);