import React, { Component } from 'react';
import { connect } from 'react-redux';
import IconMessageScreen from './IconMessageScreen/index';

class StageSuccessScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const message = `${this.props.firstName},\nWe'd like to offer some things to help you in your spiritual journey.`;
    return <IconMessageScreen mainText={message} buttonText="CHOOSE MY STEPS" nextScreen="Step" iconPath={require('../../assets/images/pathFinder.png')} />;
  }
}

const mapStateToProps = ({ profile }) => ({
  firstName: profile.firstName,
});

export default connect(mapStateToProps)(StageSuccessScreen);
