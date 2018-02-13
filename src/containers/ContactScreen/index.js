import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { navigatePush, navigateBack } from '../../actions/navigation';
import { setVisiblePersonInfo, fetchVisiblePersonInfo, updateVisiblePersonInfo } from '../../actions/profile';

import styles from './styles';
import { Flex, IconButton } from '../../components/common';
import ContactHeader from '../../components/ContactHeader';
import Header from '../Header';
import { CASEY, CONTACT_MENU_DRAWER, DRAWER_OPEN, JEAN } from '../../constants';
import { STAGE_SCREEN } from '../StageScreen';
import { PERSON_STAGE_SCREEN } from '../PersonStageScreen';

class ContactScreen extends Component {

  constructor(props) {
    super(props);

    this.handleChangeStage = this.handleChangeStage.bind(this);
  }

  async componentDidMount() {
    // Shares visiblePersonInfo with ContactSideMenu Drawer
    const { person, personIsCurrentUser, isJean, stages, myId } = this.props;
    this.props.dispatch(setVisiblePersonInfo({ person, personIsCurrentUser, isJean, stages }));
    this.props.dispatch(fetchVisiblePersonInfo(person.id, myId, personIsCurrentUser, stages));
  }

  handleChangeStage() {
    const { dispatch, personIsCurrentUser, person, contactAssignmentId, contactStage } = this.props;
    if (personIsCurrentUser) {
      dispatch(navigatePush(STAGE_SCREEN, {
        onComplete: (stage) => dispatch(updateVisiblePersonInfo({ contactStage: stage })),
        currentStage: contactStage && contactStage.id || null,
        contactId: person.id,
        section: 'people',
        subsection: 'self',
        enableBackButton: true,
      }));
    } else {
      dispatch(navigatePush(PERSON_STAGE_SCREEN, {
        onComplete: (stage) => dispatch(updateVisiblePersonInfo({ contactStage: stage })),
        currentStage: contactStage && contactStage.id || null,
        name: person.first_name,
        contactId: person.id,
        contactAssignmentId: contactAssignmentId,
        section: 'people',
        subsection: 'person',
      }));
    }
  }

  render() {
    const { person, isJean, contactStage, personIsCurrentUser } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Header
          left={
            <IconButton
              name="backIcon"
              type="MissionHub"
              onPress={() => this.props.dispatch(navigateBack())}
            />
          }
          right={
            <IconButton
              name="moreIcon"
              type="MissionHub"
              onPress={() => this.props.dispatch(navigatePush(DRAWER_OPEN, { drawer: CONTACT_MENU_DRAWER, isCurrentUser: personIsCurrentUser }))}
            />
          }
          shadow={false}
        />
        <Flex align="center" justify="center" value={1} style={styles.container}>
          <ContactHeader
            onChangeStage={this.handleChangeStage}
            type={isJean ? JEAN : CASEY}
            isMe={personIsCurrentUser}
            person={person}
            stage={contactStage}
            dispatch={this.props.dispatch}
          />
        </Flex>
      </View>
    );
  }
}

ContactScreen.propTypes = {
  person: PropTypes.shape({
    id: PropTypes.string.isRequired,
    first_name: PropTypes.string.isRequired,
  }).isRequired,
};


const mapStateToProps = ({ auth, stages, profile }, { navigation }) => ({
  ...(navigation.state.params || {}),
  person: profile.visiblePersonInfo.person || navigation.state.params.person,
  isJean: auth.isJean,
  stages: stages.stages,
  myId: auth.personId,
  personIsCurrentUser: navigation.state.params.person.id === auth.personId,
  contactAssignmentId: profile.visiblePersonInfo ? profile.visiblePersonInfo.contactAssignmentId : null,
  contactStage: profile.visiblePersonInfo ? profile.visiblePersonInfo.contactStage : null,
});

export default connect(mapStateToProps)(ContactScreen);
export const CONTACT_SCREEN = 'nav/CONTACT';
