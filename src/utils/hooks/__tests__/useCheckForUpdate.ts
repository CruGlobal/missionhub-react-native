import DeviceInfo from 'react-native-device-info';
// eslint-disable-next-line import/default
import VersionCheck from 'react-native-version-check';
import { renderHook } from '@testing-library/react-hooks';

import { useCheckForUpdate } from '../useCheckForUpdate';

jest.mock('react-native-device-info');
jest.mock('react-native-version-check');

beforeEach(() => {
  (DeviceInfo.getVersion as jest.Mock).mockReturnValue('5.4.1');
  (VersionCheck.getLatestVersion as jest.Mock).mockReturnValue('5.4.1');
});

describe('useCheckForUpdate', () => {
  it('returns false if users version is latest version', () => {
    const { result } = renderHook(() => useCheckForUpdate());

    expect(result.current).toEqual(false);
  });

  it('returns true if users version is not latest version', async () => {
    (DeviceInfo.getVersion as jest.Mock).mockReturnValue('5.4.0');

    const { result, waitForNextUpdate } = renderHook(() => useCheckForUpdate());
    await waitForNextUpdate();
    expect(result.current).toEqual(true);
  });
});
