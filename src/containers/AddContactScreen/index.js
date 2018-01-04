import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { navigateBack } from '../../actions/navigation';
import { addNewContact } from '../../actions/organizations';
import styles from './styles';
import { Flex, Button, PlatformKeyboardAvoidingView, IconButton } from '../../components/common';
import Header from '../Header';
import AddContactFields from '../AddContactFields';

@translate('addContact')
class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
    };

    this.savePerson = this.savePerson.bind(this);
    this.handleUpdateData = this.handleUpdateData.bind(this);
  }

  handleUpdateData(data) {
    this.setState({ data });
  }

  savePerson() {
    let saveData = { ...this.state.data };
    if (this.props.orgId) {
      saveData.orgId = this.props.orgId;
    }
    this.props.dispatch(addNewContact(saveData)).then((results) => {
      if (this.props.onComplete) {
        this.props.onComplete(results);
      }
      this.props.dispatch(navigateBack());
    });
  }

  render() {
    const { t } = this.props;

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
          title={t('addSomeone').toUpperCase()}
        />
        <AddContactFields onUpdateData={this.handleUpdateData} />

        <Flex value={1} align="stretch" justify="end">
          <Button
            type="secondary"
            onPress={this.savePerson}
            text={t('done').toUpperCase()}
            style={styles.button}
          />
        </Flex>
      </PlatformKeyboardAvoidingView>
    );
  }
}

ProfileScreen.propTypes = {
  orgId: PropTypes.string,
  onComplete: PropTypes.func,
};

const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(ProfileScreen);
