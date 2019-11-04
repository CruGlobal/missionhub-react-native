import React, { useState } from 'react';
import {
  View,
  Image,
  ScrollView,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { useTranslation } from 'react-i18next';

import { getMySteps, getMyStepsNextPage } from '../../actions/steps';
import { checkForUnreadComments } from '../../actions/unreadComments';
import { navigatePush, navigateToMainTabs } from '../../actions/navigation';
import { navToPersonScreen } from '../../actions/person';
import { myStepsSelector } from '../../selectors/steps';
import {
  Text,
  IconButton,
  RefreshControl,
  LoadingGuy,
} from '../../components/common';
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
} from '../../containers/Groups/OnboardingCard';
import { Step, StepsState } from '../../reducers/steps';

import styles from './styles';

interface StepsScreenProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, null, never>;
  steps: Step[];
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

export const StepsScreen = ({
  dispatch,
  steps,
  hasMoreSteps,
}: StepsScreenProps) => {
  const { t } = useTranslation('stepsTab');

  const [paging, setPaging] = useState(false);
  const [pagingError, setPagingError] = useState(false);

  const firstTimeLoading = !steps;

  const handleOpenMainMenu = () => dispatch(openMainMenu());

  const getSteps = () => dispatch(getMySteps());

  const handleRowSelect = (step: Step) =>
    dispatch(navigatePush(ACCEPTED_STEP_DETAIL_SCREEN, { step }));

  const navToPeopleTab = () => dispatch(navigateToMainTabs(PEOPLE_TAB));

  const handleNavToPerson = (step: Step) => {
    const { receiver, organization } = step;
    dispatch(navToPersonScreen(receiver, organization));
  };

  const handleRefresh = () => {
    dispatch(checkForUnreadComments());
    getSteps();
  };

  const { isRefreshing, refresh } = useRefreshing(handleRefresh);

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
    if (pagingError && !shouldPaginate) {
      return setPagingError(false);
    }

    handleNextPage();
  };

  const renderNull = () => (
    <View style={styles.nullWrap}>
      <Image source={NULL} />
      <Text header={true} style={styles.nullHeader}>
        {t('nullHeader')}
      </Text>
      <Text style={styles.nullText}>{t('nullNoReminders')}</Text>
    </View>
  );

  const renderItem = ({ item }: { item: Step }) => (
    <StepItem
      step={item}
      onSelect={handleRowSelect}
      onPressName={handleNavToPerson}
    />
  );

  const renderSteps = () => (
    <FlatList
      style={[styles.list, { paddingBottom: hasMoreSteps ? 40 : undefined }]}
      data={steps}
      keyExtractor={keyExtractorId}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      initialNumToRender={10}
      ListFooterComponent={paging ? <FooterLoading /> : null}
    />
  );

  const renderContent = () => (
    <View style={{ flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
        }
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.contentContainer}
      >
        {steps.length > 0 ? renderSteps() : renderNull()}
      </ScrollView>
      {steps.length > 0 ? null : (
        <BottomButton
          text={t('mainTabs:takeAStepWithSomeone')}
          onPress={navToPeopleTab}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <TrackTabChange screen={STEPS_TAB} />
      <Header
        left={
          <IconButton
            name="menuIcon"
            type="MissionHub"
            onPress={handleOpenMainMenu}
          />
        }
        title={t('title').toUpperCase()}
      />
      <View style={styles.contentContainer}>
        {firstTimeLoading ? (
          <LoadingGuy />
        ) : (
          <>
            <OnboardingCard type={GROUP_ONBOARDING_TYPES.steps} />
            {renderContent()}
          </>
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
