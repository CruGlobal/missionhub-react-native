import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { Flex, Text, Button } from '../../components/common';
import theme from '../../theme';
import { disableBack } from '../../utils/common';

import styles from './styles';
import { personSelector } from '../../selectors/people';

@translate('getStarted')
class GetStartedScreen extends Component {
  componentDidMount() {
    disableBack.add();
  }

  componentWillUnmount() {
    disableBack.remove();
  }

  navigateNext = () => {
    const { dispatch, next, personId } = this.props;
    disableBack.remove();

    dispatch(
      next({
        personId,
        enableBackButton: false,
      }),
    );
  };

  render() {
    const { t, person } = this.props;
    const name = person.first_name.toLowerCase();

    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <Flex align="start" justify="center" value={4}>
          <Text type="header" style={styles.headerTitle}>
            {t('hi', { name })}
          </Text>
          <Text style={styles.text}>{t('tagline')}</Text>
        </Flex>

        <Flex value={1} align="stretch" justify="end">
          <Button
            type="secondary"
            onPress={this.navigateNext}
            text={t('getStarted').toUpperCase()}
            style={{ width: theme.fullWidth }}
          />
        </Flex>
      </Flex>
    );
  }
}

const mapStateToProps = ({ people }, { navigation }) => {
  const { personId } = navigation.state.params || {};

  return {
    person: personSelector({ people }, { personId }),
  };
};

export default connect(mapStateToProps)(GetStartedScreen);
export const GET_STARTED_SCREEN = 'nav/GET_STARTED';
