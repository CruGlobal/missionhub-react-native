import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { navigatePush, navigateBack } from '../../actions/navigation';

import styles from './styles';
import { Flex, IconButton } from '../../components/common';
import ContactHeader from '../../components/ContactHeader';
import Header from '../Header';
import { CASEY, JEAN } from '../../constants';

class ContactScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      contactStage: null,
    };

    this.handleChangeStage = this.handleChangeStage.bind(this);
  }

  handleChangeStage() {
    const { personIsCurrentUser, person, contactAssignmentId } = this.props.screenProps;
    if (personIsCurrentUser) {
      this.props.dispatch(navigatePush('Stage', {
        onComplete: (stage) => this.setState({ contactStage: stage }),
        currentStage: this.state.contactStage && this.state.contactStage.id || null,
        contactId: person.id,
      }));
    } else {
      this.props.dispatch(navigatePush('PersonStage', {
        onComplete: (stage) => this.setState({ contactStage: stage }),
        currentStage: this.state.contactStage && this.state.contactStage.id || null,
        name: person.first_name,
        contactId: person.id,
        contactAssignmentId: contactAssignmentId,
      }));
    }
  }

  render() {
    const { person, isJean, contactStage, personIsCurrentUser } = this.props.screenProps;
    return (
      <View style={{ flex: 1 }}>
        <Header
          left={
            <IconButton name="backIcon" type="MissionHub" onPress={() => this.props.dispatch(navigateBack())} />
          }
          right={
            <IconButton name="moreIcon" type="MissionHub" onPress={() => this.props.dispatch(navigatePush('DrawerOpen'))} />
          }
          shadow={false}
        />
        <Flex align="center" justify="center" value={1} style={styles.container}>
          <ContactHeader onChangeStage={this.handleChangeStage} type={isJean ? JEAN : CASEY} isMe={personIsCurrentUser} person={person} stage={this.state.contactStage || contactStage} />
        </Flex>
      </View>
    );
  }
}

ContactScreen.propTypes = {
  screenProps: PropTypes.shape({
    person: PropTypes.shape({
      id: PropTypes.string.isRequired,
      first_name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default connect()(ContactScreen);
