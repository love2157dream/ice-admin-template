import React, { Component } from 'react';
import UserLogin from './components/UserLogin';

export default class Page16 extends Component {
  static displayName = 'Page16';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page16-page">
        <UserLogin />
      </div>
    );
  }
}
