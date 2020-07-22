import React from 'react';
import { View, Image, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/react-hooks';
import { useDispatch } from 'react-redux';

import { navigateToMainTabs } from '../../actions/navigation';
import { Text, LoadingGuy, Button } from '../../components/common';
import StepItem from '../../components/StepItem';
import { FooterLoading } from '../../components/FooterLoading';
import Header from '../../components/Header';
import NULL from '../../../assets/images/footprints.png';
import { openMainMenu, keyExtractorId } from '../../utils/common';
import { useRefreshing } from '../../utils/hooks/useRefreshing';
import { PEOPLE_TAB } from '../../constants';
import BottomButton from '../../components/BottomButton';
import OnboardingCard, {
  GROUP_ONBOARDING_TYPES,
} from '../Groups/OnboardingCard';
import { ErrorNotice } from '../../components/ErrorNotice/ErrorNotice';
import {
  useAnalytics,
  ANALYTICS_SCREEN_TYPES,
} from '../../utils/hooks/useAnalytics';
import Avatar from '../../components/Avatar';
import { GET_MY_AVATAR_AND_EMAIL } from '../../components/SideMenu/queries';
import { GetMyAvatarAndEmail } from '../../components/SideMenu/__generated__/GetMyAvatarAndEmail';

import styles from './styles';
import {
  StepsList,
  StepsList_steps_nodes as Step,
} from './__generated__/StepsList';
import { STEPS_QUERY } from './queries';

const StepsScreen = () => {
  const { t } = useTranslation('stepsTab');
  const dispatch = useDispatch();
  useAnalytics('steps', {
    screenType: ANALYTICS_SCREEN_TYPES.screenWithDrawer,
  });

  const { data: { currentUser } = {} } = useQuery<GetMyAvatarAndEmail>(
    GET_MY_AVATAR_AND_EMAIL,
    { fetchPolicy: 'cache-first' },
  );

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
    refetch();
  };

  const { isRefreshing, refresh } = useRefreshing(handleRefresh);

  const handleNavToPeopleTab = () => {
    dispatch(navigateToMainTabs(PEOPLE_TAB));
  };

  const handleNextPage = () => {
    if (loading || !hasNextPage) {
      return;
    }

    fetchMore({
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
    <StepItem testID="stepItem" step={item} showCheckbox={false} />
  );

  const renderSteps = () => (
    <FlatList
      testID="stepsList"
      refreshing={isRefreshing}
      onRefresh={refresh}
      onEndReached={handleNextPage}
      onEndReachedThreshold={0.2}
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
        titleStyle={styles.headerTitle}
        testID="header"
        left={
          <Button onPress={() => dispatch(openMainMenu())} testID="menuIcon">
            <Avatar size={'medium'} person={currentUser?.person} />
          </Button>
        }
        title={t('title')}
      />
      <ErrorNotice
        error={error}
        refetch={refetch}
        message={t('errorLoadingSteps')}
      />
      <View style={styles.contentContainer}>
        {hasSteps ? (
          <OnboardingCard type={GROUP_ONBOARDING_TYPES.steps} />
        ) : null}
        {hasSteps ? renderSteps() : loading ? <LoadingGuy /> : renderNull()}
      </View>
    </View>
  );
};

export default StepsScreen;
