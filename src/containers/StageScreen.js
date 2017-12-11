import React, {Component} from 'react';
import {connect} from 'react-redux';

import PathwayStageScreen from './PathwayStageScreen/index';
import {selectStage} from '../actions/selectStage';

class StageScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const questionText = this.props.firstName + ', which stage best describes where you are on your journey?';

    return (
      <PathwayStageScreen buttonText="I AM HERE" questionText={questionText} nextScreen="StageSuccess" onSelect={selectStage} />
    );
  }

}

const mapStateToProps = ({profile}) => ({
  firstName: profile.firstName,
});

export default connect(mapStateToProps)(StageScreen);
