import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DrawerActions } from 'react-navigation';

import Header from '../Header';
import BackButton from '../BackButton';
import PersonHeader from '../../components/PersonHeader';
import { Flex, IconButton, Text } from '../../components/common';
import { CONTACT_MENU_DRAWER } from '../../constants';

export class PersonScreen extends Component {
  openDrawer = () => {
    this.props.dispatch(
      DrawerActions.openDrawer({
        drawer: CONTACT_MENU_DRAWER,
        isCurrentUser: false,
      }),
    );
  };

  render() {
    const { person, organization } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <Header
          left={<BackButton />}
          right={
            <IconButton
              name="moreIcon"
              type="MissionHub"
              onPress={this.openDrawer}
            />
          }
          shadow={false}
          title={organization.name}
        />
        <Flex align="center" justify="center" value={1}>
          <PersonHeader person={person} organization={organization} />
        </Flex>
      </View>
    );
  }
}

PersonScreen.propTypes = {
  person: PropTypes.shape({
    id: PropTypes.string.isRequired,
    first_name: PropTypes.string.isRequired,
  }).isRequired,
  organization: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(PersonScreen);
export const PERSON_SCREEN = 'nav/PERSON';
