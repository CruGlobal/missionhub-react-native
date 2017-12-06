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

class PeopleScreen extends Component {

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
    const { people } = this.props;
    
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
          onSelect={this.handleRowSelect}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ people, organizations }) => ({
  people: people.all,
  myOrgId: organizations.myOrgId,
});

export default connect(mapStateToProps)(PeopleScreen);
