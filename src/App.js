import React, { Component } from 'react';
import { connect } from 'react-redux';

import FETCH from './redux/actions/fetch';
import { initialize, createPool } from './redux/actions/mysqlws';
import logo from './logo.svg';
import './App.css';

class App extends Component {
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
      return (
        <form onSubmit={this.submit.bind(this)}>
          <input
            name="host"
            type="text"
            value={this.state.host}
            disabled={!enabled}
            onChange={this.handleChange.bind(this)} />
          <input
            name="username"
            type="text"
            value={this.state.username}
            disabled={!enabled}
            onChange={this.handleChange.bind(this)} />
          <input
            name="password"
            type="password"
            value={this.state.password}
            disabled={!enabled}
            onChange={this.handleChange.bind(this)} />
          <input type="submit" value="Submit" />
        </form>
      )
    }
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
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
)(App);
