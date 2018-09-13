import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import ChallengeFeed from '../ChallengeFeed';
import EmptyChallengeFeed from '../../components/EmptyChallengeFeed';
import {
  getGroupChallengeFeed,
  reloadGroupChallengeFeed,
} from '../../actions/challenges';
import { Flex, Button } from '../../components/common';
import { organizationSelector } from '../../selectors/organizations';
import { refresh } from '../../utils/common';
import { challengesSelector } from '../../selectors/challenges';
import { navigatePush } from '../../actions/navigation';
import { ADD_CHALLENGE_SCREEN } from '../AddChallengeScreen';

@translate('groupsChallenge')
export class GroupChallenges extends Component {
  state = { refreshing: false };

  componentDidMount() {
    // TODO: Implement this once the API is ready
    // if (this.shouldLoadFeed()) {
    //   this.loadItems();
    // }
  }

  shouldLoadFeed = () => {
    const { pagination, challengeItems } = this.props;

    return (
      !challengeItems || challengeItems.length === 0 || pagination.page === 0
    );
  };

  loadItems = () => {
    const { dispatch, organization } = this.props;
    dispatch(getGroupChallengeFeed(organization.id));
  };

  reloadItems = () => {
    const { dispatch, organization } = this.props;
    return dispatch(reloadGroupChallengeFeed(organization.id));
  };

  refreshItems = () => {
    refresh(this, this.reloadItems);
  };

  createChallenge = challenge => {
    // TODO: API call to create the challenge
    return challenge;
  };

  create = () => {
    this.props.dispatch(
      navigatePush(ADD_CHALLENGE_SCREEN, {
        onComplete: this.createChallenge,
      }),
    );
  };

  render() {
    const { refreshing } = this.state;
    const { t, challengeItems, organization } = this.props;

    return (
      <View style={{ flex: 1 }}>
        {challengeItems.length !== 0 ? (
          <ChallengeFeed
            organization={organization}
            items={challengeItems}
            loadMoreItemsCallback={this.loadItems}
            refreshCallback={this.refreshItems}
            refreshing={refreshing}
          />
        ) : (
          <EmptyChallengeFeed
            refreshCallback={this.refreshItems}
            refreshing={refreshing}
          />
        )}
        <Flex align="stretch" justify="end">
          <Button
            type="secondary"
            onPress={this.create}
            text={t('create').toUpperCase()}
          />
        </Flex>
      </View>
    );
  }
}

export const mapStateToProps = ({ organizations }, { organization }) => {
  const selectorOrg = organizationSelector(
    { organizations },
    { orgId: organization.id },
  );

  const orgChallenges = [
    {
      id: '1',
      creator_id: 'person1',
      organization_id: organization.id,
      title: 'Read "There and Back Again"',
      end_date: '2018-09-30T23:59:59Z',
      accepted: 5,
      completed: 3,
      days_remaining: 14,
    },
    {
      id: '2',
      creator_id: 'person2',
      organization_id: organization.id,
      title: 'Invite a neighbor over for mince pie.',
      end_date: '2018-10-06T23:59:59Z',
      accepted: 5,
      completed: 3,
      days_remaining: 14,
      accepted_at: '2018-09-06T14:13:21Z',
    },
    {
      id: '3',
      creator_id: 'person3',
      organization_id: organization.id,
      title: 'Invite Smeagol over for fresh fish',
      end_date: '2018-09-06T14:13:21Z',
      accepted: 5,
      completed: 0,
      days_remaining: 0,
      total_days: 7,
    },
    {
      id: '4',
      creator_id: 'person4',
      organization_id: organization.id,
      title: 'Who can wear the ring the longest.',
      end_date: '2018-09-06T14:13:21Z',
      accepted: 5,
      completed: 3,
      days_remaining: 0,
      total_days: 7,
      accepted_at: '2018-09-06T14:13:21Z',
      completed_at: '2018-09-06T14:13:21Z',
    },
  ];

  const challengeItems = challengesSelector({
    challengeItems: (selectorOrg || {}).challengeItems || orgChallenges,
  });

  return {
    challengeItems,
    pagination: selectorOrg.challengePagination,
  };
};

export default connect(mapStateToProps)(GroupChallenges);
