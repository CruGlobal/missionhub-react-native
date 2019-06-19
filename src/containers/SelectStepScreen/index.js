import React, { Component } from 'react';
import { SafeAreaView, View } from 'react-native';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/default
import ParallaxScrollView from 'react-native-parallax-scroll-view';

import { navigateBack, navigatePush } from '../../actions/navigation';
import { addStep } from '../../actions/steps';
import { buildCustomStep } from '../../utils/steps';
import { Text, Icon } from '../../components/common';
import BackButton from '../BackButton';
import BottomButton from '../../components/BottomButton';
import AbsoluteSkip from '../../components/AbsoluteSkip';
import { ADD_STEP_SCREEN } from '../AddStepScreen';
import { disableBack } from '../../utils/common';
import { CREATE_STEP } from '../../constants';
import theme from '../../theme';
import StepsList from '../StepsList';
import Header from '../../components/Header';

import styles from './styles';

@withTranslation('selectStep')
class SelectStepScreen extends Component {
  componentDidMount() {
    if (!this.props.enableBackButton) {
      disableBack.add();
    }
  }

  componentWillUnmount() {
    if (!this.props.enableBackButton) {
      disableBack.remove();
    }
  }

  navigateNext(step, skip) {
    const { dispatch, next, receiverId, organization } = this.props;
    dispatch(
      next({ receiverId, step, skip, orgId: organization && organization.id }),
    );
  }
  navToSuggestedStep = step => {
    this.navigateNext(step);
  };

  navToCreateStep = () => {
    this.navigateNext();
  };

  handleSkip = () => {
    this.navigateNext(undefined, true);
  };

  navigateBackTwoScreens = () => this.props.dispatch(navigateBack(2));

  renderForeground = () => {
    const { t, headerText } = this.props;
    return (
      <View flex={1} alignItems={'center'}>
        <Header shadow={false} />
        <Icon name="addStepIcon" type="MissionHub" style={styles.headerIcon} />
        <Text header={true} style={styles.headerTitle}>
          {t('stepsOfFaith')}
        </Text>
        <Text style={styles.headerText}>{headerText}</Text>
      </View>
    );
  };

  renderStickyHeader = () => (
    <Header
      center={
        <Text style={styles.collapsedHeaderTitle}>
          {this.props.t('stepsOfFaith').toUpperCase()}
        </Text>
      }
    />
  );

  render() {
    const {
      t,
      contactName,
      receiverId,
      organization,
      contactStageId,
      enableBackButton,
      enableSkipButton,
      contact,
    } = this.props;
    const { headerHeight, parallaxHeaderHeight } = theme;

    return (
      <View flex={1}>
        <ParallaxScrollView
          backgroundColor={theme.primaryColor}
          contentBackgroundColor={theme.extraLightGrey}
          parallaxHeaderHeight={parallaxHeaderHeight + theme.notchDifference}
          renderForeground={this.renderForeground}
          stickyHeaderHeight={headerHeight}
          renderStickyHeader={this.renderStickyHeader}
        >
          <StepsList
            contactName={contactName}
            receiverId={receiverId}
            organization={organization}
            contactStageId={contactStageId}
            onPressStep={this.navToSuggestedStep}
          />
        </ParallaxScrollView>
        <SafeAreaView>
          <BottomButton onPress={this.navToCreateStep} text={t('createStep')} />
        </SafeAreaView>
        {enableBackButton && (
          <BackButton
            customNavigate={contact ? undefined : this.navigateBackTwoScreens}
            absolute={true}
          />
        )}
        {enableSkipButton && <AbsoluteSkip onSkip={this.handleSkip} />}
      </View>
    );
  }
}

SelectStepScreen.defaultProps = {
  enableBackButton: true,
  enableSkipButton: false,
};

SelectStepScreen.propTypes = {
  headerText: PropTypes.string.isRequired,
  contactName: PropTypes.string,
  contact: PropTypes.object,
  receiverId: PropTypes.string.isRequired,
  enableBackButton: PropTypes.bool,
  enableSkipButton: PropTypes.bool,
  organization: PropTypes.object,
  contactStageId: PropTypes.string.isRequired,
  next: PropTypes.func.isRequired,
};

const mapStateToProps = (
  { auth },
  {
    headerText,
    contactName,
    contact,
    receiverId,
    enableBackButton,
    enableSkipButton,
    orgId,
    contactStageId,
    next,
  },
) => {
  const myId = auth.person.id;

  return {
    headerText,
    contactName,
    contact,
    receiverId,
    enableBackButton,
    enableSkipButton,
    orgId,
    contactStageId,
    next,
    myId,
    isMe: receiverId === myId,
  };
};
export default connect(mapStateToProps)(SelectStepScreen);
