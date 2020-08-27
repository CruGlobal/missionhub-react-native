import { renderHookWithContext } from '../../../testUtils';
import { useAuthSuccess } from '../authHooks';
import { logInAnalytics } from '../../actions/analytics';
import { rollbar } from '../../utils/rollbar.config';
import { loadAuthPerson } from '../authUtilities';
import { getFeatureFlags } from '../../actions/misc';
import { updateLocaleAndTimezone } from '../../actions/auth/userData';
import { requestNativePermissions } from '../../actions/notifications';

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

const personId = '593348';
const globalRegistryMdmId = 'c6e4fdcf-d638-46b7-a02b-8c6c1cc4af23';

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
