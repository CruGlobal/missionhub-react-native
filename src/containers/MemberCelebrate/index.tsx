import React from 'react';
import { connect } from 'react-redux-legacy';

import { TrackStateContext } from '../../actions/analytics';
import { getAnalyticsAssignmentType } from '../../utils/analytics';
import { CelebrateFeed } from '../CelebrateFeed';
import { ANALYTICS_ASSIGNMENT_TYPE } from '../../constants';
import { organizationSelector } from '../../selectors/organizations';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { personSelector } from '../../selectors/people';
import { RootState } from '../../reducers';

export interface MemberCelebrateProps {
  communityId: string;
  personId: string;
  analyticsAssignmentType: TrackStateContext[typeof ANALYTICS_ASSIGNMENT_TYPE];
}

const MemberCelebrate = ({
  communityId,
  personId,
  analyticsAssignmentType,
}: MemberCelebrateProps) => {
  useAnalytics(['person', 'celebrate'], {
    screenContext: { [ANALYTICS_ASSIGNMENT_TYPE]: analyticsAssignmentType },
  });

  return (
    <CelebrateFeed
      communityId={communityId}
      personId={personId}
      itemNamePressable={false}
    />
  );
};

const mapStateToProps = (
  { auth, organizations, people }: RootState,
  { personId, communityId }: { personId: string; communityId: string },
) => {
  const selectorOrg = organizationSelector(
    { organizations },
    { orgId: communityId },
  );
  const person = personSelector({ people }, { personId });

  return {
    analyticsAssignmentType: getAnalyticsAssignmentType(
      person,
      auth,
      selectorOrg,
    ),
  };
};

export default connect(mapStateToProps)(MemberCelebrate);
