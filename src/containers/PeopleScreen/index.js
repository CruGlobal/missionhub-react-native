import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { getMyPeople } from '../../actions/people';
import { checkForUnreadComments } from '../../actions/unreadComments';
import {
  peopleByOrgSelector,
  allAssignedPeopleSelector,
} from '../../selectors/people';
import { navigatePush, navigateBack } from '../../actions/navigation';
import { IconButton } from '../../components/common';
import PeopleList from '../../components/PeopleList';
import Header from '../../components/Header';
import { openMainMenu, refresh } from '../../utils/common';
import { ADD_CONTACT_SCREEN } from '../AddContactScreen';
import { SEARCH_SCREEN } from '../SearchPeopleScreen';
import { navToPersonScreen } from '../../actions/person';
import TakeAStepWithSomeoneButton from '../TakeAStepWithSomeoneButton';
import TrackTabChange from '../TrackTabChange';
import { PEOPLE_TAB } from '../../constants';

import styles from './styles';

@withTranslation('peopleScreen')
export class PeopleScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
    };

    this.getPeople = this.getPeople.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleAddContact = this.handleAddContact.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  getPeople = () => this.props.dispatch(getMyPeople());

  openMainMenu = () => this.props.dispatch(openMainMenu());

  handleAddContact(org) {
    this.props.dispatch(
      navigatePush(ADD_CONTACT_SCREEN, {
        organization: org && org.id ? org : undefined,
        onComplete: () => {
          // You go through 4 screens for adding a person, so pop back to the first one
          this.props.dispatch(navigateBack(5));
          this.getPeople();
        },
      }),
    );
  }

  handleSearch() {
    this.props.dispatch(navigatePush(SEARCH_SCREEN));
  }

  handleRowSelect(person, org) {
    const organization = org && org.id !== 'personal' ? org : undefined;
    this.props.dispatch(navToPersonScreen(person, organization));
  }

  handleRefresh() {
    this.props.dispatch(checkForUnreadComments());
    refresh(this, this.getPeople);
  }

  render() {
    const { items, isJean, t, hasNoContacts } = this.props;
    return (
      <View style={styles.pageContainer}>
        <TrackTabChange screen={PEOPLE_TAB} />
        <Header
          left={
            <IconButton
              name="menuIcon"
              type="MissionHub"
              onPress={this.openMainMenu}
            />
          }
          right={
            isJean ? (
              <IconButton
                name="searchIcon"
                type="MissionHub"
                onPress={this.handleSearch}
              />
            ) : (
              <IconButton
                name="addContactIcon"
                type="MissionHub"
                size={24}
                onPress={this.handleAddContact}
              />
            )
          }
          title={t('header').toUpperCase()}
          shadow={!isJean}
        />
        <PeopleList
          sections={isJean}
          items={items}
          onSelect={this.handleRowSelect}
          onAddContact={this.handleAddContact}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
        />
        {hasNoContacts ? <TakeAStepWithSomeoneButton /> : null}
      </View>
    );
  }
}

export const mapStateToProps = ({ auth, people }) => {
  const { isJean } = auth;
  const items = isJean
    ? peopleByOrgSelector({ people, auth })
    : allAssignedPeopleSelector({ people, auth });

  const hasNoContacts = isJean
    ? items.length === 1 && items[0].people.length === 1
    : items.length === 1;

  return {
    isJean,
    items,
    hasNoContacts,
  };
};

export default connect(mapStateToProps)(PeopleScreen);
