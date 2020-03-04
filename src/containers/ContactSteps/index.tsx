import React, { useState, useEffect } from 'react';
import { View, SectionList, SectionListData } from 'react-native';
import { connect } from 'react-redux-legacy';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { getContactSteps } from '../../actions/steps';
import { TrackStateContext } from '../../actions/analytics';
import { Button } from '../../components/common';
import BottomButton from '../../components/BottomButton';
import AcceptedStepItem from '../../components/AcceptedStepItem';
import NULL from '../../../assets/images/footprints.png';
import { ANALYTICS_ASSIGNMENT_TYPE } from '../../constants';
import {
  orgIsCru,
  keyExtractorId,
  getAnalyticsAssignmentType,
} from '../../utils/common';
import { promptToAssign } from '../../utils/prompt';
import { contactAssignmentSelector } from '../../selectors/people';
import {
  assignContactAndPickStage,
  navigateToStageScreen,
  navigateToAddStepFlow,
} from '../../actions/misc';
import NullStateComponent from '../../components/NullStateComponent';
import { AuthState } from '../../reducers/auth';
import { Step, StepsState } from '../../reducers/steps';
import { Person } from '../../reducers/people';
import { Organization } from '../../reducers/organizations';
import { useAnalytics } from '../../utils/hooks/useAnalytics';

import styles from './styles';

interface ContactStepsProps {
  showAssignPrompt: boolean;
  steps: Step[];
  completedSteps: Step[];
  contactAssignment?: { pathway_stage_id: string };
  myId: string;
  person: Person;
  organization: Organization;
  analyticsAssignmentType: TrackStateContext[typeof ANALYTICS_ASSIGNMENT_TYPE];
}

const ContactSteps = ({
  showAssignPrompt,
  steps,
  completedSteps,
  contactAssignment,
  myId,
  person,
  organization,
  analyticsAssignmentType,
}: ContactStepsProps) => {
  useAnalytics(['person', 'my steps'], {
    screenContext: { [ANALYTICS_ASSIGNMENT_TYPE]: analyticsAssignmentType },
  });
  const { t } = useTranslation('contactSteps');
  const dispatch = useDispatch();
  const [hideCompleted, setHideCompleted] = useState(true);

  const isMe = myId === person.id;

  const handleGetSteps = () =>
    dispatch(getContactSteps(person.id, organization.id));

  useEffect(() => {
    handleGetSteps();
  }, []);

  const handleComplete = () => {
    handleGetSteps();
  };

  const handleAssign = async () => {
    if (showAssignPrompt) {
      if (!(await promptToAssign())) {
        return;
      }
    }

    dispatch(assignContactAndPickStage(person, organization));
  };

  const handleCreateStep = () => {
    (contactAssignment && contactAssignment.pathway_stage_id) || isMe
      ? dispatch(navigateToAddStepFlow(isMe, person, organization))
      : contactAssignment
      ? dispatch(
          navigateToStageScreen(
            false,
            person,
            contactAssignment,
            organization,
            null,
          ),
        )
      : handleAssign();
  };

  const toggleCompletedSteps = () => setHideCompleted(!hideCompleted);

  const stepListSections = [
    {
      key: 'active',
      data: steps,
    },
    ...(hideCompleted ? [] : [{ key: 'completed', data: completedSteps }]),
  ];

  const renderItem = ({ item }: { item: Step }) => (
    <AcceptedStepItem
      testID="stepItem"
      step={item}
      onComplete={handleComplete}
    />
  );

  const renderCompletedStepsButton = () =>
    completedSteps.length === 0 ? null : (
      <Button
        testID="completedStepsButton"
        pill={true}
        text={t(
          hideCompleted ? 'showCompletedSteps' : 'hideCompletedSteps',
        ).toUpperCase()}
        onPress={toggleCompletedSteps}
        style={styles.completedStepsButton}
        buttonTextStyle={styles.completedStepsButtonText}
      />
    );

  const renderSectionFooter = ({
    section: { key },
  }: {
    section: SectionListData<{ key: string }>;
  }) => (key === 'active' ? renderCompletedStepsButton() : null);

  const renderSteps = () => (
    <SectionList
      contentContainerStyle={styles.list}
      contentInset={{ bottom: 90 }}
      sections={stepListSections}
      keyExtractor={keyExtractorId}
      renderItem={renderItem}
      renderSectionFooter={renderSectionFooter}
      showsVerticalScrollIndicator={false}
    />
  );

  const renderNull = () => (
    <NullStateComponent
      imageSource={NULL}
      headerText={t('header').toUpperCase()}
      descriptionText={
        isMe ? t('stepSelfNull') : t('stepNull', { name: person.first_name })
      }
      content={renderCompletedStepsButton()}
    />
  );

  return (
    <View style={styles.container}>
      {steps.length > 0 || !hideCompleted ? renderSteps() : renderNull()}
      <BottomButton onPress={handleCreateStep} text={t('addStep')} />
    </View>
  );
};

const mapStateToProps = (
  { auth, steps }: { auth: AuthState; steps: StepsState },
  { person, organization }: { person: Person; organization: Organization },
) => {
  const allSteps =
    steps.contactSteps[`${person.id}-${organization.id || 'personal'}`] || {};

  return {
    showAssignPrompt: orgIsCru(organization),
    steps: allSteps.steps || [],
    completedSteps: allSteps.completedSteps || [],
    contactAssignment: contactAssignmentSelector(
      { auth },
      { person, orgId: organization.id },
    ),
    myId: auth.person.id,
    analyticsAssignmentType: getAnalyticsAssignmentType(
      person,
      auth,
      organization,
    ),
  };
};

export default connect(mapStateToProps)(ContactSteps);
