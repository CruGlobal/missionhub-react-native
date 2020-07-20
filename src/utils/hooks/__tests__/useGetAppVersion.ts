import DeviceInfo from 'react-native-device-info';
import { renderHook } from '@testing-library/react-hooks';

import { useGetAppVersion } from '../useGetAppVersion';

jest.mock('react-native-device-info');

beforeAll(() => {
  (DeviceInfo.getVersion as jest.Mock).mockReturnValue('5.4.1');
});

describe('useGetAppVersion', () => {
  it('returns the app version', () => {
    const { result } = renderHook(() => useGetAppVersion());
    expect(result.current).toEqual('5.4.1');
  });
});
