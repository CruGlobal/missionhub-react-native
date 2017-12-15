import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { navigatePush } from '../../actions/navigation';

import styles from './styles';
import { Flex, Text, Button } from '../../components/common';
import theme from '../../theme';
import BackButton from '../BackButton';

@translate('getStarted')
class GetStartedScreen extends Component {
  render() {
    const { t } = this.props;

    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <BackButton />

        <Flex align="center" justify="center" value={4} >
          <Text type="header" style={styles.headerTitle}>{t('hi')} {this.props.firstName.toLowerCase()}!</Text>
          <Text style={styles.text}>{t('tagline')}</Text>
        </Flex>

        <Flex value={1} align="stretch" justify="end">
          <Button
            type="secondary"
            onPress={() => this.props.dispatch(navigatePush('Stage'))}
            text={t('getStarted').toUpperCase()}
            style={{ width: theme.fullWidth }}
          />
        </Flex>
      </Flex>
    );
  }
}

const mapStateToProps = ({ profile }, { navigation }) => ({
  id: navigation.state.params ? navigation.state.params.id : '',
  firstName: profile.firstName,
});

export default connect(mapStateToProps)(GetStartedScreen);
