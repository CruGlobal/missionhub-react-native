import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import { getPeopleList } from '../../actions/people';
import { getMyOrganizations } from '../../actions/organizations';
import { navigatePush } from '../../actions/navigation';

import styles from './styles';
import { IconButton } from '../../components/common';
import PeopleList from '../../components/PeopleList';
import Header from '../Header';

const isCasey = false;

export class PeopleScreen extends Component {

  constructor(props) {
    super(props);

    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleAddContact = this.handleAddContact.bind(this);
  }

  componentWillMount() {
    if (!this.props.myOrgId) {
      this.props.dispatch(getMyOrganizations()).then(() => {
        this.props.dispatch(getPeopleList());
      });
    } else {
      this.props.dispatch(getPeopleList());
    }
  }

  handleAddContact(orgId) {
    this.props.dispatch(navigatePush('AddContact', { orgId }));
  }
  
  handleSearch() {
    this.props.dispatch(navigatePush('SearchPeople'));
  }

  handleRowSelect(person) {
    // LOG('person selected', person.id);
    this.props.dispatch(navigatePush('Contact', { person }));
  }

  render() {
    const { people, myId, sectionPeople } = this.props;
    
    return (
      <View style={styles.pageContainer}>
        <Header
          left={
            <IconButton name="menuIcon" type="MissionHub" onPress={() => this.props.dispatch(navigatePush('DrawerOpen'))} />
          }
          right={
            isCasey ? (
              <IconButton
                name="plusIcon"
                type="MissionHub"
                onPress={() => this.handleAddContact()} />
            ) : (
              <IconButton
                name="searchIcon"
                type="MissionHub"
                onPress={this.handleSearch} />
            )
          }
          title="PEOPLE"
          shadow={!isCasey}
        />
        <PeopleList
          sections={!isCasey}
          items={isCasey ? people : sectionPeople}
          myId={myId}
          onSelect={this.handleRowSelect}
          onAddContact={this.handleAddContact}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ auth, people, organizations }) => ({
  myId: auth.personId,
  people: people.all,
  sectionPeople: people.allByOrg,
  // people: [
  //   { id: '1', full_name: 'Bryan Eaton' },
  //   { id: '2', full_name: 'Bryan Eaton' },
  //   { id: '3', full_name: 'Bryan Eaton' },
  //   { id: '4', full_name: 'Bryan Eaton' },
  //   { id: '5', full_name: 'Bryan Eaton' },
  //   { id: '6', full_name: 'Bryan Eaton' },
  //   { id: '7', full_name: 'Bryan Eaton' },
  //   { id: '8', full_name: 'Bryan Eaton' },
  // ],
  // sectionPeople: [
  //   {
  //     key: '123',
  //     data: [
  //       { id: '1', full_name: 'Bryan Eaton' },
  //       { id: '2', full_name: 'Bryan Eaton' },
  //       { id: '3', full_name: 'Bryan Eaton' },
  //       { id: '4', full_name: 'Bryan Eaton' },
  //       { id: '11', full_name: 'Bryan Eaton' },
  //       { id: '21', full_name: 'Bryan Eaton' },
  //       { id: '31', full_name: 'Bryan Eaton' },
  //       { id: '12', full_name: 'Bryan Eaton' },
  //       { id: '22', full_name: 'Bryan Eaton' },
  //       { id: '32', full_name: 'Bryan Eaton' },
  //       { id: '13', full_name: 'Bryan Eaton' },
  //       { id: '23', full_name: 'Bryan Eaton' },
  //       { id: '33', full_name: 'Bryan Eaton' },
  //       { id: '14', full_name: 'Bryan Eaton' },
  //       { id: '24', full_name: 'Bryan Eaton' },
  //       { id: '34', full_name: 'Bryan Eaton' },
  //     ],
  //   },
  //   {
  //     key: '456',
  //     data: [
  //       { id: '5', full_name: 'Bryan Eaton' },
  //       { id: '6', full_name: 'Bryan Eaton' },
  //       { id: '7', full_name: 'Bryan Eaton' },
  //       { id: '8', full_name: 'Bryan Eaton' },
  //     ],
  //   },
  //   {
  //     key: '789',
  //     data: [
  //       { id: '5', full_name: 'Bryan Eaton' },
  //       { id: '6', full_name: 'Bryan Eaton' },
  //       { id: '7', full_name: 'Bryan Eaton' },
  //       { id: '8', full_name: 'Bryan Eaton' },
  //       { id: '15', full_name: 'Bryan Eaton' },
  //       { id: '16', full_name: 'Bryan Eaton' },
  //       { id: '17', full_name: 'Bryan Eaton' },
  //       { id: '18', full_name: 'Bryan Eaton' },
  //       { id: '25', full_name: 'Bryan Eaton' },
  //       { id: '26', full_name: 'Bryan Eaton' },
  //       { id: '27', full_name: 'Bryan Eaton' },
  //       { id: '28', full_name: 'Bryan Eaton' },
  //     ],
  //   },
  // ],
  myOrgId: organizations.myOrgId,
});

export default connect(mapStateToProps)(PeopleScreen);
