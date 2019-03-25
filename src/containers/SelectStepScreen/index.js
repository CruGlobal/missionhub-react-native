import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/default
import ParallaxScrollView from 'react-native-parallax-scroll-view';

import { navigateBack } from '../../actions/navigation';
import { Text, Icon } from '../../components/common';
import BackButton from '../BackButton';
import Header from '../Header';
import BottomButton from '../../components/BottomButton';
import { disableBack } from '../../utils/common';
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

  handleCreateStep = () => {
    const { dispatch, next, receiverId, organization } = this.props;

    dispatch(
      next({
        isAddingCustomStep: true,
        receiverId,
        orgId: organization && organization.id,
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
            next={next}
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
  createStepTracking: PropTypes.object,
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
