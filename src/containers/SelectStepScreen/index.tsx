/* eslint-disable max-lines */

import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { ThunkAction } from 'redux-thunk';
import { useQuery } from '@apollo/react-hooks';
import { useNavigationParam } from 'react-navigation-hooks';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { CollapsibleHeaderFlatList } from 'react-native-collapsible-header-views';

import {
  getAnalyticsSectionType,
  getAnalyticsAssignmentType,
} from '../../utils/analytics';
import {
  ANALYTICS_SECTION_TYPE,
  ANALYTICS_ASSIGNMENT_TYPE,
} from '../../constants';
import {
  Text,
  Touchable,
  Card,
  RefreshControl,
  Button,
} from '../../components/common';
import BackButton from '../BackButton';
import Skip from '../../components/Skip';
import theme from '../../theme';
import Header from '../../components/Header';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { AuthState } from '../../reducers/auth';
import { OnboardingState } from '../../reducers/onboarding';
import { useIsMe } from '../../utils/hooks/useIsMe';
import SelectStepExplainerModal from '../../components/SelectStepExplainerModal';
import InfoIcon from '../../../assets/images/infoIcon.svg';
import { StepTypeBadge } from '../../components/StepTypeBadge/StepTypeBadge';
import { StepTypeEnum } from '../../../__generated__/globalTypes';
import { TriangleIndicator } from '../../components/TriangleIndicator/TriangleIndicator';
import { insertName } from '../../utils/steps';
import { ErrorNotice } from '../../components/ErrorNotice/ErrorNotice';
import { FooterLoading } from '../../components/FooterLoading';

import styles from './styles';
import Checkmark from './checkmark.svg';
import { STEP_SUGGESTIONS_QUERY, STEP_TYPE_COUNTS_QUERY } from './queries';
import {
  StepSuggestions,
  StepSuggestionsVariables,
} from './__generated__/StepSuggestions';
import CreateCustomStepIcon from './createCustomStepIcon.svg';
import {
  StepTypeCounts,
  StepTypeCountsVariables,
} from './__generated__/StepTypeCounts';

export interface SelectStepScreenNextProps {
  personId: string;
  stepSuggestionId?: string;
  stepType?: StepTypeEnum;
  skip: boolean;
  orgId?: string;
}

interface SelectStepScreenProps {
  next: (
    nextProps: SelectStepScreenNextProps,
  ) => // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ThunkAction<void, any, null, never>;
}

