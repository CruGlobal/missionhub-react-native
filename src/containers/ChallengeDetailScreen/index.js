import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import i18next from 'i18next';

import { navigateBack } from '../../actions/navigation';
import { Text, IconButton, Button } from '../../components/common';
import Header from '../Header';
import { generateSwipeTabMenuNavigator } from '../../components/SwipeTabMenu/index';
import Members from '../Groups/Members';

import styles from './styles';

const CHALLENGE_JOINED = 'nav/CHALLENGE_JOINED';
const CHALLENGE_COMPLETED = 'nav/CHALLENGE_COMPLETED';

export const CHALLENGE_DETAIL_TABS = [
  {
    name: i18next.t('challengeFeeds:joined'),
    navigationAction: CHALLENGE_JOINED,
    component: ({
      navigation: {
        state: {
          params: { orgId },
        },
      },
    }) => <Members organization={{ id: orgId }} />,
  },
  {
    name: i18next.t('challengeFeeds:completed'),
    navigationAction: CHALLENGE_COMPLETED,
    component: ({
      navigation: {
        state: {
          params: { orgId },
        },
      },
    }) => <Members organization={{ id: orgId }} />,
  },
];

@translate('challengeFeeds')
class ChallengeDetailScreen extends Component {
  handleCancel = () => {
    this.props.dispatch(navigateBack());
  };
  handleEdit = () => {
    const { challenge, onEdit } = this.props;
    onEdit && onEdit(challenge);
  };
  handleJoin = () => {
    const { challenge, onJoin } = this.props;
    onJoin(challenge);
  };
  handleComplete = () => {
    const { challenge, onComplete } = this.props;
    onComplete(challenge);
  };

  render() {
    const { t, acceptedChallenge } = this.props;

    const joined = !!acceptedChallenge;
    const completed = !!(acceptedChallenge && acceptedChallenge.completed_at);

    return (
      <View>
        <Header
          left={
            <IconButton
              name="deleteIcon"
              type="MissionHub"
              onPress={this.handleCancel}
              style={styles.button}
            />
          }
          right={
            !completed ? (
              <Button
                type="transparent"
                text={t(joined ? 'complete' : 'join')}
                onPress={joined ? this.handleComplete : this.handleJoin}
                buttonTextStyle={styles.button}
              />
            ) : null
          }
          shadow={false}
          style={styles.header}
        />
        <Text>Challenge Detail Screen</Text>
      </View>
    );
  }
}

ChallengeDetailScreen.propTypes = {
  challenge: PropTypes.object.isRequired,
  onComplete: PropTypes.func.isRequired,
  onJoin: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  acceptedChallenge: PropTypes.object,
};

const mapStateToProps = (reduxState, { navigation }) => ({
  ...(navigation.state.params || {}),
});

const connectedDetailScreen = connect(mapStateToProps)(ChallengeDetailScreen);

export default generateSwipeTabMenuNavigator(
  CHALLENGE_DETAIL_TABS,
  connectedDetailScreen,
);

export const CHALLENGE_DETAIL_SCREEN = 'nav/CHALLENGE_DETAIL';
