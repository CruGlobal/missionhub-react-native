import React, { useState, useEffect } from 'react';
import { AnyAction } from 'redux';
import { View, FlatList, ScrollView } from 'react-native';
import { connect } from 'react-redux';
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

import styles from './styles';

interface ContactStepsProps {
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
  showAssignPrompt: boolean;
  steps: Step[];
  completedSteps: Step[];
  contactAssignment: any;
  isMe: boolean;
  person: Person;
  organization: Organization;
}

const ContactSteps = ({
  dispatch,
  showAssignPrompt,
  steps,
  completedSteps,
  contactAssignment,
  isMe,
  person,
  organization,
}: ContactStepsProps) => {
  const { t } = useTranslation('contactSteps');
  const [hideCompleted, setHideCompleted] = useState(true);

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

  const renderRow = ({ item }: { item: Step }) => (
    <AcceptedStepItem
      testID="stepItem"
      step={item}
      onComplete={handleComplete}
    />
  );

  const renderCompletedStepsButton = () => {
    if (completedSteps.length === 0) {
      return null;
    }

    return (
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
  };

  const renderList = (data: Step[]) => {
    if (data.length === 0) {
      return null;
    }
    return (
      <FlatList
        testID="stepsList"
        data={data}
        keyExtractor={keyExtractorId}
        renderItem={renderRow}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  const renderCompletedList = (data: Step[]) => (
    <FlatList
      data={data}
      keyExtractor={keyExtractorId}
      renderItem={renderRow}
      showsVerticalScrollIndicator={false}
    />
  );

  const renderSteps = () => (
    <ScrollView>
      <View style={styles.list}>
        {renderList(steps)}
        {renderCompletedStepsButton()}
        {hideCompleted ? null : renderCompletedList(completedSteps)}
      </View>
    </ScrollView>
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
  const { id: personId } = person;
  const { id: orgId = 'personal' } = organization;

  const allSteps = steps.contactSteps[`${personId}-${orgId}`] || {};
  const myId = auth.person.id;

  return {
    showAssignPrompt: orgIsCru(organization),
    myId,
    steps: allSteps.steps || [],
    completedSteps: allSteps.completedSteps || [],
    contactAssignment: contactAssignmentSelector({ auth }, { person, orgId }),
    isMe: personId === myId,
    person,
    organization,
  };
};

export default connect(mapStateToProps)(ContactSteps);
