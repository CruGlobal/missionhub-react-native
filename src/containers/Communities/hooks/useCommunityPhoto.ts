import { ImageSourcePropType } from 'react-native';

import { orgIsGlobal } from '../../../utils/common';
import GLOBAL_COMMUNITY_IMAGE from '../../../../assets/images/globalCommunityImage.png';

export const useCommunityPhoto = (
  communityId: string,
  communityPhotoUrl?: string | null,
): ImageSourcePropType => {
  if (communityPhotoUrl) {
    return { uri: communityPhotoUrl };
  } else if (orgIsGlobal({ id: communityId })) {
    return GLOBAL_COMMUNITY_IMAGE;
  } else {
    return {};
  }
};
