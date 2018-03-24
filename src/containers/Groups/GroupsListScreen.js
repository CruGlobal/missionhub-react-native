import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Header from '../../containers/Header';
import GroupCardItem from '../../components/GroupCardItem';
import { IconButton } from '../../components/common';
import { navigatePush } from '../../actions/navigation';
import { openMainMenu } from '../../utils/common';

import { GROUP_SCREEN } from './GroupScreen';
import styles from './styles';

@translate('groupsList')
export class GroupsListScreen extends Component {
  handlePress = organization => {
    this.props.dispatch(
      navigatePush(GROUP_SCREEN, {
        organization,
      }),
    );
  };

  openMainMenu = () => this.props.dispatch(openMainMenu());

  keyExtractor = i => i.id;

  renderItem = ({ item }) => (
    <GroupCardItem group={item} onPress={this.handlePress} />
  );

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
        <FlatList
          style={styles.cardList}
          data={orgs}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

export const mapStateToProps = ({ organizations }) => ({
  orgs: organizations.all,
});

export default connect(mapStateToProps)(GroupsListScreen);
