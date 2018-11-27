import React, { Component } from 'react';
import { SectionList } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Flex, Text } from '../../components/common';
import ChallengeItem from '../../components/ChallengeItem';
import { navigatePush } from '../../actions/navigation';
import { completeChallenge, joinChallenge } from '../../actions/challenges';
import { trackActionWithoutData } from '../../actions/analytics';
import { CHALLENGE_DETAIL_SCREEN } from '../ChallengeDetailScreen';
import { ACTIONS } from '../../constants';

import styles from './styles';

class ChallengeFeed extends Component {
  constructor(props) {
    super(props);
    // isListScrolled works around a known issue with SectionList in RN. see commit msg for details.
    this.state = { ...this.state, isListScrolled: false };
  }

  getAcceptedChallenge({ accepted_community_challenges }) {
    return accepted_community_challenges.find(
      c => c.person && c.person.id === this.props.myId,
    );
  }

  renderSectionHeader = ({ section: { title } }) => (
    <Flex style={styles.header} align="center">
      <Text style={styles.title}>{title}</Text>
    </Flex>
  );

  renderItem = ({ item }) => (
    <ChallengeItem
      item={item}
      onComplete={this.handleComplete}
      onJoin={this.handleJoin}
      onSelect={this.handleSelectRow}
      acceptedChallenge={this.getAcceptedChallenge(item)}
    />
  );

  keyExtractor = item => item.id;

  handleOnEndReached = () => {
    if (this.state.isListScrolled && !this.props.refreshing) {
      this.props.loadMoreItemsCallback();
      this.setState({ isListScrolled: false });
    }
  };

  handleEndDrag = () => {
    if (!this.state.isListScrolled) {
      this.setState({ isListScrolled: true });
    }
  };

  handleRefreshing = () => {
    this.props.refreshCallback();
  };

  handleComplete = challenge => {
    const { organization, dispatch } = this.props;
    const accepted_challenge = this.getAcceptedChallenge(challenge);
    if (!accepted_challenge) {
      return;
    }
    dispatch(completeChallenge(accepted_challenge, organization.id));
  };

  handleJoin = challenge => {
    const { organization, dispatch } = this.props;
    dispatch(joinChallenge(challenge, organization.id));
  };

  handleSelectRow = challenge => {
    const { dispatch, organization } = this.props;
    dispatch(
      navigatePush(CHALLENGE_DETAIL_SCREEN, {
        challengeId: challenge.id,
        orgId: organization.id,
      }),
    );
    dispatch(trackActionWithoutData(ACTIONS.CHALLENGE_DETAIL));
  };

  render() {
    const { items, refreshing } = this.props;

    return (
      <SectionList
        sections={items}
        renderSectionHeader={this.renderSectionHeader}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        onEndReachedThreshold={0.2}
        onEndReached={this.handleOnEndReached}
        onScrollEndDrag={this.handleEndDrag}
        onRefresh={this.handleRefreshing}
        refreshing={refreshing || false}
        extraData={this.state}
      />
    );
  }
}

ChallengeFeed.propTypes = {
  items: PropTypes.array.isRequired,
  organization: PropTypes.object.isRequired,
  refreshing: PropTypes.bool,
};

const mapStateToProps = ({ auth }) => ({
  myId: auth.person.id,
});

export default connect(mapStateToProps)(ChallengeFeed);
