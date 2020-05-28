import React, { useState } from 'react';
import { View, SectionList, SectionListData } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { FetchMoreOptions } from 'apollo-client';

import { Button, RefreshControl, Text } from '../../components/common';
import BottomButton from '../../components/BottomButton';
import NULL from '../../../assets/images/footprints.png';
import { ANALYTICS_ASSIGNMENT_TYPE } from '../../constants';
import { keyExtractorId } from '../../utils/common';
import { getAnalyticsAssignmentType } from '../../utils/analytics';
import { promptToAssign } from '../../utils/prompt';
import { contactAssignmentSelector } from '../../selectors/people';
import {
  assignContactAndPickStage,
  navigateToStageScreen,
  navigateToAddStepFlow,
} from '../../actions/misc';
import NullStateComponent from '../../components/NullStateComponent';
import { AuthState } from '../../reducers/auth';
import { Person } from '../../reducers/people';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import StepItem from '../../components/StepItem';
import { useIsMe } from '../../utils/hooks/useIsMe';
import { ErrorNotice } from '../../components/ErrorNotice/ErrorNotice';

import styles from './styles';
import { PERSON_STEPS_QUERY } from './queries';
import {
  PersonStepsList,
  PersonStepsListVariables,
  PersonStepsList_person_steps_nodes,
} from './__generated__/PersonStepsList';

interface ContactStepsProps {
  person: Person;
}

const ContactSteps = ({ person }: ContactStepsProps) => {
  const analyticsAssignmentType = useSelector(({ auth }: { auth: AuthState }) =>
    getAnalyticsAssignmentType(person, auth),
  );
  useAnalytics(['person', 'my steps'], {
    screenContext: { [ANALYTICS_ASSIGNMENT_TYPE]: analyticsAssignmentType },
  });
  const { t } = useTranslation('contactSteps');
  const [hideCompleted, setHideCompleted] = useState(true);
  const dispatch = useDispatch();
  const isMe = useIsMe(person.id);
  const showAssignPrompt = false;
  const contactAssignment = useSelector(({ auth }: { auth: AuthState }) =>
    contactAssignmentSelector({ auth }, { person }),
  );

  const { data, loading, error, fetchMore, refetch } = useQuery<
    PersonStepsList,
    PersonStepsListVariables
  >(PERSON_STEPS_QUERY, {
    variables: { personId: person.id, completed: false },
  });

  const steps = data?.person.steps.nodes ?? [];
  const hasCompletedSteps = !!data?.person.completedSteps.pageInfo.totalCount;
  const hasNextPage = data?.person.steps.pageInfo.hasNextPage;
  const endCursor = data?.person.steps.pageInfo.endCursor;

  const [
    loadCompletedSteps,
    {
      data: dataCompleted,
      loading: loadingCompleted,
      error: errorCompleted,
      fetchMore: fetchMoreCompleted,
      refetch: refetchCompleted,
    },
  ] = useLazyQuery<PersonStepsList, PersonStepsListVariables>(
    PERSON_STEPS_QUERY,
    { variables: { personId: person.id, completed: true } },
  );

  const stepsCompleted = dataCompleted?.person.steps.nodes ?? [];
  const hasNextPageCompleted = dataCompleted?.person.steps.pageInfo.hasNextPage;
  const endCursorCompleted = dataCompleted?.person.steps.pageInfo.endCursor;

  const updateQuery: FetchMoreOptions<
    PersonStepsList,
    PersonStepsListVariables
  >['updateQuery'] = (prev, { fetchMoreResult }) =>
    fetchMoreResult
      ? {
          ...prev,
          ...fetchMoreResult,
          person: {
            ...prev.person,
            ...fetchMoreResult.person,
            steps: {
              ...prev.person.steps,
              ...fetchMoreResult.person.steps,
              nodes: [
                ...prev.person.steps.nodes,
                ...fetchMoreResult.person.steps.nodes,
              ],
            },
          },
        }
      : prev;

  const handleOnEndReached = () => {
    if (loading || loadingCompleted) {
      return;
    }

    if (hasNextPage) {
      fetchMore({
        variables: { after: endCursor },
        updateQuery,
      });
    } else if (hasNextPageCompleted) {
      fetchMoreCompleted({
        variables: { after: endCursorCompleted },
        updateQuery,
      });
    }
  };

  const handleAssign = async () => {
    if (showAssignPrompt) {
      if (!(await promptToAssign())) {
        return;
      }
    }

    dispatch(assignContactAndPickStage(person, undefined));
  };

  const handleCreateStep = () => {
    (contactAssignment && contactAssignment.pathway_stage_id) || isMe
      ? dispatch(navigateToAddStepFlow(isMe, person, undefined))
      : contactAssignment
      ? dispatch(
          navigateToStageScreen(
            false,
            person,
            contactAssignment,
            undefined,
            undefined,
          ),
        )
      : handleAssign();
  };

  const toggleCompletedSteps = () => {
    // If they are currently hidden, load them
    hideCompleted && loadCompletedSteps();
    setHideCompleted(!hideCompleted);
  };

  const stepListSections = [
    {
      key: 'active',
      data: steps,
    },
    ...(hideCompleted ? [] : [{ key: 'completed', data: stepsCompleted }]),
  ];

  const renderItem = ({
    item,
  }: {
    item: PersonStepsList_person_steps_nodes;
  }) => <StepItem testID="stepItem" step={item} showName={false} />;

  const renderCompletedStepsButton = () =>
    hasCompletedSteps ? (
      <View style={styles.completedStepsButtonWrap}>
        <Button
          testID="completedStepsButton"
          pill={true}
          onPress={toggleCompletedSteps}
          style={styles.completedStepsButton}
        >
          <Text style={styles.completedStepsButtonText} numberOfLines={1}>
            {t(
              hideCompleted ? 'showCompletedSteps' : 'hideCompletedSteps',
            ).toUpperCase()}
          </Text>
        </Button>
      </View>
    ) : null;

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
      onEndReachedThreshold={0.2}
      onEndReached={handleOnEndReached}
      renderSectionFooter={renderSectionFooter}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refetch} />
      }
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
      <ErrorNotice
        message={t('errorLoadingStepsForThisPerson')}
        error={error}
        refetch={refetch}
      />
      <ErrorNotice
        message={t('errorLoadingCompletedStepsForThisPerson')}
        error={errorCompleted}
        refetch={refetchCompleted}
      />
      {steps.length > 0 || !hideCompleted ? renderSteps() : renderNull()}
      <BottomButton onPress={handleCreateStep} text={t('addStep')} />
    </View>
  );
};

export default ContactSteps;
