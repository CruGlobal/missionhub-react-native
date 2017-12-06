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

export class PeopleScreen extends Component {

  constructor(props) {
    super(props);

    this.handleRowSelect = this.handleRowSelect.bind(this);
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

  handleRowSelect(person) {
    // LOG('person selected', person.id);
    this.props.dispatch(navigatePush('Contact', { person }));
  }

  render() {
    const { people, myId } = this.props;
    
    return (
      <View style={styles.pageContainer}>
        <Header
          left={
            <IconButton
              name="menuIcon"
              type="MissionHub"
              onPress={()=> LOG('pressed')} />
          }
          right={
            <IconButton
              name="addContactIcon"
              type="MissionHub"
              onPress={() => this.props.dispatch(navigatePush('AddContact'))} />
          }
          title="PEOPLE"
        />
        <PeopleList
          sections={false}
          items={people}
          myId={myId}
          onSelect={this.handleRowSelect}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ auth, people, organizations }) => ({
  myId: auth.personId,
  people: people.all,
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
  myOrgId: organizations.myOrgId,
});

export default connect(mapStateToProps)(PeopleScreen);
