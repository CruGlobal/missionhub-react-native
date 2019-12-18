import { renderHook } from '@testing-library/react-hooks';
import { useNavigationEvents } from 'react-navigation-hooks';

import { trackScreenChange } from '../../../actions/analytics';
import { useAnalytics } from '../useAnalytics';

jest.mock('react-navigation-hooks', () => ({
  useNavigationEvents: jest.fn(),
}));
jest.mock('../../../store', () => ({
  store: {
    dispatch: jest.fn(),
  },
}));
jest.mock('../../../actions/analytics');

let navigationEvent: (event: { type: string }) => void;
const fireEvent = (event: { type: string }) => navigationEvent(event);
const trackScreenChangeResult = { type: 'track screen change' };

const screenFragments = ['screen name', 'subsection'];

beforeEach(() => {
  (trackScreenChange as jest.Mock).mockReturnValue(trackScreenChangeResult);
  (useNavigationEvents as jest.Mock).mockImplementation(
    (callback: (event: { type: string }) => void) => {
      navigationEvent = callback;
    },
  );
});

describe('useAnalytics', () => {
  beforeEach(() => {});

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

  it('tracks screen change and fires additional function on focus', () => {
    const onFocus = jest.fn();

    renderHook(() => useAnalytics(screenFragments, onFocus));

    fireEvent({ type: 'willFocus' });

    expect(trackScreenChange).toHaveBeenCalledWith(screenFragments);
    expect(onFocus).toHaveBeenCalledWith();
  });

  it('tracks screen change and fires additional function with callback', () => {
    const onFocus = jest.fn();

    const { result } = renderHook(() => useAnalytics(screenFragments, onFocus));

    result.current();

    expect(trackScreenChange).toHaveBeenCalledWith(screenFragments);
    expect(onFocus).toHaveBeenCalledWith();
  });
});
