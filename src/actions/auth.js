import { THE_KEY_CLIENT_ID, LOGOUT, FIRST_TIME } from '../constants';
import { navigatePush, navigateReset } from './navigation';
import { getMe, getPerson } from './people';
import { getStages } from './stages';
import { clearAllScheduledNotifications, setupPushNotifications } from './notifications';
import callApi, { REQUESTS } from './api';
import { updateLoggedInStatus } from './analytics';

export function facebookLoginAction(accessToken) {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.FACEBOOK_LOGIN, {}, {
      fb_access_token: accessToken,
    })).then((results) => {
      LOG(results);
      return dispatch(onSuccessfulLogin());
    }).catch((error) => {
      LOG('error logging in', error);
    });
  };
}

export function keyLogin(email, password) {
  const data = `grant_type=password&client_id=${THE_KEY_CLIENT_ID}&scope=fullticket%20extended&username=${email}&password=${password}`;

  return async(dispatch) => {
    await dispatch(callApi(REQUESTS.KEY_LOGIN, {}, data));

    return dispatch(getKeyTicket());
  };
}

function getKeyTicket() {
  return async(dispatch) => {
    const keyTicketResult = await dispatch(callApi(REQUESTS.KEY_GET_TICKET, {}, {}));

    const data = { code: keyTicketResult.ticket };
    await dispatch(callApi(REQUESTS.TICKET_LOGIN, {}, data));

    dispatch(updateLoggedInStatus(true));
    return dispatch(onSuccessfulLogin());
  };
}

export function onSuccessfulLogin() {
  return async(dispatch, getState) => {
    const personId = getState().auth.personId;
    const getMeResult = await dispatch(getPerson(personId));

    let nextScreen = 'GetStarted';
    if (getMeResult.findAll('user')[0].pathway_stage_id) {

      if (hasPersonWithStageSelected(getMeResult.find('person', personId))) {
        nextScreen = 'MainTabs';
      } else {
        nextScreen = 'AddSomeone';
      }
    }

    return dispatch(navigatePush(nextScreen));
  };
}

function hasPersonWithStageSelected(person) {
  return person.contact_assignments.some((contact) => contact.pathway_stage_id);
}

export function logout() {
  return (dispatch) => {
    dispatch({ type: LOGOUT });
    dispatch(navigateReset('Login'));
    dispatch(clearAllScheduledNotifications());
  };
}

export function firstTime() {
  return (dispatch) => {
    dispatch({ type: FIRST_TIME });
  };
}

export function loadHome() {
  return (dispatch) => {
    // TODO: Set this up so it only loads these if it hasn't loaded them in X amount of time
    dispatch(setupPushNotifications());
    dispatch(getMe());
    dispatch(getStages());
  };
}
