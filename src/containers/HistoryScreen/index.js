import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { logout } from '../../actions/auth';

import styles from './styles';
import { Flex, Text } from '../../components/common';
import Header, { HeaderIcon } from '../Header';

@translate('history')
class HistoryScreen extends Component {
  render() {
    const { t } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <Header
          left={<HeaderIcon
            onPress={() => this.props.dispatch(logout())}
            icon="home"
          />}
          right={<HeaderIcon
            onPress={() => this.props.dispatch(logout())}
            icon="more-vert"
          />}
          title={t('header')}
        />
        <Flex align="center" justify="center" value={1} style={styles.container}>
          <Text>{t('header')}</Text>
        </Flex>
      </View>
    );
  }
}

export default connect()(HistoryScreen);
