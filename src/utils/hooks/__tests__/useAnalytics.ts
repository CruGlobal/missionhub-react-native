import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from 'react-navigation-hooks';
import { useQuery } from '@apollo/react-hooks';

import { trackScreenChange } from '../../../actions/analytics';
import { useAnalytics, ANALYTICS_SCREEN_TYPES } from '../useAnalytics';
import { renderHookWithContext } from '../../../../testUtils';

jest.mock('react-navigation-hooks');
jest.mock('react-redux');
jest.mock('@apollo/react-hooks');
jest.mock('../../../actions/analytics');

const trackScreenChangeResult = { type: 'track screen change' };

const screenFragments = ['screen name', 'subsection'];
const initialState = {
  auth: { person: { id: '1' } },
  onboarding: { currentlyOnboarding: true },
};

beforeEach(() => {
  (trackScreenChange as jest.Mock).mockReturnValue(trackScreenChangeResult);
  (useDispatch as jest.Mock).mockReturnValue(jest.fn());
  (useQuery as jest.Mock).mockReturnValue({
    data: { community: { people: { edges: [] } } },
  });
});

const fireFocus = (isFocused: boolean, rerender: () => void) => {
  (useIsFocused as jest.Mock).mockReturnValue(isFocused);
  rerender();
};

const fireDrawer = (isOpen: boolean, rerender: () => void) => {
  (useSelector as jest.Mock).mockReturnValue(isOpen);
  rerender();
};

