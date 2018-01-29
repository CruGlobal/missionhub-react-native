import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { logout } from '../../actions/auth';
import { navigatePush, navigateBack } from '../../actions/navigation';

import styles from './styles';
import { Flex, Text, Button } from '../../components/common';
import Header, { HeaderIcon } from '../Header';
import ProfileFields from '../ProfileFields';

@translate('profileScreen')
class ProfileScreen extends Component {
  render() {
    const { id, t } = this.props;
    return (
      <View style={styles.containerWrap}>
        <Header
          left={<HeaderIcon
            onPress={() => this.props.dispatch(logout())}
            icon="home"
          />}
          right={<HeaderIcon
            onPress={() => this.props.dispatch(logout())}
            icon="more-vert"
          />}
          title="Someone's name"
          title2="Cru at Disney College Program - Some more really long text"
        />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.container}
        >
          <Text>{t('profileID', { id })}</Text>
          <ProfileFields />
          <Flex style={{ marginTop: 50 }} />
          <Button
            onPress={() => this.props.dispatch(logout())}
            text={t('logout')}
          />
          <Button
            onPress={() => this.props.dispatch(navigatePush('InteractionsTab'))}
            text={t('goToMain')}
          />
          {
            id ? (
              <Button
                onPress={() => this.props.dispatch(navigateBack())}
                text={t('goBack')}
              />
            ) : null
          }
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state, { navigation }) => ({
  id: navigation.state.params ? navigation.state.params.id : '',
});

export default connect(mapStateToProps)(ProfileScreen);
