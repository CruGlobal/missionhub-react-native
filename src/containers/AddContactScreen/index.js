import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { navigateBack } from '../../actions/navigation';
import { addNewContact } from '../../actions/organizations';
import styles from './styles';
import { Flex, Button, PlatformKeyboardAvoidingView, IconButton } from '../../components/common';
import Header from '../Header';
import AddContactFields from '../AddContactFields';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
    };

    this.savePerson = this.savePerson.bind(this);
  }

  savePerson() {
    let saveData = { ...this.state.data };
    if (this.props.orgId) {
      saveData.orgId = this.props.orgId;
    }
    this.props.dispatch(addNewContact(saveData));
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
        <AddContactFields onUpdateData={(data) => this.setState({ data })} />

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

ProfileScreen.propTypes = {
  orgId: PropTypes.string,
};

const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(ProfileScreen);
