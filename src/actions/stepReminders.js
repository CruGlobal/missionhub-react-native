import callApi, { REQUESTS } from './api';

export function removeStepReminder(stepId) {
  return dispatch => {
    const query = { challenge_id: stepId };

    return dispatch(callApi(REQUESTS.CHALLENGE_REMINDER_DELETE, query));
  };
}
