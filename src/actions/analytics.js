import { MARKETING_CLOUD_ID_CHANGED } from '../constants';

export function setMarketingCloudId(mcId) {
  return {
    type: MARKETING_CLOUD_ID_CHANGED,
    mcId: mcId,
  };
}

