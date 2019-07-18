import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { connect } from 'react-redux';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line import/default
import ParallaxScrollView from 'react-native-parallax-scroll-view';

import { navigateBack } from '../../actions/navigation';
import { Text, Icon } from '../../components/common';
import BackButton from '../BackButton';
import BottomButton from '../../components/BottomButton';
import AbsoluteSkip from '../../components/AbsoluteSkip';
import theme from '../../theme';
import StepsList from '../StepsList';
import Header from '../../components/Header';

import styles from './styles';

interface SelectStepScreenProps {
  receiverId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  organization?: { [key: string]: any };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contact: { [key: string]: any };
  contactName?: string;
  contactStageId: string;
  headerText: string;
  enableBackButton?: boolean;
  enableSkipButton?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, null, never>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: (nextProps: {
    receiverId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    step?: { [key: string]: any };
    skip: boolean;
    orgId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) => ThunkAction<void, any, null, never>;
}

const SelectStepScreen = ({
  receiverId,
  organization,
  contact,
  contactName,
  contactStageId,
  headerText,
  enableBackButton = true,
  enableSkipButton = false,
  dispatch,
  next,
}: SelectStepScreenProps) => {
  const { t } = useTranslation('selectStep');
  if (!enableBackButton) {
    useDisableBack();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigateNext = (step?: { [key: string]: any }, skip = false) => {
    dispatch(
      next({
        receiverId,
        step,
        skip,
        orgId: organization && organization.id,
      }),
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navToSuggestedStep = (step: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }) => {
    navigateNext(step);
  };

  const navToCreateStep = () => {
    navigateNext();
  };

  const handleSkip = () => {
    navigateNext(undefined, true);
  };

  const navigateBackTwoScreens = () => dispatch(navigateBack(2));

  const renderForeground = () => {
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Header shadow={false} />
        <Icon name="addStepIcon" type="MissionHub" style={styles.headerIcon} />
        <Text header={true} style={styles.headerTitle}>
          {t('stepsOfFaith')}
        </Text>
        <Text style={styles.headerText}>{headerText}</Text>
      </View>
    );
  };

  const renderStickyHeader = () => (
    <Header
      center={
        <Text style={styles.collapsedHeaderTitle}>
          {t('stepsOfFaith').toUpperCase()}
        </Text>
      }
    />
  );

  const { headerHeight, parallaxHeaderHeight } = theme;

  return (
    <View style={{ flex: 1 }}>
      <ParallaxScrollView
        backgroundColor={theme.primaryColor}
        contentBackgroundColor={theme.extraLightGrey}
        parallaxHeaderHeight={parallaxHeaderHeight + theme.notchDifference}
        renderForeground={renderForeground}
        stickyHeaderHeight={headerHeight}
        renderStickyHeader={renderStickyHeader}
      >
        <StepsList
          contactName={contactName}
          receiverId={receiverId}
          contactStageId={contactStageId}
          onPressStep={navToSuggestedStep}
        />
      </ParallaxScrollView>
      <SafeAreaView>
        <BottomButton onPress={navToCreateStep} text={t('createStep')} />
      </SafeAreaView>
      {enableBackButton && (
        <BackButton
          customNavigate={contact ? undefined : navigateBackTwoScreens}
          absolute={true}
        />
      )}
      {enableSkipButton && <AbsoluteSkip onSkip={handleSkip} />}
    </View>
  );
};

export default connect()(SelectStepScreen);
