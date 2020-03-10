import React, { useCallback } from 'react';
import { View, Image, FlatList } from 'react-native';
import { AnyAction } from 'redux';
import { connect } from 'react-redux-legacy';
import { ThunkDispatch } from 'redux-thunk';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/react-hooks';
import { useFocusEffect } from 'react-navigation-hooks';

import { checkForUnreadComments } from '../../actions/unreadComments';
import { navigatePush, navigateToMainTabs } from '../../actions/navigation';
import { navToPersonScreen } from '../../actions/person';
import { Text, IconButton, LoadingGuy } from '../../components/common';
import StepItem from '../../components/StepItem';
import FooterLoading from '../../components/FooterLoading';
import Header from '../../components/Header';
import NULL from '../../../assets/images/footprints.png';
import { openMainMenu, keyExtractorId } from '../../utils/common';
import { useRefreshing } from '../../utils/hooks/useRefreshing';
import { PEOPLE_TAB } from '../../constants';
import BottomButton from '../../components/BottomButton';
import { ACCEPTED_STEP_DETAIL_SCREEN } from '../AcceptedStepDetailScreen';
import OnboardingCard, {
  GROUP_ONBOARDING_TYPES,
} from '../Groups/OnboardingCard';
import { ErrorNotice } from '../../components/ErrorNotice/ErrorNotice';
import {
  useAnalytics,
  ANALYTICS_SCREEN_TYPES,
} from '../../utils/hooks/useAnalytics';

import styles from './styles';
import {
  StepsList,
  StepsList_steps_nodes as Step,
} from './__generated__/StepsList';
import { STEPS_QUERY } from './queries';

interface StepsScreenProps {
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
}

const StepsScreen = ({ dispatch }: StepsScreenProps) => {
  const { t } = useTranslation('stepsTab');
  useAnalytics('steps', ANALYTICS_SCREEN_TYPES.screenWithDrawer);
  useFocusEffect(useCallback(() => checkForUnreadComments(), []));

  const {
    data: {
      steps: {
        nodes: steps = [],
        pageInfo: { hasNextPage = false, endCursor = null } = {},
      } = {},
    } = {},
    error,
    loading,
    fetchMore,
    refetch,
  } = useQuery<StepsList>(STEPS_QUERY);

  const hasSteps = steps && steps.length > 0;

  const handleRefresh = () => {
    checkForUnreadComments();
    refetch();
  };

  const { isRefreshing, refresh } = useRefreshing(handleRefresh);

  const handleRowSelect = (step: Step) =>
    dispatch(navigatePush(ACCEPTED_STEP_DETAIL_SCREEN, { stepId: step.id }));

  const handleNavToPerson = (step: Step) => {
    const { receiver, community } = step;
    dispatch(navToPersonScreen(receiver, community));
  };

  const handleNavToPeopleTab = () => {
    dispatch(navigateToMainTabs(PEOPLE_TAB));
  };

  const handleNextPage = async () => {
    if (loading || !hasNextPage) {
      return;
    }

    await fetchMore({
      variables: { after: endCursor },
      updateQuery: (prev, { fetchMoreResult }) =>
        fetchMoreResult
          ? {
              ...prev,
              ...fetchMoreResult,
              steps: {
                ...prev.steps,
                ...fetchMoreResult.steps,
                nodes: [
                  ...(prev.steps.nodes || []),
                  ...(fetchMoreResult.steps.nodes || []),
                ],
              },
            }
          : prev,
    });
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
      testID="stepItem"
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
      onEndReached={handleNextPage}
      onEndReachedThreshold={0.25}
      contentContainerStyle={styles.list}
      data={steps}
      keyExtractor={keyExtractorId}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      initialNumToRender={10}
      ListFooterComponent={loading ? <FooterLoading /> : null}
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
            onPress={() => dispatch(openMainMenu())}
          />
        }
        title={t('title').toUpperCase()}
      />
      <ErrorNotice
        error={error}
        refetch={refetch}
        message={t('errorLoadingSteps')}
      />
      <View style={styles.contentContainer}>
        {hasSteps ? (
          // @ts-ignore
          <OnboardingCard type={GROUP_ONBOARDING_TYPES.steps} />
        ) : null}
        {hasSteps ? renderSteps() : loading ? <LoadingGuy /> : renderNull()}
      </View>
    </View>
  );
};

export default connect()(StepsScreen);
