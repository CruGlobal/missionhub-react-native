import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { getPeopleWithOrgSections } from '../../actions/people';
import { navigatePush } from '../../actions/navigation';

import styles from './styles';
import { IconButton } from '../../components/common';
import PeopleList from '../../components/PeopleList';
import Header from '../Header';

@translate('peopleScreen')
export class PeopleScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
    };

    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleAddContact = this.handleAddContact.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  componentWillMount() {
    this.getPeople();
  }

  getPeople() {
    return this.props.dispatch(getPeopleWithOrgSections());
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

  handleRefresh() {
    this.setState({ refreshing: true });
    this.getPeople().then(() => {
      this.setState({ refreshing: false });
    }).catch(() => {
      this.setState({ refreshing: false });
    });
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
