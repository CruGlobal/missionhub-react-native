import { ImageSourcePropType } from 'react-native';

import { orgIsGlobal } from '../../../utils/common';
import DEFAULT_MISSIONHUB_IMAGE from '../../../../assets/images/impactBackground.png';
import GLOBAL_COMMUNITY_IMAGE from '../../../../assets/images/globalCommunityImage.png';

export const useCommunityPhoto = (
  communityId: string,
  communityPhotoUrl?: string | null,
  userCreated?: boolean,
): ImageSourcePropType => {
  if (communityPhotoUrl) {
    return { uri: communityPhotoUrl };
  } else if (orgIsGlobal({ id: communityId })) {
    return GLOBAL_COMMUNITY_IMAGE;
  } else if (userCreated) {
    return {};
  } else {
    return DEFAULT_MISSIONHUB_IMAGE;
  }
};