const SelectStepScreen = ({ next }: SelectStepScreenProps) => {
  const { t } = useTranslation('selectStep');
  const dispatch = useDispatch();

  const [isExplainerOpen, setIsExplainerOpen] = useState(false);
  const personId: string = useNavigationParam('personId');
  const orgId: string | undefined = useNavigationParam('orgId');
  const enableSkipButton: boolean =
    useNavigationParam('enableSkipButton') || false;
  const analyticsSection = useSelector(
    ({ onboarding }: { onboarding: OnboardingState }) =>
      getAnalyticsSectionType(onboarding),
  );
  const analyticsAssignmentType = useSelector(({ auth }: { auth: AuthState }) =>
    getAnalyticsAssignmentType({ id: personId }, auth),
  );
  useAnalytics('add step', {
    screenContext: {
      [ANALYTICS_SECTION_TYPE]: analyticsSection,
      [ANALYTICS_ASSIGNMENT_TYPE]: analyticsAssignmentType,
    },
  });

  const isMe = useIsMe(personId);

  const enableStepTypeFilters = !isMe && i18next.language.includes('en');

  const [currentStepType, setCurrentStepType] = useState<
    StepTypeEnum | undefined
  >(enableStepTypeFilters ? StepTypeEnum.relate : undefined);

  const [randomStepOrderSeed] = useState(Math.random() * 2 - 1); // Random number between -1 and 1

  const { data, loading, refetch, error, fetchMore } = useQuery<
    StepSuggestions,
    StepSuggestionsVariables
  >(STEP_SUGGESTIONS_QUERY, {
    variables: {
      personId,
      stepType: currentStepType,
      seed: randomStepOrderSeed,
    },
  });

  const { data: stepTypeCounts } = useQuery<
    StepTypeCounts,
    StepTypeCountsVariables
  >(STEP_TYPE_COUNTS_QUERY, {
    variables: {
      personId,
    },
  });

  const showCounts =
    !!stepTypeCounts?.person.relateSteps.pageInfo.totalCount ||
    !!stepTypeCounts?.person.praySteps.pageInfo.totalCount ||
    !!stepTypeCounts?.person.careSteps.pageInfo.totalCount ||
    !!stepTypeCounts?.person.shareSteps.pageInfo.totalCount;

  const handleOnEndReached = () => {
    if (loading || !data?.person.stepSuggestions.pageInfo.hasNextPage) {
      return;
    }
    fetchMore({
      variables: { after: data?.person.stepSuggestions.pageInfo.endCursor },
      updateQuery: (prev, { fetchMoreResult }) =>
        fetchMoreResult
          ? {
              ...prev,
              ...fetchMoreResult,
              person: {
                ...prev.person,
                ...fetchMoreResult.person,
                stepSuggestions: {
                  ...prev.person.stepSuggestions,
                  ...fetchMoreResult.person.stepSuggestions,
                  nodes: [
                    ...prev.person.stepSuggestions.nodes,
                    ...fetchMoreResult.person.stepSuggestions.nodes,
                  ],
                },
              },
            }
          : prev,
    });
  };

  const cardData = [
    {
      key: 'custom',
      text: t('createYourOwnStep', { type: currentStepType }),
      icon: true,
      action: () => navigateNext({ stepType: currentStepType }),
    },
    ...(data
      ? data.person.stepSuggestions.nodes.map(({ id, body }) => ({
          key: id,
          text: insertName(body, data.person.firstName),
          icon: false,
          action: () => navigateNext({ stepSuggestionId: id }),
        }))
      : []),
  ];

  const navigateNext = ({
    stepSuggestionId,
    stepType,
    skip = false,
  }: {
    stepSuggestionId?: string;
    stepType?: StepTypeEnum;
    skip?: boolean;
  }) => {
    dispatch(
      next({
        personId,
        stepSuggestionId,
        stepType,
        skip,
        orgId,
      }),
    );
  };

  const handleSkip = () => {
    navigateNext({ skip: true });
  };

  const renderTab = (stepType: StepTypeEnum, count = 0) => {
    const isSelected = currentStepType === stepType;
    return (
      <Touchable onPress={() => setCurrentStepType(stepType)}>
        <View style={{ alignItems: 'center' }}>
          <StepTypeBadge
            displayVertically={true}
            color={isSelected ? theme.white : theme.secondaryColor}
            stepType={stepType}
            labelUppercase={false}
            includeStepInLabel={false}
          />
          {showCounts ? (
            <View
              style={[
                styles.completedCountBadge,
                {
                  backgroundColor: isSelected
                    ? theme.white
                    : theme.parakeetBlue,
                },
              ]}
            >
              <Text style={styles.completedCountBadgeText}>{count}</Text>
              <Checkmark color={theme.primaryColor} />
            </View>
          ) : null}
          {isSelected ? (
            <TriangleIndicator
              color={theme.extraLightGrey}
              style={{ marginTop: 12 }}
            />
          ) : null}
        </View>
      </Touchable>
    );
  };

  const renderCollapsibleHeader = () => (
    <View
      style={{
        backgroundColor: theme.primaryColor,
      }}
    >
      <View style={styles.headerTextContainer}>
        <Text style={styles.headerText}>
          {isMe ? t('meHeader.part1') : t('personHeader.part1')}
        </Text>
        <Text style={styles.headerText}>
          {isMe
            ? t('meHeader.part2')
            : t('personHeader.part2', { name: data?.person.firstName })}
        </Text>
      </View>
      {enableStepTypeFilters ? (
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          {renderTab(
            StepTypeEnum.relate,
            stepTypeCounts?.person.relateSteps.pageInfo.totalCount,
          )}
          {renderTab(
            StepTypeEnum.pray,
            stepTypeCounts?.person.praySteps.pageInfo.totalCount,
          )}
          {renderTab(
            StepTypeEnum.care,
            stepTypeCounts?.person.careSteps.pageInfo.totalCount,
          )}
          {renderTab(
            StepTypeEnum.share,
            stepTypeCounts?.person.shareSteps.pageInfo.totalCount,
          )}
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ backgroundColor: theme.primaryColor }} />
      <Header
        left={<BackButton />}
        right={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {enableSkipButton ? <Skip onSkip={handleSkip} /> : null}
            <Button
              onPress={() => setIsExplainerOpen(true)}
              testID="SelectStepExplainerIconButton"
            >
              <InfoIcon color={theme.white} />
            </Button>
          </View>
        }
        style={{ backgroundColor: theme.primaryColor }}
      />
      <CollapsibleHeaderFlatList
        headerHeight={enableStepTypeFilters ? (showCounts ? 239 : 195) : 130}
        clipHeader={true}
        headerContainerBackgroundColor={theme.extraLightGrey}
        style={{ paddingVertical: 12 }}
        CollapsibleHeaderComponent={renderCollapsibleHeader()}
        data={cardData}
        renderItem={({ item }) => (
          <Card style={styles.card} onPress={item.action}>
            <Text style={styles.stepText}>{item.text}</Text>
            {item.icon ? <CreateCustomStepIcon /> : null}
          </Card>
        )}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        ListHeaderComponent={
          <ErrorNotice
            message={t('errorLoadingStepSuggestions')}
            error={error}
            refetch={refetch}
          />
        }
        ListFooterComponent={loading ? <FooterLoading /> : null}
        onEndReached={handleOnEndReached}
        onEndReachedThreshold={0.2}
      />
      {isExplainerOpen && (
        <SelectStepExplainerModal onClose={() => setIsExplainerOpen(false)} />
      )}
    </View>
  );
};

export default SelectStepScreen;
export const SELECT_STEP_SCREEN = 'nav/SELECT_STEP';
