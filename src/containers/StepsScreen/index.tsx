/* eslint max-lines: 0 */

import React, { useState, useEffect } from 'react';
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
import debounce from 'lodash/debounce';

import { loadHome } from '../../actions/auth/userData';
import {
  showReminderScreen,
  showWelcomeNotification,
} from '../../actions/notifications';
import {
  getMySteps,
  setStepFocus,
  getMyStepsNextPage,
} from '../../actions/steps';
import { navigatePush } from '../../actions/navigation';
import {
  reminderStepsSelector,
  nonReminderStepsSelector,
} from '../../selectors/steps';
import {
  Flex,
  Text,
  Icon,
  IconButton,
  RefreshControl,
  LoadingGuy,
} from '../../components/common';
import StepItem from '../../components/StepItem';
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

const MAX_REMINDERS = 3;

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

export const StepsScreen = ({
  reminders,
  steps,
  hasMoreSteps,
  dispatch,
}: {
  reminders: [] | null;
  steps: [] | null;
  hasMoreSteps: boolean;
  dispatch: ThunkDispatch<any, any, any>; // TODO: replace any
}) => {
  const [state, setState] = useState({
    overscrollUp: false,
    paging: false,
  });

  useEffect(() => {
    dispatch(loadHome());
  }, []);

  const getSteps = () => dispatch(getMySteps());

  const handleRowSelect = step => {
    dispatch(navigatePush(ACCEPTED_STEP_DETAIL_SCREEN, { step }));
  };

  const hasReminders = reminders && reminders.length > 0;

  const hasMaxReminders = reminders && reminders.length >= MAX_REMINDERS;

  const hasFewSteps = steps && steps.length <= MAX_REMINDERS;

  const canHideStars =
    (!hasReminders && hasFewSteps) || (hasReminders && hasMaxReminders);

  const { t } = useTranslation('stepsTab');

  const handleSetReminder = step => {
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

  const handleRemoveReminder = step => {
    dispatch(trackActionWithoutData(ACTIONS.STEP_DEPRIORITIZED));
    dispatch(setStepFocus(step, false));
  };

  const { isRefreshing, refresh } = useRefreshing(getSteps);

  const handleScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const position = nativeEvent.contentOffset.y;
    const overscrollUp = state.overscrollUp;
    if (position < 0 && !overscrollUp) {
      setState(state => ({ ...state, overscrollUp: true }));
    } else if (position >= 0 && overscrollUp) {
      setState(state => ({ ...state, overscrollUp: false }));
    }

    if (isCloseToBottom(nativeEvent)) {
      handleNextPage();
    }
  };

  const handleBackgroundColor = () => {
    if (state.overscrollUp) {
      return styles.backgroundTop;
    }

    return styles.backgroundBottom;
  };

  const handleNextPage = debounce(() => {
    if (state.paging || !hasMoreSteps) {
      return;
    }

    setState(state => ({ ...state, paging: true }));
    dispatch(getMyStepsNextPage())
      .then(() => {
        // Put a slight delay on stopping the paging so that the new items can populate in the list
        setTimeout(() => setState(state => ({ ...state, paging: false })), 500);
      })
      .catch(() => {
        setTimeout(() => setState(state => ({ ...state, paging: false })), 500);
      });
  }, 250);

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

  const renderItem = ({ item }) => {
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
        style={[styles.list, { paddingBottom: hasMoreSteps ? 40 : undefined }]}
        data={steps}
        extraData={{ hideStars: canHideStars }}
        keyExtractor={keyExtractorId}
        renderItem={renderItem}
        removeClippedSubviews={false}
        bounces={false}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        ListFooterComponent={state.paging ? <FooterLoading /> : null}
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
      {steps ? renderSteps() : <LoadingGuy />}
    </View>
  );
};

export const mapStateToProps = ({ steps, people }) => ({
  steps: nonReminderStepsSelector({ steps, people }),
  reminders: reminderStepsSelector({ steps, people }),
  hasMoreSteps: steps.pagination.hasNextPage,
});

export default connect(mapStateToProps)(StepsScreen);
