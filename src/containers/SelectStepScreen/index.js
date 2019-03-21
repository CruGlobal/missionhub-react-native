import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/default
import ParallaxScrollView from 'react-native-parallax-scroll-view';

import { navigateBack, navigatePush } from '../../actions/navigation';
import { addStep } from '../../actions/steps';
import { buildCustomStep } from '../../utils/steps';
import { Text, Icon } from '../../components/common';
import BackButton from '../BackButton';
import Header from '../Header';
import BottomButton from '../../components/BottomButton';
import { ADD_STEP_SCREEN } from '../AddStepScreen';
import { disableBack } from '../../utils/common';
import { CREATE_STEP } from '../../constants';
import theme from '../../theme';
import StepsList from '../StepsList';

import styles from './styles';

@translate('selectStep')
class SelectStepScreen extends Component {
  componentDidMount() {
    const { enableBackButton } = this.props;

    if (!enableBackButton) {
      disableBack.add();
    }
  }

  componentWillUnmount() {
    if (!this.props.enableBackButton) {
      disableBack.remove();
    }
  }

  createCustomStep = text => {
    const { dispatch, isMe, receiverId, organization, onComplete } = this.props;

    dispatch(addStep(buildCustomStep(text, isMe), receiverId, organization));
    onComplete();
  };

  handleCreateStep = () => {
    const { dispatch, createStepTracking } = this.props;

    dispatch(
      navigatePush(ADD_STEP_SCREEN, {
        type: CREATE_STEP,
        trackingObj: createStepTracking,
        onComplete: this.createCustomStep,
      }),
    );
  };

  navigateBackTwoScreens = () => this.props.dispatch(navigateBack(2));

  renderForeground = () => {
    const { t, headerText } = this.props;
    return (
      <View flex={1} alignItems={'center'}>
        <Header />
        <Icon name="addStepIcon" type="MissionHub" style={styles.headerIcon} />
        <Text type="header" style={styles.headerTitle}>
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
      contactName,
      receiverId,
      organization,
      contactStageId,
      enableBackButton,
      contact,
      onComplete,
    } = this.props;

    return (
      <View flex={1}>
        <ParallaxScrollView
          backgroundColor={theme.primaryColor}
          contentBackgroundColor={theme.extraLightGrey}
          parallaxHeaderHeight={240 + theme.notchHeight}
          renderForeground={this.renderForeground}
          stickyHeaderHeight={theme.headerHeight}
          renderStickyHeader={this.renderStickyHeader}
        >
          <StepsList
            contactName={contactName}
            receiverId={receiverId}
            organization={organization}
            contactStageId={contactStageId}
            onComplete={onComplete}
          />
        </ParallaxScrollView>
        <BottomButton
          onPress={this.handleCreateStep}
          text={this.props.t('createStep')}
        />
        {enableBackButton && (
          <BackButton
            customNavigate={contact ? undefined : this.navigateBackTwoScreens}
            absolute={true}
          />
        )}
      </View>
    );
  }
}

SelectStepScreen.propTypes = {
  onComplete: PropTypes.func.isRequired,
  createStepTracking: PropTypes.object.isRequired,
  contact: PropTypes.object,
  receiverId: PropTypes.string.isRequired,
  enableBackButton: PropTypes.bool,
  organization: PropTypes.object,
  contactStageId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};

const mapStateToProps = ({ auth }, { receiverId }) => {
  const myId = auth.person.id;

  return {
    myId,
    isMe: receiverId === myId,
  };
};
export default connect(mapStateToProps)(SelectStepScreen);
