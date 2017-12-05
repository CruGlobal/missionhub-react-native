import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

// import { getPeopleList } from '../../actions/people';

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
    // this.props.dispatch(getPeopleList());
  }

  handleRowSelect(person) {
    LOG('person selected', person);
  }

  render() {
    const { people } = this.props;
    
    return (
      <View style={styles.pageContainer}>
        <Header
          left={
            <IconButton name="menuIcon" type="MissionHub" onPress={()=> LOG('pressed')} />
          }
          right={
            <IconButton name="addContactIcon" type="MissionHub" onPress={()=> LOG('pressed')} />
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

const mapStateToProps = () => ({
  people: [
    { id: '1', body: 'hello 1' },
    { id: '2', body: 'hello 2' },
    { id: '3', body: 'hello 3' },
    { id: '4', body: 'hello 4' },
    { id: '5', body: 'hello 5' },
    { id: '6', body: 'hello 6' },
    { id: '7', body: 'hello 7' },
    { id: '8', body: 'hello 8' },
    { id: '9', body: 'hello 9' },
  ],
});

export default connect(mapStateToProps)(PeopleScreen);
