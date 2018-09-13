import React, { Component } from 'react';
import { SectionList } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Flex, Text } from '../../components/common';
import ChallengeItem from '../../components/ChallengeItem';
import { orgPermissionSelector } from '../../selectors/people';
import { ORG_PERMISSIONS } from '../../constants';
// import { completeChallenge, joinChallenge } from '../../actions/challenges';
import { navigatePush } from '../../actions/navigation';
import { ADD_CHALLENGE_SCREEN } from '../AddChallengeScreen';

import styles from './styles';

class ChallengeFeed extends Component {
  constructor(props) {
    super(props);
    // isListScrolled works around a known issue with SectionList in RN. see commit msg for details.
    this.state = { ...this.state, isListScrolled: false };
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
      onEdit={this.props.canEditChallenges ? this.handleEdit : undefined}
    />
  );

  keyExtractor = item => item.id;

  handleOnEndReached = () => {
    if (this.state.isListScrolled) {
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

  handleComplete = item => {
    // TODO: Implement this once the API is ready
    return item;
    // const { organization, dispatch } = this.props;
    // dispatch(completeChallenge(item, organization.id));
  };
  handleJoin = item => {
    // TODO: Implement this once the API is ready
    return item;
    // const { organization, dispatch } = this.props;
    // dispatch(joinChallenge(item, organization.id));
    // this.props.dispatch(
    //   navigatePush(ADD_CHALLENGE_SCREEN, {
    //     onComplete: () => {
    //       console.log('complete');
    //     },
    //   }),
    // );
  };

  editChallenge = challenge => {
    // TODO: API call to edit challenge
    return challenge;
  };

  handleEdit = item => {
    this.props.dispatch(
      navigatePush(ADD_CHALLENGE_SCREEN, {
        isEdit: true,
        challenge: item,
        onComplete: this.editChallenge,
      }),
    );
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

const mapStateToProps = ({ auth }, { organization }) => {
  const myOrgPerm =
    auth &&
    organization &&
    organization.id &&
    orgPermissionSelector(null, {
      person: auth.person,
      organization: { id: organization.id },
    });
  let canEditChallenges =
    myOrgPerm && myOrgPerm.permission_id === ORG_PERMISSIONS.ADMIN;
  return {
    canEditChallenges,
  };
};
export default connect(mapStateToProps)(ChallengeFeed);
