import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { connect } from 'react-redux';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line import/default
import ParallaxScrollView from 'react-native-parallax-scroll-view';

import { Text, Icon } from '../../components/common';
import BackButton from '../BackButton';
import BottomButton from '../../components/BottomButton';
import Skip from '../../components/Skip';
import theme from '../../theme';
import StepsList from '../StepsList';
import Header from '../../components/Header';

import styles from './styles';

interface Step {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface SelectStepScreenProps {
  receiverId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  organization?: { [key: string]: any };
  contactName?: string;
  contactStageId: string;
  headerText: string;
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
  const { t } = useTranslation('selectStep');

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
      <View style={{ flex: 0, alignItems: 'center' }}>
        {renderHeader()}
        <Text style={styles.headerText}>{headerText}</Text>
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
        parallaxHeaderHeight={150 + theme.notchDifference}
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
