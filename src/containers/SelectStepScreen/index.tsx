import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { connect, useDispatch } from 'react-redux';
import { ThunkAction } from 'redux-thunk';
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
import { AuthState } from '../../reducers/auth';
import { OnboardingState } from '../../reducers/onboarding';
import { useAnalytics } from '../../utils/hooks/useAnalytics';

import styles from './styles';

export interface Step {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface SelectStepScreenProps {
  personId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orgId?: string;
  contactName?: string;
  contactStageId: string;
  headerText: [string, string];
  enableSkipButton?: boolean;
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
  personId,
  orgId,
  contactName,
  contactStageId,
  headerText,
  enableSkipButton = false,
  next,
  analyticsSection,
  analyticsAssignmentType,
}: SelectStepScreenProps) => {
  useAnalytics({
    screenName: 'add step',
    screenContext: {
      [ANALYTICS_SECTION_TYPE]: analyticsSection,
      [ANALYTICS_ASSIGNMENT_TYPE]: analyticsAssignmentType,
    },
  });
  const dispatch = useDispatch();

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
          <Text style={styles.headerText}>{headerText[0]}</Text>
          <Text style={styles.headerText}>{headerText[1]}</Text>
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
          contactName={contactName}
          personId={personId}
          contactStageId={contactStageId}
          onPressStep={navToSuggestedStep}
        />
      </ParallaxScrollView>
    </View>
  );
};

const mapStateToProps = (
  { auth, onboarding }: { auth: AuthState; onboarding: OnboardingState },
  { personId }: { personId: string },
) => ({
  analyticsSection: getAnalyticsSectionType(onboarding),
  analyticsAssignmentType: getAnalyticsAssignmentType(personId, auth),
});

export default connect(mapStateToProps)(SelectStepScreen);
