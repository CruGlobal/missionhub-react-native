import React, { Component } from 'react';
import { ScrollView, View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { communitiesSelector } from '../../selectors/organizations';
import Header from '../../containers/Header';
import GroupCardItem from '../../components/GroupCardItem';
import { IconButton, RefreshControl } from '../../components/common';
import { navigatePush } from '../../actions/navigation';
import { openMainMenu, refresh } from '../../utils/common';
import NULL from '../../../assets/images/MemberContacts.png';
import NullStateComponent from '../../components/NullStateComponent';
import { getMyCommunities } from '../../actions/organizations';

import { GROUP_SCREEN, USER_CREATED_GROUP_SCREEN } from './GroupScreen';
import styles from './styles';

@translate('groupsList')
class GroupsListScreen extends Component {
  state = { refreshing: false };

  loadGroups = () => this.props.dispatch(getMyCommunities());

  handleRefresh = () => refresh(this, this.loadGroups);

  handlePress = organization => {
    this.props.dispatch(
      navigatePush(
        organization.user_created ? USER_CREATED_GROUP_SCREEN : GROUP_SCREEN,
        {
          organization,
        },
      ),
    );
  };

  openMainMenu = () => this.props.dispatch(openMainMenu());

  keyExtractor = i => i.id;

  renderItem = ({ item }) => (
    <GroupCardItem group={item} onPress={this.handlePress} />
  );

  renderNull() {
    const { t } = this.props;

    return (
      <NullStateComponent
        imageSource={NULL}
        headerText={t('header').toUpperCase()}
        descriptionText={t('groupsNull')}
      />
    );
  }

  renderList() {
    return (
      <FlatList
        style={styles.cardList}
        data={this.props.orgs}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
      />
    );
  }

  render() {
    const { t, orgs } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <Header
          left={
            <IconButton
              name="menuIcon"
              type="MissionHub"
              onPress={this.openMainMenu}
            />
          }
          title={t('header').toUpperCase()}
        />
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
            />
          }
        >
          {orgs.length > 0 ? this.renderList() : this.renderNull()}
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({ organizations, auth }) => ({
  orgs: communitiesSelector({ organizations, auth }),
});

export default connect(mapStateToProps)(GroupsListScreen);
