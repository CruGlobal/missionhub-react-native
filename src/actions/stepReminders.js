import i18next from 'i18next';

import {
  TOGGLE_STEP_FOCUS,
  COMPLETED_STEP_COUNT,
  STEP_NOTE,
  ACTIONS,
  DEFAULT_PAGE_LIMIT,
  ACCEPTED_STEP,
} from '../constants';
import {
  buildTrackingObj,
  formatApiDate,
  getAnalyticsSubsection,
  isCustomStep,
} from '../utils/common';
import {
  COMPLETE_STEP_FLOW,
  COMPLETE_STEP_FLOW_NAVIGATE_BACK,
} from '../routes/constants';

import { refreshImpact } from './impact';
import { navigatePush } from './navigation';
import callApi, { REQUESTS } from './api';
import { trackAction, trackStepAdded } from './analytics';
import { reloadGroupCelebrateFeed } from './celebration';

export function createStepReminder(challenge_id, at, type = 'once') {
  return dispatch => {
    const payload = {
      data: {
        type: 'accepted_challenge_reminder',
        attributes: {
          type,
          at: type === 'once' ? at.toISOString() : at,
        },
      },
    };

    console.log(challenge_id);
    console.log(payload);

    return dispatch(
      callApi(REQUESTS.CREATE_CHALLENGE_REMINDER, { challenge_id }, payload),
    );
  };
}
