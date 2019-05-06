/* eslint max-lines: 0 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  ScrollView,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { loadHome } from '../../actions/auth/userData';
import {
  showReminderScreen,
  showWelcomeNotification,
} from '../../actions/notifications';
import { setStepFocus } from '../../actions/steps';
import { navigatePush } from '../../actions/navigation';
import {
  Flex,
  Text,
  Icon,
  IconButton,
  RefreshControl,
  LoadingGuy,
} from '../../components/common';
import StepItem, { STEP_ITEM_QUERY } from '../../components/StepItem';
import FooterLoading from '../../components/FooterLoading';
import Header from '../../components/Header';
import footprintsImage from '../../../assets/images/footprints.png';
import { openMainMenu, toast, keyExtractorId } from '../../utils/common';
import { trackActionWithoutData } from '../../actions/analytics';
import { ACTIONS, STEPS_TAB } from '../../constants';
import TakeAStepWithSomeoneButton from '../TakeAStepWithSomeoneButton';
import { ACCEPTED_STEP_DETAIL_SCREEN } from '../AcceptedStepDetailScreen';
import TrackTabChange from '../TrackTabChange';

import styles from './styles';
import { ThunkDispatch } from 'redux-thunk';
import { useRefreshing } from '../../utils/hooks/useRefreshing';
import { useQuery } from 'react-apollo-hooks';
import { gql } from 'apollo-boost';
import {
  StepsList,
  StepsList_acceptedChallenges_nodes,
} from './__generated__/StepsList';
import { ErrorNotice } from '../../components/ErrorNotice';

const MAX_REMINDERS = 3;

const STEPS_QUERY = gql`
  query StepsList($after: String) {
    acceptedChallenges(after: $after, completed: false, first: 5) {
      nodes {
        id
        focus
        ...StepItem
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
  ${STEP_ITEM_QUERY}
`;

function isCloseToBottom({
  layoutMeasurement,
  contentOffset,
  contentSize,
}: NativeScrollEvent) {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
}

type Step = StepsList_acceptedChallenges_nodes;

export const StepsScreen = ({
  dispatch,
}: {
  dispatch: ThunkDispatch<any, any, any>; // TODO: replace any
}) => {
  const [state, setState] = useState({
    overscrollUp: false,
    paging: false,
    pagingError: false,
  });

  useEffect(() => {
    dispatch(loadHome());
  }, []);

  const {
    data: {
      acceptedChallenges: {
        nodes = [],
        pageInfo: { hasNextPage = false, endCursor = null } = {},
      } = {},
    } = {},
    error,
    loading,
    fetchMore,
    refetch,
  } = useQuery<StepsList>(STEPS_QUERY);

  useEffect(() => {
    refetch(); // Refetch on mount?
  }, []);

  const { steps, reminders } = (nodes || []).reduce(
    ({ steps, reminders }, challenge) => ({
      steps: [
        ...steps,
        ...(challenge ? (challenge.focus ? [] : [challenge]) : []),
      ],
      reminders: [
        ...reminders,
        ...(challenge && challenge.focus ? [challenge] : []),
      ],
    }),
    { steps: [] as Step[], reminders: [] as Step[] },
  );

  const handleRowSelect = (step: Step) => {
    dispatch(navigatePush(ACCEPTED_STEP_DETAIL_SCREEN, { step }));
  };

  const hasReminders = reminders && reminders.length > 0;

  const hasMaxReminders = reminders && reminders.length >= MAX_REMINDERS;

  const hasFewSteps = steps && steps.length <= MAX_REMINDERS;

  const canHideStars =
    (!hasReminders && hasFewSteps) || (hasReminders && hasMaxReminders);

  const { t } = useTranslation('stepsTab');

  const handleSetReminder = (step: Step) => {
    dispatch(trackActionWithoutData(ACTIONS.STEP_PRIORITIZED));

    if (hasMaxReminders) {
      return;
    }

    toast(t('reminderAddedToast'));

    if (!hasReminders) {
      dispatch(showReminderScreen(t('notificationPrimer:focusDescription')));
    }
    dispatch(setStepFocus(step, true));

    dispatch(showWelcomeNotification());
  };

  const handleRemoveReminder = (step: Step) => {
    dispatch(trackActionWithoutData(ACTIONS.STEP_DEPRIORITIZED));
    dispatch(setStepFocus(step, false));
  };

  const { isRefreshing, refresh } = useRefreshing(refetch);

  const handleScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const position = nativeEvent.contentOffset.y;
    const overscrollUp = state.overscrollUp;
    const shouldPaginate = isCloseToBottom(nativeEvent);

    if (position < 0 !== overscrollUp) {
      setState(state => ({
        ...state,
        overscrollUp: position < 0,
      }));
    }

    // Reset pagingError once we are out of the isCloseToBottom zone
    if (state.pagingError && !shouldPaginate) {
      setState(state => ({
        ...state,
        pagingError: false,
      }));
    }

    if (shouldPaginate) {
      handleNextPage();
    }
  };

  const handleBackgroundColor = () => {
    if (state.overscrollUp) {
      return styles.backgroundTop;
    }

    return styles.backgroundBottom;
  };

  const handleNextPage = async () => {
    if (state.paging || !hasNextPage || state.pagingError) {
      return;
    }

    setState(state => ({ ...state, paging: true }));
    try {
      await fetchMore({
        variables: { after: endCursor },
        updateQuery: (prev, { fetchMoreResult }) =>
          fetchMoreResult
            ? {
                ...prev,
                ...fetchMoreResult,
                acceptedChallenges: {
                  ...prev.acceptedChallenges,
                  ...fetchMoreResult.acceptedChallenges,
                  nodes: [
                    ...prev.acceptedChallenges.nodes,
                    ...fetchMoreResult.acceptedChallenges.nodes,
                  ],
                },
              }
            : prev,
      });
      setState(state => ({ ...state, paging: false }));
    } catch (e) {
      setState(state => ({ ...state, paging: false, pagingError: true }));
    }
  };

  const renderFocusPrompt = () => {
    if (hasReminders || hasFewSteps) {
      return null;
    }

    return (
      <Flex
        align="center"
        justify="center"
        style={[styles.top, styles.topEmpty]}
      >
        <Icon name="starGroupIcon" type="MissionHub" size={45} />
        <Text type="header" style={styles.title}>
          {t('reminderTitle').toUpperCase()}
        </Text>
        <Text style={styles.description}>{t('reminderDescription')}</Text>
      </Flex>
    );
  };

  const renderReminders = () => {
    const focusedSteps = reminders.filter(r => r && r.id);

    if (hasReminders) {
      return (
        <Flex align="center" style={[styles.top]}>
          {focusedSteps.map(s => (
            <StepItem
              step={s}
              key={s.id}
              type="reminder"
              onSelect={handleRowSelect}
              onAction={handleRemoveReminder}
            />
          ))}
        </Flex>
      );
    }
  };

  const renderItem = ({ item }: { item: Step }) => {
    return (
      <StepItem
        step={item}
        type="swipeable"
        hideAction={canHideStars}
        onSelect={handleRowSelect}
        onAction={handleSetReminder}
      />
    );
  };

  const renderList = () => {
    if (steps.length === 0) {
      return (
        <Flex value={1} align="center" justify="center">
          <Image source={footprintsImage} />
          <Text type="header" style={styles.nullHeader}>
            {t('nullHeader')}
          </Text>
          <Text style={styles.nullText}>
            {hasReminders ? t('nullWithReminders') : t('nullNoReminders')}
          </Text>
        </Flex>
      );
    }

    return (
      <FlatList
        style={[
          styles.list,
          { paddingBottom: hasNextPage && !state.pagingError ? 40 : undefined },
        ]}
        data={steps}
        extraData={{ hideStars: canHideStars }}
        keyExtractor={keyExtractorId}
        renderItem={renderItem}
        removeClippedSubviews={false}
        bounces={false}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        ListFooterComponent={
          state.pagingError ? (
            <ErrorNotice message={t('errorLoadingSteps')} />
          ) : state.paging ? (
            <FooterLoading />
          ) : null
        }
      />
    );
  };

  const renderSteps = () => {
    return (
      <View style={{ flex: 1 }}>
        {renderFocusPrompt()}
        <ScrollView
          style={[styles.container, handleBackgroundColor()]}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
          }
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={[
            styles.contentContainer,
            {
              // Flex the white background to the bottom when there's only a few steps
              // Don't do it all the time because it causes the top to be static
              flex: steps.length < 5 ? 1 : undefined,
            },
          ]}
        >
          {renderReminders()}
          {error && <ErrorNotice message={t('errorLoadingSteps')} />}
          {renderList()}
        </ScrollView>
        {steps.length > 0 || reminders.length > 0 ? null : (
          <TakeAStepWithSomeoneButton />
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <TrackTabChange screen={STEPS_TAB} />
      <Header
        left={
          <IconButton
            name="menuIcon"
            type="MissionHub"
            onPress={() => dispatch(openMainMenu())}
          />
        }
        title={t('title').toUpperCase()}
      />
      {loading ? <LoadingGuy /> : renderSteps()}
    </View>
  );
};

export default connect()(StepsScreen);
