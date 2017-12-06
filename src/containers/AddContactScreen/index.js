import React, { Component } from 'react';
import { connect } from 'react-redux';

import { navigateBack } from '../../actions/navigation';
import styles from './styles';
import { Flex, Button, PlatformKeyboardAvoidingView, IconButton } from '../../components/common';
import Header from '../Header';
import AddContactFields from '../AddContactFields';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.savePerson = this.savePerson.bind(this);
  }

  savePerson() {

  }

  render() {
    return (
      <PlatformKeyboardAvoidingView>
        <Header
          right={
            <IconButton
              name="deleteIcon"
              type="MissionHub"
              onPress={() => this.props.dispatch(navigateBack())} />
          }
          shadow={false}
          title="ADD SOMEONE"
        />
        <AddContactFields />

        <Flex value={1} align="stretch" justify="end">
          <Button
            type="secondary"
            onPress={this.savePerson}
            text="DONE"
            style={styles.button}
          />
        </Flex>
      </PlatformKeyboardAvoidingView>
    );
  }
}

const mapStateToProps = (state, { navigation }) => ({
  id: navigation.state.params ? navigation.state.params.id : '',
});

export default connect(mapStateToProps)(ProfileScreen);
