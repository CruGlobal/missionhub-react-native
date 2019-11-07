import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { connect } from 'react-redux';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
// eslint-disable-next-line import/default
import ParallaxScrollView from 'react-native-parallax-scroll-view';

import { Text } from '../../components/common';
import BackButton from '../BackButton';
import Skip from '../../components/Skip';
import theme from '../../theme';
import StepsList from '../StepsList';
import Header from '../../components/Header';

import styles from './styles';

export interface Step {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface SelectStepScreenProps {
  receiverId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  organization?: { [key: string]: any };
  contactName?: string;
  contactStageId: string;
  headerText: [string, string];
  enableSkipButton?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, null, never>;
  next: (nextProps: {
    receiverId: string;
    step?: Step;
    skip: boolean;
    orgId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) => ThunkAction<void, any, null, never>;
}

const SelectStepScreen = ({
  receiverId,
  organization,
  contactName,
  contactStageId,
  headerText,
  enableSkipButton = false,
  dispatch,
  next,
}: SelectStepScreenProps) => {
  const navigateNext = (step?: Step, skip = false) => {
    dispatch(
      next({
        receiverId,
        step,
        skip,
        orgId: organization && organization.id,
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
      <View style={{ flex: 1, alignItems: 'center' }}>
        {renderHeader()}
        <Text style={styles.headerText}>{headerText[0]}</Text>
        <Text style={styles.headerText}>{headerText[1]}</Text>
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
    <SafeAreaView style={styles.container}>
      <ParallaxScrollView
        style={{ flex: 1 }}
        backgroundColor={theme.primaryColor}
        contentBackgroundColor={theme.extraLightGrey}
        parallaxHeaderHeight={150}
        renderForeground={renderForeground}
        stickyHeaderHeight={headerHeight}
        renderStickyHeader={renderHeader}
      >
        <StepsList
          onPressCreateStep={navToCreateStep}
          contactName={contactName}
          receiverId={receiverId}
          contactStageId={contactStageId}
          onPressStep={navToSuggestedStep}
        />
      </ParallaxScrollView>
    </SafeAreaView>
  );
};

export default connect()(SelectStepScreen);
