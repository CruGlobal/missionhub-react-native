import React, { useState, useEffect } from 'react';
import { AnyAction } from 'redux';
import { SafeAreaView, FlatList, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';

import { navigatePush } from '../../actions/navigation';
import { getContactSteps } from '../../actions/steps';
import { Button } from '../../components/common';
import BottomButton from '../../components/BottomButton';
import AcceptedStepItem from '../../components/AcceptedStepItem';
import NULL from '../../../assets/images/footprints.png';
import {
  buildTrackingObj,
  getAnalyticsSubsection,
  orgIsCru,
  keyExtractorId,
} from '../../utils/common';
import { promptToAssign } from '../../utils/prompt';
import { ADD_MY_STEP_FLOW, ADD_PERSON_STEP_FLOW } from '../../routes/constants';
import { contactAssignmentSelector } from '../../selectors/people';
import {
  assignContactAndPickStage,
  navigateToStageScreen,
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
  myId: string;
  steps: Step[];
  completedSteps: Step[];
  contactAssignment: any;
  isMe: boolean;
}

const ContactSteps = ({
  dispatch,
  showAssignPrompt,
  myId,
  steps,
  completedSteps,
  contactAssignment,
  isMe,
}: ContactStepsProps) => {
  const { t } = useTranslation('contactSteps');
  const [hideCompleted, setHideCompleted] = useState(true);
  const person: Person = useNavigationParam('person');
  const organization: Organization = useNavigationParam('organization');

  const handleGetSteps = () =>
    dispatch(getContactSteps(person.id, organization.id));

  useEffect(() => {
    handleGetSteps();
  }, []);

  const handleComplete = () => {
    handleGetSteps();
  };

  const handleNavToStage = () =>
    dispatch(
      navigateToStageScreen(
        false,
        person,
        contactAssignment,
        organization,
        null,
      ),
    );

  const handleNavToSteps = () => {
    const subsection = getAnalyticsSubsection(person.id, myId);
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
        navigatePush(ADD_MY_STEP_FLOW, {
          ...trackingParams,
          organization,
        }),
      );
    } else {
      dispatch(
        navigatePush(ADD_PERSON_STEP_FLOW, {
          ...trackingParams,
          contactName: person.first_name,
          contactId: person.id,
          organization,
          createStepTracking: buildTrackingObj(
            `people : ${subsection} : steps : create`,
            'people',
            subsection,
            'steps',
          ),
        }),
      );
    }
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
      ? handleNavToSteps()
      : contactAssignment
      ? handleNavToStage()
      : handleAssign();
  };

  const toggleCompletedSteps = () => setHideCompleted(!hideCompleted);

  const renderRow = ({ item }: { item: Step }) => (
    <AcceptedStepItem step={item} onComplete={handleComplete} />
  );

  const renderCompletedStepsButton = () => {
    if (completedSteps.length === 0) {
      return null;
    }

    return (
      <Button
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
        style={styles.topList}
        data={data}
        keyExtractor={keyExtractorId}
        renderItem={renderRow}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  const renderCompletedList = (data: Step[]) => (
    <FlatList
      style={styles.bottomList}
      data={data}
      keyExtractor={keyExtractorId}
      renderItem={renderRow}
      showsVerticalScrollIndicator={false}
    />
  );

  const renderSteps = () => (
    <ScrollView style={{ flex: 1 }}>
      {renderList(steps)}
      {renderCompletedStepsButton()}
      {hideCompleted ? null : renderCompletedList(completedSteps)}
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
    <SafeAreaView style={{ flex: 1 }}>
      {steps.length > 0 || !hideCompleted ? renderSteps() : renderNull()}
      <BottomButton onPress={handleCreateStep} text={t('addStep')} />
    </SafeAreaView>
  );
};

const mapStateToProps = (
  { auth, steps }: { auth: AuthState; steps: StepsState },
  {
    person,
    organization = { id: 'personal' },
  }: { person: Person; organization: Organization },
) => {
  const allSteps = steps.contactSteps[`${person.id}-${organization.id}`] || {};
  const myId = auth.person.id;
  return {
    showAssignPrompt: orgIsCru(organization),
    myId,
    steps: allSteps.steps || [],
    completedSteps: allSteps.completedSteps || [],
    contactAssignment: contactAssignmentSelector(
      { auth },
      { person, orgId: organization.id },
    ),
    isMe: person.id === myId,
  };
};

export default connect(mapStateToProps)(ContactSteps);
