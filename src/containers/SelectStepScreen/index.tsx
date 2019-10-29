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
  receiverId: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  organization?: { [key: string]: any };
  contactName?: string;
  contactStageId: string;
  headerText: string;
  enableSkipButton?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, null, never>;
  next: (nextProps: {
    receiverId: string | null;
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
      <View style={{ flex: 1, alignItems: 'center' }}>
        {renderHeader(false)}
        <Icon name="addStepIcon" type="MissionHub" style={styles.headerIcon} />
        <Text header={true} style={styles.headerTitle}>
          {t('stepsOfFaith')}
        </Text>
        <Text style={styles.headerText}>{headerText}</Text>
      </View>
    );
  };

  const renderHeader = (showTitle = true) => (
    <Header
      left={<BackButton />}
      center={
        showTitle && (
          <Text style={styles.collapsedHeaderTitle}>
            {t('stepsOfFaith').toUpperCase()}
          </Text>
        )
      }
      right={enableSkipButton && <Skip onSkip={handleSkip} />}
    />
  );

  const { headerHeight, parallaxHeaderHeight } = theme;

  return (
    <SafeAreaView style={styles.container}>
      <ParallaxScrollView
        style={{ flex: 1 }}
        backgroundColor={theme.primaryColor}
        contentBackgroundColor={theme.extraLightGrey}
        parallaxHeaderHeight={parallaxHeaderHeight + theme.notchDifference}
        renderForeground={renderForeground}
        stickyHeaderHeight={headerHeight}
        renderStickyHeader={renderHeader}
      >
        <StepsList
          contactName={contactName}
          receiverId={receiverId}
          contactStageId={contactStageId}
          onPressStep={navToSuggestedStep}
        />
      </ParallaxScrollView>
      <BottomButton onPress={navToCreateStep} text={t('createStep')} />
    </SafeAreaView>
  );
};

export default connect()(SelectStepScreen);
