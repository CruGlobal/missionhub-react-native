import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { navigateBack } from '../../actions/navigation';
import { Text, IconButton, Button } from '../../components/common';
import Header from '../Header';

import styles from './styles';

@translate('challengeFeeds')
class ChallengeDetailScreen extends Component {
  handleCancel = () => {
    this.props.dispatch(navigateBack());
  };

  handleJoin = () => {};

  handleComplete = () => {};

  render() {
    const { t, joined, completed } = this.props;
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

const mapStateToProps = (reduxState, { acceptedChallenge }) => ({
  joined: !!acceptedChallenge,
  completed: !!(acceptedChallenge && acceptedChallenge.completed_at),
});

export default connect(mapStateToProps)(ChallengeDetailScreen);
export const CHALLENGE_DETAIL_SCREEN = 'nav/CHALLENGE_DETAIL';
