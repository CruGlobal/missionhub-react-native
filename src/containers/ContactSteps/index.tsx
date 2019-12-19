import React, { useState, useEffect } from 'react';
import { AnyAction } from 'redux';
import { View, SectionList, SectionListData } from 'react-native';
import { connect } from 'react-redux-legacy';
import { ThunkDispatch } from 'redux-thunk';
import { useTranslation } from 'react-i18next';

import { getContactSteps } from '../../actions/steps';
import { Button } from '../../components/common';
import BottomButton from '../../components/BottomButton';
import AcceptedStepItem from '../../components/AcceptedStepItem';
import NULL from '../../../assets/images/footprints.png';
import { orgIsCru, keyExtractorId } from '../../utils/common';
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
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
  showAssignPrompt: boolean;
  steps: Step[];
  completedSteps: Step[];
  contactAssignment?: { pathway_stage_id: string };
  myId: string;
  person: Person;
  organization: Organization;
}

const ContactSteps = ({
  dispatch,
  showAssignPrompt,
  steps,
  completedSteps,
  contactAssignment,
  myId,
  person,
  organization,
}: ContactStepsProps) => {
  useAnalytics(['person', 'my steps']);
  const { t } = useTranslation('contactSteps');
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
      descriptionText={t('stepNull', { name: person.first_name })}
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
  };
};

export default connect(mapStateToProps)(ContactSteps);
