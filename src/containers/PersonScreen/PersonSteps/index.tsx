import React, { useState, useContext } from 'react';
import { View, Animated, SectionListData } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { FetchMoreOptions } from 'apollo-client';
import { useNavigationParam } from 'react-navigation-hooks';

import { Button, RefreshControl, Text } from '../../../components/common';
import BottomButton from '../../../components/BottomButton';
import NULL from '../../../../assets/images/footprints.png';
import { keyExtractorId } from '../../../utils/common';
import {
  contactAssignmentSelector,
  personSelector,
} from '../../../selectors/people';
import {
  navigateToStageScreen,
  navigateToAddStepFlow,
} from '../../../actions/misc';
import NullStateComponent from '../../../components/NullStateComponent';
import { AuthState } from '../../../reducers/auth';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import StepItem from '../../../components/StepItem';
import { useIsMe } from '../../../utils/hooks/useIsMe';
import { ErrorNotice } from '../../../components/ErrorNotice/ErrorNotice';
import { CollapsibleViewContext } from '../../../components/CollapsibleView/CollapsibleView';
import { RootState } from '../../../reducers';

import styles from './styles';
import { PERSON_STEPS_QUERY } from './queries';
import {
  PersonStepsList,
  PersonStepsListVariables,
  PersonStepsList_person_steps_nodes,
} from './__generated__/PersonStepsList';

interface PersonStepsProps {
  collapsibleHeaderContext: CollapsibleViewContext;
}

export const PersonSteps = ({ collapsibleHeaderContext }: PersonStepsProps) => {
  const personId: string = useNavigationParam('personId');

  const person = useSelector(
    ({ people }: RootState) =>
      personSelector({ people }, { personId }) || {
        id: personId,
      },
  );

  useAnalytics(['person', 'my steps'], {
    assignmentType: { personId },
  });
  const { t } = useTranslation('contactSteps');
  const [hideCompleted, setHideCompleted] = useState(true);
  const dispatch = useDispatch();
  const isMe = useIsMe(personId);
  const contactAssignment = useSelector(({ auth }: { auth: AuthState }) =>
    contactAssignmentSelector({ auth }, { person }),
  );

  const { data, loading, error, fetchMore, refetch } = useQuery<
    PersonStepsList,
    PersonStepsListVariables
  >(PERSON_STEPS_QUERY, {
    variables: { personId, completed: false },
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
    { variables: { personId, completed: true } },
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

  const handleCreateStep = () => {
    (contactAssignment && contactAssignment.pathway_stage_id) || isMe
      ? dispatch(navigateToAddStepFlow(person.id))
      : dispatch(navigateToStageScreen(person.id));
  };

  const toggleCompletedSteps = () => {
    // If they are currently hidden, load them
    hideCompleted && loadCompletedSteps();
    setHideCompleted(!hideCompleted);
  };

  const stepListSections = [
    ...(steps.length > 0
      ? [
          {
            key: 'active',
            data: steps,
          },
        ]
      : []),
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
    section: SectionListData<PersonStepsList_person_steps_nodes>;
  }) => (key === 'active' ? renderCompletedStepsButton() : null);

  const { collapsibleScrollViewProps } = useContext(collapsibleHeaderContext);

  return (
    <View style={styles.container}>
      <Animated.SectionList
        {...collapsibleScrollViewProps}
        style={styles.list}
        contentInset={{ bottom: 90 }}
        sections={stepListSections}
        keyExtractor={keyExtractorId}
        renderItem={renderItem}
        onEndReachedThreshold={0.2}
        onEndReached={handleOnEndReached}
        renderSectionFooter={renderSectionFooter}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <NullStateComponent
            imageSource={NULL}
            headerText={t('header').toUpperCase()}
            descriptionText={
              isMe
                ? t('stepSelfNull')
                : t('stepNull', { name: person.first_name })
            }
            content={renderCompletedStepsButton()}
            style={{ backgroundColor: undefined }}
          />
        }
        ListHeaderComponent={
          <>
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
          </>
        }
      />
      <BottomButton onPress={handleCreateStep} text={t('addStep')} />
    </View>
  );
};

export const PERSON_STEPS = 'nav/PERSON_STEPS';
