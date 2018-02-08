import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { getMyPeople } from '../../actions/people';
import { navigatePush } from '../../actions/navigation';

import styles from './styles';
import { IconButton } from '../../components/common';
import PeopleList from '../../components/PeopleList';
import Header from '../Header';
import { refresh } from '../../utils/common';

@translate('peopleScreen')
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
    this.handleAction = this.handleAction.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  componentWillMount() {
    this.getPeople();
  }

  getPeople() {
    return this.props.dispatch(getMyPeople());
  }

  handleAddContact(org) {
    this.props.dispatch(navigatePush('AddContact', {
      organization: org && org.id ? org : undefined,
      onComplete: () => this.getPeople(),
    }));
  }

  handleSearch() {
    this.props.dispatch(navigatePush('SearchPeople'));
  }

  handleRowSelect(person) {
    this.props.dispatch(navigatePush('Contact', { person }));
  }

  handleAction(person) {
    LOG('action selected', person);
    // const { dispatch, personIsCurrentUser, person, contactAssignmentId, contactStage } = this.props;
    // if (personIsCurrentUser) {
    //   dispatch(navigatePush('Stage', {
    //     onComplete: (stage) => dispatch(updateVisiblePersonInfo({ contactStage: stage })),
    //     currentStage: contactStage && contactStage.id || null,
    //     contactId: person.id,
    //   }));
    // } else {
    //   dispatch(navigatePush('PersonStage', {
    //     onComplete: (stage) => dispatch(updateVisiblePersonInfo({ contactStage: stage })),
    //     currentStage: contactStage && contactStage.id || null,
    //     name: person.first_name,
    //     contactId: person.id,
    //     contactAssignmentId: contactAssignmentId,
    //   }));
    // }

    // this.props.dispatch(navigatePush('Contact', { person }));
  }

  handleRefresh() {
    refresh(this, this.getPeople);
  }

  render() {
    const { people, sectionPeople, isJean, t } = this.props;
    return (
      <View style={styles.pageContainer}>
        <Header
          left={
            <IconButton name="menuIcon" type="MissionHub" onPress={() => this.props.dispatch(navigatePush('DrawerOpen'))} />
          }
          right={
            isJean ? (
              <IconButton
                name="searchIcon"
                type="MissionHub"
                onPress={this.handleSearch} />
            ) : (
              <IconButton
                name="plusIcon"
                type="MissionHub"
                onPress={() => this.handleAddContact()} />
            )
          }
          title={t('header').toUpperCase()}
          shadow={isJean}
        />
        <PeopleList
          sections={isJean}
          items={isJean ? sectionPeople : people }
          onSelect={this.handleRowSelect}
          onAction={this.handleAction}
          onAddContact={this.handleAddContact}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ auth, people }) => ({
  isJean: auth.isJean,
  people: [ auth.user ].concat(people.all),
  sectionPeople: people.allByOrg,
  me: auth.user,
});

export default connect(mapStateToProps)(PeopleScreen);
