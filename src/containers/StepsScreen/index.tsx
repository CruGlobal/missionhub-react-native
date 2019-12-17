import React, { useState } from 'react';
import {
  View,
  Image,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { useTranslation } from 'react-i18next';

import { getMySteps, getMyStepsNextPage } from '../../actions/steps';
import { checkForUnreadComments } from '../../actions/unreadComments';
import { navigatePush, navigateToMainTabs } from '../../actions/navigation';
import { navToPersonScreen } from '../../actions/person';
import { myStepsSelector } from '../../selectors/steps';
import { Text, IconButton, LoadingGuy } from '../../components/common';
import StepItem from '../../components/StepItem';
import FooterLoading from '../../components/FooterLoading';
import Header from '../../components/Header';
import NULL from '../../../assets/images/footprints.png';
import { openMainMenu, keyExtractorId } from '../../utils/common';
import { useRefreshing } from '../../utils/hooks/useRefreshing';
import { STEPS_TAB, PEOPLE_TAB } from '../../constants';
import BottomButton from '../../components/BottomButton';
import { ACCEPTED_STEP_DETAIL_SCREEN } from '../AcceptedStepDetailScreen';
import TrackTabChange from '../TrackTabChange';
import OnboardingCard, {
  GROUP_ONBOARDING_TYPES,
} from '../Groups/OnboardingCard';
import { Step, StepsState } from '../../reducers/steps';
import { useTrackScreenChange } from '../../utils/hooks/useTrackScreenChange';

import styles from './styles';

interface StepsScreenProps {
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
  steps: Step[] | null;
  hasMoreSteps: boolean;
}

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

const StepsScreen = ({ dispatch, steps, hasMoreSteps }: StepsScreenProps) => {
  useTrackScreenChange(['steps']);
  const { t } = useTranslation('stepsTab');

  const [paging, setPaging] = useState(false);
  const [pagingError, setPagingError] = useState(false);

  const firstTimeLoading = !steps;
  const hasSteps = steps && steps.length > 0;

  const handleOpenMainMenu = () => dispatch(openMainMenu());

  const getSteps = () => dispatch(getMySteps());

  const handleRefresh = () => {
    dispatch(checkForUnreadComments());
    getSteps();
  };

  const { isRefreshing, refresh } = useRefreshing(handleRefresh);

  const handleRowSelect = (step: Step) =>
    dispatch(navigatePush(ACCEPTED_STEP_DETAIL_SCREEN, { step }));

  const handleNavToPerson = (step: Step) => {
    const { receiver, organization } = step;
    dispatch(navToPersonScreen(receiver, organization));
  };

  const handleNavToPeopleTab = () => {
    dispatch(navigateToMainTabs(PEOPLE_TAB));
  };

  const handleNextPage = async () => {
    if (paging || !hasMoreSteps || pagingError) {
      return;
    }

    setPaging(true);

    try {
      await dispatch(getMyStepsNextPage());
    } catch (e) {
      setPagingError(true);
    } finally {
      setPaging(false);
    }
  };

  const handleScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const shouldPaginate = isCloseToBottom(nativeEvent);

    // Reset pagingError once we are out of the isCloseToBottom zone
    if (!shouldPaginate) {
      if (pagingError) {
        setPagingError(false);
      }
      return;
    }

    handleNextPage();
  };

  const renderNull = () => (
    <View style={styles.nullWrap}>
      <Image source={NULL} />
      <Text header={true} style={styles.nullHeader}>
        {t('nullHeader')}
      </Text>
      <Text style={styles.nullText}>{t('nullNoReminders.part1')}</Text>
      <Text style={styles.nullText}>{t('nullNoReminders.part2')}</Text>
      <BottomButton
        text={t('mainTabs:takeAStepWithSomeone')}
        onPress={handleNavToPeopleTab}
      />
    </View>
  );

  const renderItem = ({ item }: { item: Step }) => (
    <StepItem
      testID={`stepItem${item.id}`}
      step={item}
      onSelect={handleRowSelect}
      onPressName={handleNavToPerson}
    />
  );

  const renderSteps = () => (
    <FlatList
      testID="stepsList"
      refreshing={isRefreshing}
      onRefresh={refresh}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      contentContainerStyle={[
        styles.list,
        hasMoreSteps ? styles.listExtraPadding : {},
      ]}
      data={steps}
      keyExtractor={keyExtractorId}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      initialNumToRender={10}
      ListFooterComponent={paging ? <FooterLoading /> : null}
    />
  );

  return (
    <View style={styles.container}>
      <Header
        testID="header"
        left={
          <IconButton
            testID="menuIcon"
            name="menuIcon"
            type="MissionHub"
            onPress={handleOpenMainMenu}
          />
        }
        title={t('title').toUpperCase()}
      />
      <View style={styles.contentContainer}>
        {hasSteps ? (
          <OnboardingCard type={GROUP_ONBOARDING_TYPES.steps} />
        ) : null}
        {firstTimeLoading ? (
          <LoadingGuy />
        ) : hasSteps ? (
          renderSteps()
        ) : (
          renderNull()
        )}
      </View>
    </View>
  );
};

export const mapStateToProps = ({ steps }: { steps: StepsState }) => ({
  steps: myStepsSelector({ steps }),
  hasMoreSteps: steps.pagination.hasNextPage,
});

export default connect(mapStateToProps)(StepsScreen);
