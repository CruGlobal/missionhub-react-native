import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Header from '../../containers/Header';
import GroupCardItem from '../../components/GroupCardItem';
import { Button, IconButton } from '../../components/common';
import { navigatePush } from '../../actions/navigation';
import { openMainMenu } from '../../utils/common';

import { GROUP_SCREEN } from './GroupScreen';
import styles from './styles';

@connect()
@translate('groupsList')
export class GroupsListScreen extends Component {
  handlePress = () => {
    this.props.dispatch(
      navigatePush(GROUP_SCREEN, {
        organization: { id: '728', name: 'DPS Org' },
      }),
    );
  };

  render() {
    const { dispatch, t, groups } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Header
          left={
            <IconButton
              name="menuIcon"
              type="MissionHub"
              onPress={() => dispatch(openMainMenu())}
            />
          }
          title={t('header').toUpperCase()}
        />
        <FlatList
          style={styles.groupList}
          data={groups}
          keyExtractor={i => i.id}
          renderItem={({ item }) => <GroupCardItem group={item} />}
        />
      </View>
    );
  }
}

export const mapStateToProps = () => ({
  groups: [
    {
      id: '123',
      name: 'Cru at Boston University',
      contacts: 768,
      unassigned: 13,
      uncontacted: 43,
    },
    {
      id: '456',
      name: 'Cru at Boston University Northeast Branch',
      contacts: 768,
      unassigned: 0,
      uncontacted: 0,
    },
  ],
});

export default connect(mapStateToProps)(GroupsListScreen);
