import React, {Component} from 'react';
import {connect} from 'react-redux';

import PathwayStageScreen from './PathwayStageScreen';
import {selectPersonStage} from '../actions/selectStage';

class PersonStageScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const questionText = 'Which stage best describes where ' + this.props.personFirstName + ' is on their journey?';

    return (
      <PathwayStageScreen
        buttonText="HERE"
        questionText={questionText}
        nextScreen="PersonStep"
        onSelect={selectPersonStage.bind(null, this.props.personId, this.props.id)} />
    );
  }

}

const mapStateToProps = ({personProfile, auth}) => ({
  personFirstName: personProfile.personFirstName,
  personId: personProfile.id,
  id: auth.personId,
});

export default connect(mapStateToProps)(PersonStageScreen);
