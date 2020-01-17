import React, { Component } from 'react';
import { SectionList, View } from 'react-native';
import { connect } from 'react-redux-legacy';
import PropTypes from 'prop-types';

import { Text } from '../../components/common';
import ChallengeItem from '../../components/ChallengeItem';
import OnboardingCard, {
  GROUP_ONBOARDING_TYPES,
} from '../Groups/OnboardingCard';
import { navigatePush } from '../../actions/navigation';
import { completeChallenge, joinChallenge } from '../../actions/challenges';
import { trackActionWithoutData } from '../../actions/analytics';
import { CHALLENGE_DETAIL_SCREEN } from '../ChallengeDetailScreen';
import { ACTIONS, GLOBAL_COMMUNITY_ID } from '../../constants';
import { keyExtractorId } from '../../utils/common';

import styles from './styles';

class ChallengeFeed extends Component {
  // @ts-ignore
  constructor(props) {
    super(props);
    // isListScrolled works around a known issue with SectionList in RN. see commit msg for details.
    this.state = { ...this.state, isListScrolled: false };
  }

  // @ts-ignore
  getAcceptedChallenge({ accepted_community_challenges }) {
    return accepted_community_challenges.find(
      // @ts-ignore
      c => c.person && c.person.id === this.props.myId,
    );
  }

  // @ts-ignore
  renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );

  // @ts-ignore
  renderItem = ({ item }) => (
    <ChallengeItem
      item={item}
      onComplete={this.handleComplete}
      onJoin={this.handleJoin}
      onSelect={this.handleSelectRow}
      acceptedChallenge={this.getAcceptedChallenge(item)}
    />
  );

  handleOnEndReached = () => {
    // @ts-ignore
    if (this.state.isListScrolled && !this.props.refreshing) {
      // @ts-ignore
      this.props.loadMoreItemsCallback();
      this.setState({ isListScrolled: false });
    }
  };

  handleEndDrag = () => {
    // @ts-ignore
    if (!this.state.isListScrolled) {
      this.setState({ isListScrolled: true });
    }
  };

  handleRefreshing = () => {
    // @ts-ignore
    this.props.refreshCallback();
  };

  // @ts-ignore
  handleComplete = challenge => {
    // @ts-ignore
    const { organization, dispatch } = this.props;
    const accepted_challenge = this.getAcceptedChallenge(challenge);
    if (!accepted_challenge) {
      return;
    }
    dispatch(completeChallenge(accepted_challenge, organization.id));
  };

  // @ts-ignore
  handleJoin = challenge => {
    // @ts-ignore
    const { organization, dispatch } = this.props;
    dispatch(joinChallenge(challenge, organization.id));
  };

  // @ts-ignore
  handleSelectRow = challenge => {
    // @ts-ignore
    const { dispatch, organization } = this.props;

    if (organization.id !== GLOBAL_COMMUNITY_ID) {
      dispatch(
        navigatePush(CHALLENGE_DETAIL_SCREEN, {
          challengeId: challenge.id,
          orgId: organization.id,
        }),
      );
      dispatch(trackActionWithoutData(ACTIONS.CHALLENGE_DETAIL));
    }
  };

  renderHeader = () => (
    // @ts-ignore
    <OnboardingCard type={GROUP_ONBOARDING_TYPES.challenges} />
  );

  render() {
    // @ts-ignore
    const { items, refreshing, extraPadding } = this.props;

    return (
      <SectionList
        sections={items}
        ListHeaderComponent={this.renderHeader}
        // @ts-ignore
        renderSectionHeader={this.renderSectionHeader}
        renderItem={this.renderItem}
        keyExtractor={keyExtractorId}
        onEndReachedThreshold={0.2}
        onEndReached={this.handleOnEndReached}
        onScrollEndDrag={this.handleEndDrag}
        onRefresh={this.handleRefreshing}
        refreshing={refreshing || false}
        extraData={this.state}
        contentContainerStyle={[
          styles.list,
          extraPadding ? styles.listExtraPadding : null,
        ]}
      />
    );
  }
}

// @ts-ignore
ChallengeFeed.propTypes = {
  items: PropTypes.array.isRequired,
  organization: PropTypes.object.isRequired,
  refreshing: PropTypes.bool,
  extraPadding: PropTypes.bool,
};

// @ts-ignore
const mapStateToProps = ({ auth }) => ({
  myId: auth.person.id,
});

export default connect(mapStateToProps)(ChallengeFeed);
