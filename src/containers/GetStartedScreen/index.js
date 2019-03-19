import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { navigatePush } from '../../actions/navigation';
import { Flex, Text } from '../../components/common';
import BottomButton from '../../components/BottomButton';
import { STAGE_ONBOARDING_SCREEN } from '../StageScreen';
import { disableBack } from '../../utils/common';

import styles from './styles';

@translate('getStarted')
class GetStartedScreen extends Component {
  componentDidMount() {
    disableBack.add();
  }

  componentWillUnmount() {
    disableBack.remove();
  }

  navigateNext = () => {
    disableBack.remove();
    const { dispatch, next } = this.props;

    dispatch(
      next({
        section: 'onboarding',
        subsection: 'self',
        enableBackButton: false,
      }),
    );
  };

  render() {
    const { t, firstName } = this.props;
    const name = firstName.toLowerCase();

    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <Flex align="start" justify="center" value={4}>
          <Text type="header" style={styles.headerTitle}>
            {t('hi', { name })}
          </Text>
          <Text style={styles.text}>{t('tagline')}</Text>
        </Flex>
        <BottomButton onPress={this.navigateNext} text={t('getStarted')} />
      </Flex>
    );
  }
}

const mapStateToProps = ({ profile }, { navigation }) => {
  const navParams = navigation.state.params || {};
  return {
    id: navParams.id || '',
    firstName: profile.firstName,
  };
};

GetStartedScreen.propTypes = {
  next: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(GetStartedScreen);
export const GET_STARTED_SCREEN = 'nav/GET_STARTED';
