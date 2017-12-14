import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import { navigateBack } from '../../actions/navigation';
import styles from './styles';
import { IconButton } from '../../components/common';
import Header from '../Header';

export class SearchPeopleFilterRefineScreen extends Component {

  constructor(props) {
    super(props);

    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch() {

  }

  render() {
    return (
      <View style={styles.pageContainer}>
        <Header
          left={
            <IconButton
              name="backIcon"
              type="MissionHub"
              onPress={() => this.props.dispatch(navigateBack())} />
          }
          title="Refine"
        />
      </View>
    );
  }
}

export default connect()(SearchPeopleFilterRefineScreen);
