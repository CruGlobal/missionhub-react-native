import React, { Component } from 'react';
import { View } from 'react-native';
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
    const { dispatch, t } = this.props;
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
        <View style={styles.groupList}>
          <GroupCardItem
            name={'Cru at Boston University'}
            contacts={768}
            unassigned={13}
            uncontacted={43}
          />
          <GroupCardItem
            name={'Cru at Boston University Northeast Branch'}
            contacts={768}
            unassigned={0}
            uncontacted={0}
          />
        </View>
      </View>
    );
  }
}

export const mapStateToProps = () => ({
  groups: [
    {
      name: 'Cru at Boston University',
      contacts: 768,
      unassigned: 13,
      uncontacted: 43,
    },
    {
      name: 'Cru at Boston University Northeast Branch',
      contacts: 768,
      unassigned: 13,
      uncontacted: 43,
    },
  ],
});

export default connect(mapStateToProps)(GroupsListScreen);
