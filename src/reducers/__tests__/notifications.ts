import { HAS_SHOWN_NOTIFICATION_PROMPT } from '../../actions/notifications';
import notifications, { PushDevice } from '../notifications';
import { LOGOUT } from '../../constants';
import { REQUESTS } from '../../api/routes';

const pushDevice: PushDevice = {
  id: '9',
  token: 'some token',
  platform: 'GCM',
  user: {
    id: '1',
    __type: 'user',
  },
};

it('should update push device', () => {
  const pushDevice = { id: '9', token: 'some token' };
  const state = notifications(undefined, {
    type: REQUESTS.SET_PUSH_TOKEN.SUCCESS,
    results: {
      response: pushDevice,
    },
  });
  expect(state).toEqual({
    pushDevice,
    appHasShownPrompt: false,
  });
});

it('should delete push device', () => {
  const state = notifications(undefined, {
    type: REQUESTS.DELETE_PUSH_TOKEN.SUCCESS,
  });
  expect(state).toEqual({
    pushDevice: null,
    appHasShownPrompt: false,
  });
});

it('should set appHasShownPrompt', () => {
  const state = notifications(undefined, {
    type: HAS_SHOWN_NOTIFICATION_PROMPT,
  });
  expect(state).toEqual({
    pushDevice: null,
    appHasShownPrompt: true,
  });
});

it('resets state on logout', () => {
  const state = notifications(
    {
      pushDevice,
      appHasShownPrompt: true,
    },
    {
      type: LOGOUT,
    },
  );
  expect(state).toEqual({
    pushDevice: null,
    appHasShownPrompt: true,
  });
});
