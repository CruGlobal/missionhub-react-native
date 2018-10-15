import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { navigateBack } from '../../actions/navigation';
import { Text, IconButton, Button } from '../../components/common';
import Header from '../Header';

import styles from './styles';

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

export default connect(mapStateToProps)(ChallengeDetailScreen);
export const CHALLENGE_DETAIL_SCREEN = 'nav/CHALLENGE_DETAIL';
