import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { connect } from 'react-redux-legacy';
import { useSelector, useDispatch } from 'react-redux';
import { ThunkAction } from 'redux-thunk';
import { useNavigationParam } from 'react-navigation-hooks';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line import/default
import ParallaxScrollView from 'react-native-parallax-scroll-view';

import { TrackStateContext } from '../../actions/analytics';
import {
  getAnalyticsSectionType,
  getAnalyticsAssignmentType,
} from '../../utils/common';
import {
  ANALYTICS_SECTION_TYPE,
  ANALYTICS_ASSIGNMENT_TYPE,
} from '../../constants';
import { Text } from '../../components/common';
import BackButton from '../BackButton';
import Skip from '../../components/Skip';
import theme from '../../theme';
import StepsList from '../StepsList';
import Header from '../../components/Header';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import {
  personSelector,
  contactAssignmentSelector,
} from '../../selectors/people';
import { AuthState } from '../../reducers/auth';
import { OnboardingState } from '../../reducers/onboarding';
import { PeopleState, Person } from '../../reducers/people';
import { useIsMe } from '../../utils/hooks/useIsMe';

import styles from './styles';

export interface Step {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface SelectStepScreenProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: (nextProps: {
    personId: string;
    step?: Step;
    skip: boolean;
    orgId?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) => ThunkAction<void, any, null, never>;
  analyticsSection: TrackStateContext[typeof ANALYTICS_SECTION_TYPE];
  analyticsAssignmentType: TrackStateContext[typeof ANALYTICS_ASSIGNMENT_TYPE];
}

const SelectStepScreen = ({
  next,
  analyticsSection,
  analyticsAssignmentType,
}: SelectStepScreenProps) => {
  const { t } = useTranslation('selectStep');
  useAnalytics('add step', {
    screenContext: {
      [ANALYTICS_SECTION_TYPE]: analyticsSection,
      [ANALYTICS_ASSIGNMENT_TYPE]: analyticsAssignmentType,
    },
  });
  const dispatch = useDispatch();

  const personId: string = useNavigationParam('personId');
  const orgId: string | undefined = useNavigationParam('orgId');
  const enableSkipButton: boolean =
    useNavigationParam('enableSkipButton') || false;

  const person = useSelector<{ people: PeopleState }, Person>(({ people }) =>
    personSelector({ people }, { personId, orgId }),
  );
  const isMe = useIsMe(personId);

  const stageId = useSelector<{ auth: AuthState }, string>(
    ({ auth }) =>
      (isMe
        ? auth.person.user
        : contactAssignmentSelector(
            { auth },
            {
              person,
              orgId,
            },
          ) || {}
      ).pathway_stage_id,
  );

  const navigateNext = (step?: Step, skip = false) => {
    dispatch(
      next({
        personId,
        step,
        skip,
        orgId,
      }),
    );
  };

  const navToSuggestedStep = (step: Step) => {
    navigateNext(step);
  };

  const navToCreateStep = () => {
    navigateNext();
  };

  const handleSkip = () => {
    navigateNext(undefined, true);
  };

  const renderForeground = () => {
    return (
      <View style={{ flex: 1 }}>
        {renderHeader()}
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.headerText}>
            {isMe ? t('meHeader.part1') : t('personHeader.part1')}
          </Text>
          <Text style={styles.headerText}>
            {isMe
              ? t('meHeader.part2')
              : t('personHeader.part2', { name: person.first_name })}
          </Text>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <Header
      left={<BackButton />}
      right={enableSkipButton && <Skip onSkip={handleSkip} />}
    />
  );

  const { headerHeight } = theme;

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ backgroundColor: theme.primaryColor }} />
      <ParallaxScrollView
        backgroundColor={theme.primaryColor}
        contentBackgroundColor={theme.extraLightGrey}
        parallaxHeaderHeight={180}
        renderForeground={renderForeground}
        stickyHeaderHeight={headerHeight}
        renderStickyHeader={renderHeader}
      >
        <StepsList
          onPressCreateStep={navToCreateStep}
          contactName={person && person.first_name}
          personId={personId}
          contactStageId={stageId}
          onPressStep={navToSuggestedStep}
        />
      </ParallaxScrollView>
    </View>
  );
};

const mapStateToProps = (
  {
    auth,
    onboarding,
  }: {
    auth: AuthState;
    onboarding: OnboardingState;
  },
  {
    navigation: {
      state: {
        params: { personId },
      },
    },
  }: // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  any,
) => ({
  analyticsSection: getAnalyticsSectionType(onboarding),
  analyticsAssignmentType: getAnalyticsAssignmentType({ id: personId }, auth),
});

export default connect(mapStateToProps)(SelectStepScreen);
export const SELECT_STEP_SCREEN = 'nav/SELECT_STEP';
