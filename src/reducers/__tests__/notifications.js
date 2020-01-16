import notifications from '../notifications';
import { LOGOUT } from '../../constants';
import { REQUESTS } from '../../api/routes';

it('should update push device', () => {
  const pushDevice = { id: '9', token: 'some token' };
  const state = notifications(
    {},
    {
      type: REQUESTS.SET_PUSH_TOKEN.SUCCESS,
      results: {
        response: pushDevice,
      },
    },
  );
  expect(state.pushDevice).toEqual(pushDevice);
});

it('resets state on logout', () => {
  const expectedState = {
    pushDevice: {},
    requestedNativePermissions: true,
    showReminderOnLoad: true,
    hasShownWelcomeNotification: false,
  };
  const state = notifications(
    {
      requestedNativePermissions: true,
    },
    {
      type: LOGOUT,
    },
  );
  expect(state).toEqual(expectedState);
});

it('resets state on logout', () => {
  const state = notifications(
    {},
    {
      type: null,
    },
  );
  expect(state).toEqual({});
});
