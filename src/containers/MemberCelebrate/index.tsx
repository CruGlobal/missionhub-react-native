import React from 'react';

import { CelebrateFeed } from '../CelebrateFeed';
import { useAnalytics } from '../../utils/hooks/useAnalytics';

export interface MemberCelebrateProps {
  communityId: string;
  personId: string;
}

const MemberCelebrate = ({ communityId, personId }: MemberCelebrateProps) => {
  useAnalytics(
    ['person', 'celebrate'],
    {},
    {
      includeAssignmentType: true,
    },
  );

  return (
    <CelebrateFeed
      communityId={communityId}
      personId={personId}
      itemNamePressable={false}
    />
  );
};

export default MemberCelebrate;
