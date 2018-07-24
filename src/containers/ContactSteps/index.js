import React, { Component } from 'react';
import { View, FlatList, Image } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { navigatePush, navigateBack } from '../../actions/navigation';
import { removeSwipeStepsContact } from '../../actions/swipe';
import {
  getContactSteps,
  completeStep,
  deleteStepWithTracking,
} from '../../actions/steps';
import { reloadJourney } from '../../actions/journey';
import { Flex, Button, Text } from '../../components/common';
import StepItem from '../../components/StepItem';
import RowSwipeable from '../../components/RowSwipeable';
import NULL from '../../../assets/images/footprints.png';
import { buildTrackingObj, getAnalyticsSubsection } from '../../utils/common';
import { promptToAssign } from '../../utils/promptToAssign';
import { PERSON_SELECT_STEP_SCREEN } from '../PersonSelectStepScreen';
import { SELECT_MY_STEP_SCREEN } from '../SelectMyStepScreen';
import { contactAssignmentSelector } from '../../selectors/people';
import {
  assignContactAndPickStage,
  navigateToStageScreen,
} from '../../actions/misc';

import styles from './styles';

const screenName = 'Contact Steps';

@translate('contactSteps')
class ContactSteps extends Component {
  constructor(props) {
    super(props);

    this.bumpComplete = this.bumpComplete.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.handleCreateStep = this.handleCreateStep.bind(this);
    this.handleSaveNewSteps = this.handleSaveNewSteps.bind(this);
    this.getSteps = this.getSteps.bind(this);
  }

  componentDidMount() {
    this.getSteps();
  }

  bumpComplete() {
    this.props.dispatch(removeSwipeStepsContact());
  }

  getSteps() {
    const { dispatch, person, organization = {} } = this.props;

    dispatch(getContactSteps(person.id, organization.id));
  }

  async handleRemove(step) {
    await this.props.dispatch(deleteStepWithTracking(step, screenName));
    this.getSteps();
  }

  async handleComplete(step) {
    const { dispatch, person, organization } = this.props;
    await dispatch(completeStep(step, screenName));
    this.getSteps();
    dispatch(
      reloadJourney(person.id, organization ? organization.id : undefined),
    );
  }

  async handleSaveNewSteps() {
    await this.getSteps();
    this.list && this.list.scrollToEnd();
    this.props.dispatch(navigateBack());
  }

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

  handleNavToSteps(stage, onComplete = null) {
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
            onComplete && onComplete();
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
            onComplete && onComplete();
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
    const { dispatch, person, organization, myId } = this.props;

    if (await promptToAssign()) {
      dispatch(
        assignContactAndPickStage(
          person.id,
          organization && organization.id,
          myId,
        ),
      );
    }
  }

  handleCreateStep() {
    const { contactAssignment, isMe } = this.props;

    (contactAssignment && contactAssignment.pathway_stage_id) || isMe
      ? this.handleNavToSteps()
      : contactAssignment
        ? this.handleNavToStage()
        : this.handleAssign();
  }

  renderRow({ item, index }) {
    const { showBump } = this.props;
    return (
      <RowSwipeable
        key={item.id}
        bump={showBump && index === 0}
        onBumpComplete={this.bumpComplete}
        onDelete={() => this.handleRemove(item)}
        onComplete={() => this.handleComplete(item)}
      >
        <StepItem step={item} type="contact" />
      </RowSwipeable>
    );
  }

  renderList() {
    const { steps } = this.props;
    return (
      <FlatList
        ref={c => (this.list = c)}
        style={styles.list}
        data={steps}
        keyExtractor={i => i.id}
        renderItem={this.renderRow}
        bounces={true}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  renderNull() {
    const name = this.props.person.first_name;
    const { t } = this.props;

    return (
      <Flex align="center" justify="center">
        <Image source={NULL} style={{ flexShrink: 1 }} resizeMode="contain" />
        <Text type="header" style={styles.nullHeader}>
          {t('header').toUpperCase()}
        </Text>
        <Text style={styles.nullText}>{t('stepNull', { name })}</Text>
      </Flex>
    );
  }

  render() {
    const { t, steps } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Flex
          align="center"
          justify="center"
          value={1}
          style={styles.container}
        >
          {steps.length > 0 ? this.renderList() : this.renderNull()}
        </Flex>
        <Flex justify="end">
          <Button
            type="secondary"
            onPress={this.handleCreateStep}
            text={t('addStep').toUpperCase()}
          />
        </Flex>
      </View>
    );
  }
}

ContactSteps.propTypes = {
  person: PropTypes.object,
  contactAssignment: PropTypes.object,
  organization: PropTypes.object,
};

const mapStateToProps = (
  { swipe, auth, steps },
  { person, organization = {} },
) => ({
  showBump: swipe.stepsContact,
  myId: auth.person.id,
  steps:
    steps.contactSteps[`${person.id}-${organization.id || 'personal'}`] || [],
  contactAssignment: contactAssignmentSelector(
    { auth },
    { person, orgId: organization.id },
  ),
  isMe: person.id === auth.person.id,
});

export default connect(mapStateToProps)(ContactSteps);
