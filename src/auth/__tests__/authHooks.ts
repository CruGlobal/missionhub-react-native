import { flushMicrotasksQueue } from 'react-native-testing-library';
import { renderHook } from '@testing-library/react-hooks';

import { renderHookWithContext } from '../../../testUtils';
import {
  useAuthSuccess,
  useAuthPerson,
  useAuthUser,
  useIsAnonymousUser,
} from '../authHooks';
import { logInAnalytics } from '../../actions/analytics';
import { rollbar } from '../../utils/rollbar.config';
import { loadAuthPerson } from '../authUtilities';
import { getFeatureFlags } from '../../actions/misc';
import { updateLocaleAndTimezone } from '../../actions/auth/userData';
import { requestNativePermissions } from '../../actions/notifications';
import { getAnonymousUid } from '../authStore';

jest.mock('../authUtilities');
jest.mock('../../actions/analytics', () => ({
  logInAnalytics: jest.fn(() => ({ type: 'logInAnalytics' })),
}));
jest.mock('../../actions/misc');
jest.mock('../../actions/auth/userData', () => ({
  updateLocaleAndTimezone: jest.fn(() => ({ type: 'updateLocaleAndTimezone' })),
}));
jest.mock('../../utils/common', () => ({
  // @ts-ignore
  ...jest.requireActual('../../utils/common'),
  isAndroid: true,
}));
jest.mock('../../actions/notifications', () => ({
  requestNativePermissions: jest.fn(() => ({
    type: 'requestNativePermissions',
  })),
}));
jest.mock('../../auth/authStore', () => ({
  isAuthenticated: () => true,
  getAnonymousUid: jest.fn(),
}));

const personId = '593348';
const globalRegistryMdmId = 'c6e4fdcf-d638-46b7-a02b-8c6c1cc4af23';

describe('useAuthPerson', () => {
  it('should load the auth person', async () => {
    const { result } = renderHookWithContext(() => useAuthPerson());

    await flushMicrotasksQueue();

    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "__typename": "Person",
        "fbUid": "ratione ut sunt",
        "firstName": "Hayden",
        "fullName": "Hayden Zieme",
        "globalRegistryMdmId": "consequuntur corporis repellat",
        "id": "2",
        "lastName": "Zieme",
        "stage": Object {
          "__typename": "Stage",
          "id": "3",
          "selfFollowupDescription": "quisquam recusandae alias",
        },
        "theKeyUid": "qui amet iure",
      }
    `);
  });
});

describe('useAuthUser', () => {
  it('should load the auth user', async () => {
    const { result } = renderHookWithContext(() => useAuthUser());

    await flushMicrotasksQueue();

    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "__typename": "User",
        "id": "1",
        "person": Object {
          "__typename": "Person",
          "fbUid": "ratione ut sunt",
          "firstName": "Hayden",
          "fullName": "Hayden Zieme",
          "globalRegistryMdmId": "consequuntur corporis repellat",
          "id": "2",
          "lastName": "Zieme",
          "stage": Object {
            "__typename": "Stage",
            "id": "3",
            "selfFollowupDescription": "quisquam recusandae alias",
          },
          "theKeyUid": "qui amet iure",
        },
      }
    `);
  });
});

describe('useIsAnonymousUser', () => {
  it('should return true if anonymousUid is set', async () => {
    (getAnonymousUid as jest.Mock).mockResolvedValue('test token');
    const { result } = renderHook(() => useIsAnonymousUser());

    await flushMicrotasksQueue();

    expect(result.current).toEqual(true);
  });

  it('should return false if anonymousUid is not set', async () => {
    (getAnonymousUid as jest.Mock).mockResolvedValue(null);
    const { result } = renderHook(() => useIsAnonymousUser());

    await flushMicrotasksQueue();

    expect(result.current).toEqual(false);
  });
});

describe('useAuthSuccess', () => {
  it('should load needed data and setup context variables', async () => {
    (loadAuthPerson as jest.Mock).mockReturnValue({
      id: personId,
      globalRegistryMdmId,
    });

    const { result } = renderHookWithContext(() => useAuthSuccess());
    await result.current();

    expect(loadAuthPerson).toHaveBeenCalledWith('network-only');
    expect(logInAnalytics).toHaveBeenCalled();
    expect(rollbar.setPerson).toHaveBeenCalledWith(personId);
    expect(getFeatureFlags).toHaveBeenCalled();
    expect(updateLocaleAndTimezone).toHaveBeenCalled();
    expect(requestNativePermissions).toHaveBeenCalled();
  });
});
