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
import { STEP_SUGGESTIONS_QUERY } from './queries';
import {
  StepSuggestions,
  StepSuggestionsVariables,
} from './__generated__/StepSuggestions';
import CreateCustomStepIcon from './createCustomStepIcon.svg';

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

  const renderTab = (stepType: StepTypeEnum) => {
    const isSelected = currentStepType === stepType;
    return (
      <Touchable onPress={() => setCurrentStepType(stepType)}>
        <View>
          <StepTypeBadge
            displayVertically={true}
            color={isSelected ? theme.white : theme.secondaryColor}
            stepType={stepType}
            labelUppercase={false}
            includeStepInLabel={false}
          />
          {isSelected ? (
            <View style={{ marginTop: 20, alignItems: 'center' }}>
              <TriangleIndicator color={theme.extraLightGrey} />
            </View>
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
          {renderTab(StepTypeEnum.relate)}
          {renderTab(StepTypeEnum.pray)}
          {renderTab(StepTypeEnum.care)}
          {renderTab(StepTypeEnum.share)}
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
        headerHeight={enableStepTypeFilters ? 203 : 130}
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
