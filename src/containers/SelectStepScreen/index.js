import React, { Component } from 'react';
import { SafeAreaView, View } from 'react-native';
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
import BottomButton from '../../components/BottomButton';
import { ADD_STEP_SCREEN } from '../AddStepScreen';
import { disableBack, hasNotch } from '../../utils/common';
import { CREATE_STEP } from '../../constants';
import theme from '../../theme';
import StepsList from '../StepsList';
import Header from '../../components/Header';

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

  createCustomStep = ({ text }) => dispatch => {
    const { isMe, receiverId, organization, next } = this.props;

    dispatch(addStep(buildCustomStep(text, isMe), receiverId, organization));
    dispatch(
      next({ contactId: receiverId, orgId: organization && organization.id }),
    );
  };

  handleCreateStep = () => {
    const { dispatch, createStepTracking } = this.props;

    dispatch(
      navigatePush(ADD_STEP_SCREEN, {
        type: CREATE_STEP,
        trackingObj: createStepTracking,
        next: this.createCustomStep,
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
      next,
    } = this.props;
    const { headerHeight, parallaxHeaderHeight } = theme;

    return (
      <View flex={1}>
        <ParallaxScrollView
          backgroundColor={theme.primaryColor}
          contentBackgroundColor={theme.extraLightGrey}
          parallaxHeaderHeight={parallaxHeaderHeight + (hasNotch() ? 20 : 0)}
          renderForeground={this.renderForeground}
          stickyHeaderHeight={headerHeight}
          renderStickyHeader={this.renderStickyHeader}
        >
          <StepsList
            contactName={contactName}
            receiverId={receiverId}
            organization={organization}
            contactStageId={contactStageId}
            next={next}
          />
        </ParallaxScrollView>
        <SafeAreaView>
          <BottomButton
            onPress={this.handleCreateStep}
            text={this.props.t('createStep')}
          />
        </SafeAreaView>
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
  createStepTracking: PropTypes.object.isRequired,
  contact: PropTypes.object,
  receiverId: PropTypes.string.isRequired,
  enableBackButton: PropTypes.bool,
  organization: PropTypes.object,
  contactStageId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  next: PropTypes.func.isRequired,
};

const mapStateToProps = ({ auth }, { receiverId }) => {
  const myId = auth.person.id;

  return {
    myId,
    isMe: receiverId === myId,
  };
};
export default connect(mapStateToProps)(SelectStepScreen);
