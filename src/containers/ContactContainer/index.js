import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DrawerNavigator } from 'react-navigation';
import PropTypes from 'prop-types';

import { getUserDetails } from '../../actions/people';
import { getStages } from '../../actions/stages';

import ContactScreen from '../../containers/ContactScreen';
import ContactSideMenu from '../../components/ContactSideMenu';

const DrawerContainer = DrawerNavigator(
  {
    Main: { screen: ContactScreen },
  },
  {
    contentComponent: ContactSideMenu,
    drawerPosition: 'right',
  }
);

class ContactContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      person: this.props.person,
      contactStage: {},
      contactAssignmentId: null,
    };
  }

  async componentDidMount() {
    if (this.props.person.id) {
      const results = await this.props.dispatch(getUserDetails(this.props.person.id));
      const { contactAssignmentId, pathwayStageId } = this.props.personIsCurrentUser ?
        this.getPathwayStageIdFromUser(results) :
        this.getAssignmentWithPathwayStageId(results);

      this.setState({ contactAssignmentId: contactAssignmentId });
      await this.setContactStage(pathwayStageId);
    }
  }

  getPathwayStageIdFromUser(results) {
    const user = results.findAll('user')[0];
    return {
      contactAssignmentId: null,
      pathwayStageId: user && user.pathway_stage_id,
    };
  }

  getAssignmentWithPathwayStageId(results) {
    const assignment = results.findAll('contact_assignment')
      .find((assignment) => assignment.assigned_to.id === this.props.myId);
    return {
      contactAssignmentId: assignment && assignment.id,
      pathwayStageId: assignment && assignment.pathway_stage_id,
    };
  }

  async setContactStage(pathwayStageId) {
    if (pathwayStageId) {
      const stageResults = this.props.stages.length > 0 ?
        this.props.stages :
        (await this.props.dispatch(getStages())).findAll('pathway_stage');
      const contactStage = stageResults.find((s)=> s.id === pathwayStageId.toString());
      this.setState({ contactStage });
    }
  }

  render() {
    return <DrawerContainer navigation={this.props.navigation} screenProps={{ ...this.props, ...this.state }} />;
  }
}
ContactContainer.router = DrawerContainer.router;

ContactContainer.propTypes = {
  person: PropTypes.shape({
    id: PropTypes.string.isRequired,
    first_name: PropTypes.string.isRequired,
  }).isRequired,
};


const mapStateToProps = ({ auth, stages }, { navigation }) => ({
  ...(navigation.state.params || {}),
  isCasey: !auth.hasMinistries,
  isJean: auth.hasMinistries,
  stages: stages.stages,
  myId: auth.personId,
  personIsCurrentUser: navigation.state.params.person.id === auth.personId,
});

export default connect(mapStateToProps)(ContactContainer);
