import React, { Component } from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import SideMenu from '../../components/SideMenu';
import { deletePerson } from '../../actions/profile';
import { navigateBack } from '../../actions/navigation';

@translate('contactSideMenu')
export class ContactSideMenu extends Component {
  render() {
    const { t, isJean, person } = this.props;

    const menuItems = [
      {
        label: t('edit'),
        action: () => LOG('edit pressed'),
      },
      !isJean ? {
        label: t('delete'),
        action: () => {
          Alert.alert(
            t('deleteQuestion', { name: person.first_name }),
            t('deleteSentence'),
            [
              {
                text: t('cancel'),
                style: 'cancel',
              },
              {
                text: t('delete'),
                style: 'destructive',
                onPress: () => {
                  this.props.dispatch(deletePerson(person.id)).then(() => {
                    this.props.dispatch(navigateBack());
                    this.props.dispatch(navigateBack());
                  });
                },
              },
            ],
          );
        },
      } : null,
      isJean ? {
        label: t('attemptedContact'),
        action: () => LOG('attemptedContact pressed'),
      } : null,
      isJean ? {
        label: t('completed'),
        action: () => LOG('completed pressed'),
      } : null,
      isJean ? {
        label: t('contacted'),
        action: () => LOG('contacted pressed'),
      } : null,
      isJean ? {
        label: t('doNotContact'),
        action: () => LOG('doNotContact pressed'),
      } : null,
      isJean ? {
        label: t('uncontacted'),
        action: () => LOG('uncontacted pressed'),
      } : null,
      isJean ? {
        label: t('unassign'),
        action: () => LOG('unassign pressed'),
      } : null,
    ].filter(Boolean);

    return (
      <SideMenu menuItems={menuItems} />
    );
  }
}

const mapStateToProps = ({ auth }, { navigation }) => ({
  ...(navigation.state.params || {}),
  isJean: auth.isJean,
});

export default connect(mapStateToProps)(ContactSideMenu);
