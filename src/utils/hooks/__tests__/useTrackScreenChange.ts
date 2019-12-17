import { renderHook } from '@testing-library/react-hooks';
import { useNavigation } from 'react-navigation-hooks';

import { trackScreenChange } from '../../../actions/analytics';
import { useTrackScreenChange } from '../useTrackScreenChange';

jest.mock('react-navigation-hooks', () => ({
  useNavigation: jest.fn(),
}));
jest.mock('../../../store', () => ({
  store: {
    dispatch: jest.fn(),
  },
}));
jest.mock('../../../actions/analytics');

const events: { [key: string]: () => void } = {};
const fireEvent = (eventName: string) => events[eventName]();
const trackScreenChangeResult = { type: 'track screen change' };
const remove = jest.fn();
let navigation: { addListener: jest.Mock };

const screenFragments = ['screen name', 'subsection'];

beforeEach(() => {
  navigation = {
    addListener: jest
      .fn()
      .mockImplementation((eventName: string, listener: () => void) => {
        events[eventName] = listener;
        return { remove };
      }),
  };

  (trackScreenChange as jest.Mock).mockReturnValue(trackScreenChangeResult);
  (useNavigation as jest.Mock).mockReturnValue(navigation);
});

describe('useTrackScreenChange', () => {
  beforeEach(() => {
    renderHook(() => useTrackScreenChange(screenFragments));
  });

  it('on mount, setup listener', () => {
    expect(navigation.addListener).toHaveBeenCalledWith(
      'willFocus',
      expect.any(Function),
    );
  });

  it('on focus, track screen', () => {
    fireEvent('willFocus');

    expect(trackScreenChange).toHaveBeenCalledWith(screenFragments);
  });
});
