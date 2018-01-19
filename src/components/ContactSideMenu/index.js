import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import SideMenu from '../../components/SideMenu';

@translate('contactSideMenu')
export class ContactSideMenu extends Component {
  render() {
    const { t, isCasey, isJean } = this.props;

    const menuItems = [
      {
        label: t('edit'),
        action: () => LOG('edit pressed'),
      },
      isCasey ? {
        label: t('delete'),
        action: () => LOG('delete pressed'),
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
  isCasey: !auth.isJean,
  isJean: auth.isJean,
});

export default connect(mapStateToProps)(ContactSideMenu);
