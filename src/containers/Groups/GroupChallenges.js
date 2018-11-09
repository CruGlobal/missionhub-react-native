import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import ChallengeFeed from '../ChallengeFeed';
import EmptyChallengeFeed from '../../components/EmptyChallengeFeed';
import {
  getGroupChallengeFeed,
  reloadGroupChallengeFeed,
  createChallenge,
} from '../../actions/challenges';
import { Flex, Button } from '../../components/common';
import { organizationSelector } from '../../selectors/organizations';
import { refresh, isAdminOrOwner } from '../../utils/common';
import { challengesSelector } from '../../selectors/challenges';
import { navigatePush, navigateBack } from '../../actions/navigation';
import { ADD_CHALLENGE_SCREEN } from '../AddChallengeScreen';
import { orgPermissionSelector } from '../../selectors/people';

@translate('groupsChallenge')
export class GroupChallenges extends Component {
  state = { refreshing: false };

  componentDidMount() {
    this.loadItems();
  }

  isEmpty = () => {
    const { challengeItems } = this.props;
    // Data is separated into this format [ { data: [] (active challenges) }, { data: [] (past challenges) }]
    // so we only load the items it they are both blank
    return (
      challengeItems[0].data.length === 0 && challengeItems[1].data.length === 0
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
    const { dispatch, organization } = this.props;
    dispatch(createChallenge(challenge, organization.id));
  };

  create = () => {
    const { dispatch } = this.props;
    dispatch(
      navigatePush(ADD_CHALLENGE_SCREEN, {
        onComplete: challenge => {
          this.createChallenge(challenge);
          dispatch(navigateBack());
        },
      }),
    );
  };

  render() {
    const { refreshing } = this.state;
    const { t, challengeItems, organization, myOrgPermissions } = this.props;

    return (
      <View style={{ flex: 1 }}>
        {!this.isEmpty() ? (
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
        {isAdminOrOwner(myOrgPermissions) ? (
          <Flex align="stretch" justify="end">
            <Button
              type="secondary"
              onPress={this.create}
              text={t('create').toUpperCase()}
            />
          </Flex>
        ) : null}
      </View>
    );
  }
}

export const mapStateToProps = ({ auth, organizations }, { organization }) => {
  const selectorOrg = organizationSelector(
    { organizations },
    { orgId: organization.id },
  );

  const challengeItems = challengesSelector({
    challengeItems: (selectorOrg || {}).challengeItems || [],
  });

  return {
    challengeItems,
    pagination: selectorOrg.challengePagination,
    myOrgPermissions: orgPermissionSelector(null, {
      person: auth.person,
      organization: { id: organization.id },
    }),
  };
};

export default connect(mapStateToProps)(GroupChallenges);
