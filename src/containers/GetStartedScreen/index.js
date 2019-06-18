import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-native';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { Flex, Text } from '../../components/common';
import BottomButton from '../../components/BottomButton';
import { disableBack } from '../../utils/common';

import styles from './styles';

@withTranslation('getStarted')
class GetStartedScreen extends Component {
  componentDidMount() {
    disableBack.add();
  }

  componentWillUnmount() {
    disableBack.remove();
  }

  navigateNext = () => {
    const { dispatch, next } = this.props;

    disableBack.remove();
    dispatch(next({}));
  };

  render() {
    const { t, firstName } = this.props;
    const name = firstName.toLowerCase();

    return (
      <SafeAreaView style={styles.container}>
        <Flex align="center" justify="center" value={1} style={styles.content}>
          <Flex align="start" justify="center" value={4}>
            <Text type="header" style={styles.headerTitle}>
              {t('hi', { name })}
            </Text>
            <Text style={styles.text}>{t('tagline')}</Text>
          </Flex>

          <BottomButton onPress={this.navigateNext} text={t('getStarted')} />
        </Flex>
      </SafeAreaView>
    );
  }
}

GetStartedScreen.propTypes = {
  next: PropTypes.func.isRequired,
  firstName: PropTypes.string.isRequired,
};

const mapStateToProps = ({ profile }, { next }) => {
  return {
    next,
    firstName: profile.firstName,
  };
};

export default connect(mapStateToProps)(GetStartedScreen);
export const GET_STARTED_SCREEN = 'nav/GET_STARTED';
