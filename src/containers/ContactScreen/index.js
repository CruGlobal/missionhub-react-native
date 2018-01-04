import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { navigatePush, navigateReset } from '../../actions/navigation';
import { getUserDetails } from '../../actions/people';
import { getStages } from '../../actions/stages';

import styles from './styles';
import { Flex, IconButton } from '../../components/common';
import ContactHeader from '../../components/ContactHeader';
import Header from '../Header';
import { CASEY, JEAN } from '../../constants';

class ContactScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      contactStage: {},
      contactAssignmentId: null,
    };

    this.handleChangeStage = this.handleChangeStage.bind(this);
  }

  componentDidMount() {
    let contact;

    if (this.props.person.id) {
      this.props.dispatch(getUserDetails(this.props.person.id)).then((results) => {
        if (this.props.person.id === this.props.myId) {
          contact = results.findAll('user') || [];
        } else {
          contact = results.findAll('contact_assignment') || [];
          this.setState({ contactAssignmentId: contact[0].id });
        }
        if (contact[0].pathway_stage_id) {
          if (this.props.stages.length > 0) {
            const contactStage = this.props.stages.find((s)=> s.id == contact[0].pathway_stage_id);
            this.setState({ contactStage });
          } else {
            this.props.dispatch(getStages()).then((r) => {
              const stageResults = r.findAll('pathway_stage') || [];
              const contactStage = stageResults.find((s)=> s.id == contact[0].pathway_stage_id);
              this.setState({ contactStage });
            });
          }
        }
      });
    }
  }

  handleChangeStage() {
    if (this.props.person.id === this.props.myId) {
      this.props.dispatch(navigatePush('Stage', {
        onComplete: (stage) => this.setState({ contactStage: stage }),
        currentStage: this.state.contactStage && this.state.contactStage.id ? this.state.contactStage.id : null,
        contactId: this.props.person.id,
      }));
    } else {
      this.props.dispatch(navigatePush('PersonStage', {
        onComplete: (stage) => this.setState({ contactStage: stage }),
        currentStage: this.state.contactStage && this.state.contactStage.id ? this.state.contactStage.id : null,
        name: this.props.person.first_name,
        contactId: this.props.person.id,
        contactAssignmentId: this.state.contactAssignmentId,
      }));
    }
  }

  render() {
    const { person, isCasey } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Header
          left={
            <IconButton name="backIcon" type="MissionHub" onPress={() => this.props.dispatch(navigateReset('MainTabs'))} />
          }
          right={
            <IconButton name="moreIcon" type="MissionHub" onPress={() => this.props.dispatch(navigatePush('DrawerOpen'))} />
          }
          shadow={false}
        />
        <Flex align="center" justify="center" value={1} style={styles.container}>
          <ContactHeader onChangeStage={this.handleChangeStage} type={isCasey ? CASEY : JEAN} person={person} stage={this.state.contactStage} />
        </Flex>
      </View>
    );
  }
}

ContactScreen.propTypes = {
  person: PropTypes.shape({
    id: PropTypes.string.isRequired,
    first_name: PropTypes.string.isRequired,
  }).isRequired,
};


const mapStateToProps = ({ auth, stages }, { navigation }) => ({
  ...(navigation.state.params || {}),
  isCasey: !auth.hasMinistries,
  stages: stages.stages,
  myId: auth.personId,
});

export default connect(mapStateToProps)(ContactScreen);