describe('useAnalytics', () => {
  describe('default: screenType is "screen"', () => {
    it('tracks screen change on focus with drawer already open', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useSelector as jest.Mock).mockReturnValue(true);

      const { rerender } = renderHookWithContext(
        () => useAnalytics(screenFragments),
        {
          initialState,
        },
      );

      expect(trackScreenChange).not.toHaveBeenCalled();

      fireFocus(true, rerender);

      expect(trackScreenChange).toHaveBeenCalledWith(
        screenFragments,
        undefined,
      );
    });

    it('tracks screen change on focus with drawer already closed', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useSelector as jest.Mock).mockReturnValue(false);

      const { rerender } = renderHookWithContext(
        () => useAnalytics(screenFragments),
        { initialState },
      );

      expect(trackScreenChange).not.toHaveBeenCalled();

      fireFocus(true, rerender);

      expect(trackScreenChange).toHaveBeenCalledWith(
        screenFragments,
        undefined,
      );
    });

    it('does not track screen change on drawer open', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useSelector as jest.Mock).mockReturnValue(false);

      const { rerender } = renderHookWithContext(
        () => useAnalytics(screenFragments),
        { initialState },
      );

      fireFocus(true, rerender);

      jest.clearAllMocks();

      fireDrawer(true, rerender);

      expect(trackScreenChange).not.toHaveBeenCalled();
    });

    it('does not track screen change on drawer close', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useSelector as jest.Mock).mockReturnValue(true);

      const { rerender } = renderHookWithContext(
        () => useAnalytics(screenFragments),
        { initialState },
      );

      fireFocus(true, rerender);

      jest.clearAllMocks();

      fireDrawer(false, rerender);

      expect(trackScreenChange).not.toHaveBeenCalled();
    });

    it('tracks screen change with callback', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useSelector as jest.Mock).mockReturnValue(false);

      const { result } = renderHookWithContext(
        () => useAnalytics(screenFragments),
        { initialState },
      );

      result.current(screenFragments);

      expect(trackScreenChange).toHaveBeenCalledWith(
        screenFragments,
        undefined,
      );
    });
  });

  describe('screenType is "screenWithDrawer"', () => {
    it('does not track screen change on focus with drawer already open', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useSelector as jest.Mock).mockReturnValue(true);

      const { rerender } = renderHookWithContext(
        () =>
          useAnalytics(
            screenFragments,
            {},
            {
              screenType: ANALYTICS_SCREEN_TYPES.screenWithDrawer,
            },
          ),
        { initialState },
      );

      expect(trackScreenChange).not.toHaveBeenCalled();

      fireFocus(true, rerender);

      expect(trackScreenChange).not.toHaveBeenCalled();
    });

    it('tracks screen change on focus with drawer already closed', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useSelector as jest.Mock).mockReturnValue(false);

      const { rerender } = renderHookWithContext(
        () =>
          useAnalytics(
            screenFragments,
            {},
            {
              screenType: ANALYTICS_SCREEN_TYPES.screenWithDrawer,
            },
          ),
        { initialState },
      );

      expect(trackScreenChange).not.toHaveBeenCalled();

      fireFocus(true, rerender);

      expect(trackScreenChange).toHaveBeenCalledWith(
        screenFragments,
        undefined,
      );
    });

    it('does not track screen change on drawer open', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useSelector as jest.Mock).mockReturnValue(false);

      const { rerender } = renderHookWithContext(
        () =>
          useAnalytics(
            screenFragments,
            {},
            {
              screenType: ANALYTICS_SCREEN_TYPES.screenWithDrawer,
            },
          ),
        { initialState },
      );

      fireFocus(true, rerender);

      jest.clearAllMocks();

      fireDrawer(true, rerender);

      expect(trackScreenChange).not.toHaveBeenCalled();
    });

    it('tracks screen change on drawer close', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useSelector as jest.Mock).mockReturnValue(true);

      const { rerender } = renderHookWithContext(
        () =>
          useAnalytics(
            screenFragments,
            {},
            {
              screenType: ANALYTICS_SCREEN_TYPES.screenWithDrawer,
            },
          ),
        { initialState },
      );

      fireFocus(true, rerender);

      jest.clearAllMocks();

      fireDrawer(false, rerender);

      expect(trackScreenChange).toHaveBeenCalledWith(
        screenFragments,
        undefined,
      );
    });

    it('tracks screen change with callback', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useSelector as jest.Mock).mockReturnValue(false);

      const { result } = renderHookWithContext(
        () =>
          useAnalytics(
            screenFragments,
            {},
            {
              screenType: ANALYTICS_SCREEN_TYPES.screenWithDrawer,
            },
          ),
        { initialState },
      );

      result.current(screenFragments);

      expect(trackScreenChange).toHaveBeenCalledWith(
        screenFragments,
        undefined,
      );
    });
  });

  describe('default: screenType is "drawer"', () => {
    it('tracks screen change on focus with drawer already open', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useSelector as jest.Mock).mockReturnValue(true);

      const { rerender } = renderHookWithContext(
        () =>
          useAnalytics(
            screenFragments,
            {},
            {
              screenType: ANALYTICS_SCREEN_TYPES.drawer,
            },
          ),
        { initialState },
      );

      expect(trackScreenChange).not.toHaveBeenCalled();

      fireFocus(true, rerender);

      expect(trackScreenChange).toHaveBeenCalledWith(
        screenFragments,
        undefined,
      );
    });

    it('does not track screen change on focus with drawer already closed', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useSelector as jest.Mock).mockReturnValue(false);

      const { rerender } = renderHookWithContext(
        () =>
          useAnalytics(
            screenFragments,
            {},
            {
              screenType: ANALYTICS_SCREEN_TYPES.drawer,
            },
          ),
        { initialState },
      );

      expect(trackScreenChange).not.toHaveBeenCalled();

      fireFocus(true, rerender);

      expect(trackScreenChange).not.toHaveBeenCalled();
    });

    it('tracks screen change on drawer open', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useSelector as jest.Mock).mockReturnValue(false);

      const { rerender } = renderHookWithContext(
        () =>
          useAnalytics(
            screenFragments,
            {},
            {
              screenType: ANALYTICS_SCREEN_TYPES.drawer,
            },
          ),
        { initialState },
      );

      fireFocus(true, rerender);

      jest.clearAllMocks();

      fireDrawer(true, rerender);

      expect(trackScreenChange).toHaveBeenCalledWith(
        screenFragments,
        undefined,
      );
    });

    it('does not track screen change on drawer close', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useSelector as jest.Mock).mockReturnValue(true);

      const { rerender } = renderHookWithContext(
        () =>
          useAnalytics(
            screenFragments,
            {},
            {
              screenType: ANALYTICS_SCREEN_TYPES.drawer,
            },
          ),
        { initialState },
      );

      fireFocus(true, rerender);

      jest.clearAllMocks();

      fireDrawer(false, rerender);

      expect(trackScreenChange).not.toHaveBeenCalled();
    });

    it('tracks screen change with callback', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useSelector as jest.Mock).mockReturnValue(false);

      const { result } = renderHookWithContext(
        () =>
          useAnalytics(
            screenFragments,
            {},
            {
              screenType: ANALYTICS_SCREEN_TYPES.drawer,
            },
          ),
        {},
      );

      result.current(screenFragments);

      expect(trackScreenChange).toHaveBeenCalledWith(
        screenFragments,
        undefined,
      );
    });
  });
});
