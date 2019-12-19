import { renderHook } from '@testing-library/react-hooks';
import { useDispatch } from 'react-redux';
import { useNavigationEvents } from 'react-navigation-hooks';

import { trackScreenChange } from '../../../actions/analytics';
import { useAnalytics } from '../useAnalytics';

jest.mock('react-navigation-hooks');
jest.mock('react-redux');
jest.mock('../../../actions/analytics');

let navigationEvent: (event: { type: string }) => void;
const fireEvent = (event: { type: string }) => navigationEvent(event);
const trackScreenChangeResult = { type: 'track screen change' };

const screenFragments = ['screen name', 'subsection'];

beforeEach(() => {
  (trackScreenChange as jest.Mock).mockReturnValue(trackScreenChangeResult);
  (useDispatch as jest.Mock).mockReturnValue(jest.fn());
  (useNavigationEvents as jest.Mock).mockImplementation(
    (callback: (event: { type: string }) => void) => {
      navigationEvent = callback;
    },
  );
});

describe('useAnalytics', () => {
  it('tracks screen change on focus', () => {
    renderHook(() => useAnalytics(screenFragments));

    fireEvent({ type: 'willFocus' });

    expect(trackScreenChange).toHaveBeenCalledWith(screenFragments);
  });

  it('tracks screen change with callback', () => {
    const { result } = renderHook(() => useAnalytics(screenFragments));

    result.current();

    expect(trackScreenChange).toHaveBeenCalledWith(screenFragments);
  });
});
