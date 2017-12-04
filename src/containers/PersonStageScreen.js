import React, {Component} from 'react';
import {connect} from 'react-redux';

import PathwayStageScreen from './PathwayStageScreen';

class PersonStageScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const questionText = 'Which stage best describes where ' + this.props.personFirstName + ', is on their journey?';

    return (
      <PathwayStageScreen buttonText="HERE" questionText={questionText} nextScreen="MainTabs" />
    );
  }

}

const mapStateToProps = ({personProfile}) => ({
  personFirstName: personProfile.personFirstName,
});

export default connect(mapStateToProps)(PersonStageScreen);
