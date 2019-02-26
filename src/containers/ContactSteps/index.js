import React, { Component } from 'react';
import { View, FlatList, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { navigatePush, navigateBack } from '../../actions/navigation';
import { getContactSteps } from '../../actions/steps';
import { Button } from '../../components/common';
import BottomButton from '../../components/BottomButton';
import AcceptedStepItem from '../../components/AcceptedStepItem';
import NULL from '../../../assets/images/footprints.png';
import {
  buildTrackingObj,
  getAnalyticsSubsection,
  orgIsCru,
} from '../../utils/common';
import { promptToAssign } from '../../utils/promptToAssign';
import { PERSON_SELECT_STEP_SCREEN } from '../PersonSelectStepScreen';
import { SELECT_MY_STEP_SCREEN } from '../SelectMyStepScreen';
import {
  contactAssignmentSelector,
  personSelector,
} from '../../selectors/people';
import {
  assignContactAndPickStage,
  navigateToStageScreen,
} from '../../actions/misc';
import NullStateComponent from '../../components/NullStateComponent';

import styles from './styles';

@translate('contactSteps')
class ContactSteps extends Component {
  componentDidMount() {
    this.getSteps();
  }

  getSteps = () => {
    const { dispatch, person, organization = {} } = this.props;

    dispatch(getContactSteps(person.id, organization.id));
  };

  handleComplete = () => {
    this.getSteps();
  };

  handleSaveNewSteps = async () => {
    await this.getSteps();
    this.list && this.list.scrollToEnd();
    this.props.dispatch(navigateBack());
  };

  handleNavToStage() {
    const { dispatch, person, contactAssignment, organization } = this.props;

    return dispatch(
      navigateToStageScreen(
        false,
        person,
        contactAssignment,
        organization,
        null,
      ),
    );
  }

  handleNavToSteps() {
    const { dispatch, person, organization, isMe } = this.props;
    const subsection = getAnalyticsSubsection(person.id, this.props.myId);
    const trackingParams = {
      trackingObj: buildTrackingObj(
        'people : person : steps : add',
        'people',
        'person',
        'steps',
      ),
    };

    if (isMe) {
      dispatch(
        navigatePush(SELECT_MY_STEP_SCREEN, {
          ...trackingParams,
          onSaveNewSteps: () => {
            this.handleSaveNewSteps();
          },
          enableBackButton: true,
          organization,
        }),
      );
    } else {
      dispatch(
        navigatePush(PERSON_SELECT_STEP_SCREEN, {
          ...trackingParams,
          contactName: person.first_name,
          contactId: person.id,
          contact: person,
          organization,
          onSaveNewSteps: () => {
            this.handleSaveNewSteps();
          },
          createStepTracking: buildTrackingObj(
            `people : ${subsection} : steps : create`,
            'people',
            subsection,
            'steps',
          ),
        }),
      );
    }
  }

  async handleAssign() {
    const {
      dispatch,
      person,
      organization,
      myId,
      showAssignPrompt,
    } = this.props;

    if (showAssignPrompt) {
      if (!(await promptToAssign())) {
        return;
      }
    }

    dispatch(assignContactAndPickStage(person, organization, myId));
  }

  handleCreateStep = () => {
    const { contactAssignment, isMe } = this.props;

    (contactAssignment && contactAssignment.pathway_stage_id) || isMe
      ? this.handleNavToSteps()
      : contactAssignment
        ? this.handleNavToStage()
        : this.handleAssign();
  };

  toggleCompletedSteps = () => {};

  renderRow = ({ item }) => (
    <AcceptedStepItem step={item} onComplete={this.handleComplete} />
  );

  renderCompletedStepsButton = () => {
    const { completedStepsButton, completedStepsButtonText } = styles;

    return (
      <Button
        pill={true}
        text={this.props.t('showCompletedSteps').toUpperCase()}
        onPress={this.toggleCompletedSteps}
        style={completedStepsButton}
        buttonTextStyle={completedStepsButtonText}
      />
    );
  };

  ref = c => (this.list = c);

  keyExtractor = i => i.id;

  renderList(data) {
    return (
      <FlatList
        ref={this.ref}
        style={styles.container}
        data={data}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderRow}
        bounces={true}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  renderSteps() {
    const { steps } = this.props;
    return (
      <ScrollView flex={1}>
        {this.renderList(steps)}
        {this.renderCompletedStepsButton()}
        {this.renderList([])}
      </ScrollView>
    );
  }

  renderNull() {
    const name = this.props.person.first_name;
    const { t } = this.props;

    return (
      <NullStateComponent
        imageSource={NULL}
        headerText={t('header').toUpperCase()}
        descriptionText={t('stepNull', { name })}
      />
    );
  }

  render() {
    const { t, steps } = this.props;
    return (
      <View flex={1}>
        {steps.length > 0 ? this.renderSteps() : this.renderNull()}
        <BottomButton onPress={this.handleCreateStep} text={t('addStep')} />
      </View>
    );
  }
}

ContactSteps.propTypes = {
  isMe: PropTypes.bool,
  person: PropTypes.object,
  contactAssignment: PropTypes.object,
  organization: PropTypes.object,
};

const mapStateToProps = (
  { swipe, auth, steps, people },
  { person: navPerson, organization = {} },
) => {
  const person =
    personSelector(
      { people },
      { personId: navPerson.id, orgId: organization.id },
    ) || navPerson;

  return {
    showAssignPrompt: orgIsCru(organization),
    showBump: swipe.stepsContact,
    myId: auth.person.id,
    steps:
      steps.contactSteps[`${person.id}-${organization.id || 'personal'}`] || [],
    contactAssignment: contactAssignmentSelector(
      { auth },
      { person, orgId: organization.id },
    ),
    isMe: person.id === auth.person.id,
    person,
  };
};

export default connect(mapStateToProps)(ContactSteps);
