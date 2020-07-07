import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';

import ChallengeFeed from '../ChallengeFeed';
import {
  getGroupChallengeFeed,
  reloadGroupChallengeFeed,
  createChallenge,
} from '../../actions/challenges';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { TrackStateContext } from '../../actions/analytics';
import BottomButton from '../../components/BottomButton';
import { organizationSelector } from '../../selectors/organizations';
import { isAdminOrOwner } from '../../utils/common';
import { ANALYTICS_PERMISSION_TYPE } from '../../constants';
import { challengesSelector } from '../../selectors/challenges';
import { navigatePush } from '../../actions/navigation';
import { refreshCommunity } from '../../actions/organizations';
import { ADD_CHALLENGE_SCREEN } from '../AddChallengeScreen';
import { orgPermissionSelector } from '../../selectors/people';
import { ChallengeItem } from '../../components/ChallengeStats';
import { CommunitiesCollapsibleHeaderContext } from '../Communities/Community/CommunityHeader/CommunityHeader';
import { OrganizationsState } from '../../reducers/organizations';
import { RootState } from '../../reducers';

import styles from './styles';

type permissionType = TrackStateContext[typeof ANALYTICS_PERMISSION_TYPE];

const GroupChallenges = () => {
  const { t } = useTranslation('groupsChallenge');
  const dispatch = useDispatch();
  const communityId = useNavigationParam('communityId');
  const [refreshing, changeRefreshing] = useState(false);
  useEffect(() => {
    dispatch(getGroupChallengeFeed(communityId));
  }, []);

  const loadItems = () => {
    dispatch(getGroupChallengeFeed(communityId));
  };

  const organization = useSelector(
    ({ organizations }: { organizations: OrganizationsState }) =>
      organizationSelector({ organizations }, { orgId: communityId }),
  );
  const myOrgPermission = useSelector(({ auth }: RootState) =>
    orgPermissionSelector({}, { person: auth.person, organization }),
  );

  useAnalytics(['community', 'challenges'], {
    permissionType: { communityId: organization.id },
  });

  const challengeItems = useSelector(() =>
    challengesSelector(
      {
        challengeItems: organization.challengeItems || [],
      },
      {},
    ),
  );

  const canCreate = isAdminOrOwner(myOrgPermission);

  const reloadItems = async () => {
    changeRefreshing(true);
    dispatch(refreshCommunity(communityId));
    await dispatch(reloadGroupChallengeFeed(communityId));
    changeRefreshing(false);
  };

  const create = () => {
    dispatch(
      navigatePush(ADD_CHALLENGE_SCREEN, {
        communityId: organization.id,
        onComplete: (challenge: ChallengeItem) => {
          dispatch(createChallenge(challenge, communityId));
        },
      }),
    );
  };

  return (
    <>
      <View style={styles.cardList}>
        <CommunitiesCollapsibleHeaderContext.Consumer>
          {({ collapsibleScrollViewProps }) => (
            <ChallengeFeed
              organization={organization}
              items={challengeItems}
              loadMoreItemsCallback={loadItems}
              refreshCallback={reloadItems}
              refreshing={refreshing}
              extraPadding={canCreate}
              collapsibleScrollViewProps={collapsibleScrollViewProps}
            />
          )}
        </CommunitiesCollapsibleHeaderContext.Consumer>
      </View>
      {canCreate ? (
        <BottomButton
          testID="createButton"
          onPress={create}
          text={t('create')}
        />
      ) : null}
    </>
  );
};

export default GroupChallenges;

export const COMMUNITY_CHALLENGES = 'nav/COMMUNITY_CHALLENGES';
