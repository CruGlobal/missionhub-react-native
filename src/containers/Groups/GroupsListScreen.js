import React, { Component } from 'react';
import { ScrollView, View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { communitiesSelector } from '../../selectors/organizations';
import Header from '../../containers/Header';
import GroupCardItem from '../../components/GroupCardItem';
import {
  IconButton,
  RefreshControl,
  Button,
  Flex,
} from '../../components/common';
import { navigatePush } from '../../actions/navigation';
import { trackActionWithoutData } from '../../actions/analytics';
import { openMainMenu, refresh } from '../../utils/common';
import NULL from '../../../assets/images/MemberContacts.png';
import NullStateComponent from '../../components/NullStateComponent';
import { getMyCommunities } from '../../actions/organizations';
import { resetScrollGroups } from '../../actions/swipe';
import { ACTIONS } from '../../constants';

import { GROUP_SCREEN, USER_CREATED_GROUP_SCREEN } from './GroupScreen';
import styles from './styles';
import { JOIN_GROUP_SCREEN } from './JoinGroupScreen';
import { CREATE_GROUP_SCREEN } from './CreateGroupScreen';

@translate('groupsList')
class GroupsListScreen extends Component {
  state = { refreshing: false };

  async componentDidMount() {
    const { scrollOnLoad, dispatch } = this.props;
    // Always load groups when this tab mounts
    await this.loadGroups();
    if (scrollOnLoad) {
      this.flatList && this.flatList.scrollToEnd();
      dispatch(resetScrollGroups());
    }
  }

  loadGroups = () => this.props.dispatch(getMyCommunities());

  handleRefresh = () => refresh(this, this.loadGroups);

  handlePress = organization => {
    const { dispatch } = this.props;
    dispatch(
      navigatePush(
        organization.user_created ? USER_CREATED_GROUP_SCREEN : GROUP_SCREEN,
        {
          organization,
        },
      ),
    );
    dispatch(trackActionWithoutData(ACTIONS.SELECT_COMMUNITY));
  };

  openMainMenu = () => this.props.dispatch(openMainMenu());

  join = () => {
    this.props.dispatch(navigatePush(JOIN_GROUP_SCREEN));
  };

  create = () => {
    this.props.dispatch(navigatePush(CREATE_GROUP_SCREEN));
  };

  keyExtractor = i => i.id;

  renderItem = ({ item }) => (
    <GroupCardItem group={item} onPress={this.handlePress} />
  );

  refList = c => (this.flatList = c);

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
        ref={this.refList}
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
          shadow={false}
        />
        <Flex direction="row">
          <Flex value={1}>
            <Button
              type="transparent"
              style={[styles.blockBtn, styles.blockBtnBorderRight]}
              buttonTextStyle={styles.blockBtnText}
              text={t('joinCommunity').toUpperCase()}
              onPress={this.join}
            />
          </Flex>
          <Flex value={1}>
            <Button
              type="transparent"
              style={styles.blockBtn}
              buttonTextStyle={styles.blockBtnText}
              text={t('createCommunity').toUpperCase()}
              onPress={this.create}
            />
          </Flex>
        </Flex>
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

const mapStateToProps = ({ organizations, auth, swipe }) => ({
  orgs: communitiesSelector({ organizations, auth }),
  scrollOnLoad: swipe.groupScrollOnMount,
});

export default connect(mapStateToProps)(GroupsListScreen);
