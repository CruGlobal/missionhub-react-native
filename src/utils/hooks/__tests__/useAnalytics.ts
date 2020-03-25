import { renderHook } from '@testing-library/react-hooks';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from 'react-navigation-hooks';

import { trackScreenChange } from '../../../actions/analytics';
import { useAnalytics, ANALYTICS_SCREEN_TYPES } from '../useAnalytics';

jest.mock('react-navigation-hooks');
jest.mock('react-redux');
jest.mock('../../../actions/analytics');

const trackScreenChangeResult = { type: 'track screen change' };

const screenFragments = ['screen name', 'subsection'];

beforeEach(() => {
  (trackScreenChange as jest.Mock).mockReturnValue(trackScreenChangeResult);
  (useDispatch as jest.Mock).mockReturnValue(jest.fn());
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

      const { rerender } = renderHook(() => useAnalytics(screenFragments));

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

      const { rerender } = renderHook(() => useAnalytics(screenFragments));

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

      const { rerender } = renderHook(() => useAnalytics(screenFragments));

      fireFocus(true, rerender);

      jest.clearAllMocks();

      fireDrawer(true, rerender);

      expect(trackScreenChange).not.toHaveBeenCalled();
    });

    it('does not track screen change on drawer close', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useSelector as jest.Mock).mockReturnValue(true);

      const { rerender } = renderHook(() => useAnalytics(screenFragments));

      fireFocus(true, rerender);

      jest.clearAllMocks();

      fireDrawer(false, rerender);

      expect(trackScreenChange).not.toHaveBeenCalled();
    });

    it('tracks screen change with callback', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useSelector as jest.Mock).mockReturnValue(false);

      const { result } = renderHook(() => useAnalytics(screenFragments));

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

      const { rerender } = renderHook(() =>
        useAnalytics(screenFragments, {
          screenType: ANALYTICS_SCREEN_TYPES.screenWithDrawer,
        }),
      );

      expect(trackScreenChange).not.toHaveBeenCalled();

      fireFocus(true, rerender);

      expect(trackScreenChange).not.toHaveBeenCalled();
    });

    it('tracks screen change on focus with drawer already closed', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useSelector as jest.Mock).mockReturnValue(false);

      const { rerender } = renderHook(() =>
        useAnalytics(screenFragments, {
          screenType: ANALYTICS_SCREEN_TYPES.screenWithDrawer,
        }),
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

      const { rerender } = renderHook(() =>
        useAnalytics(screenFragments, {
          screenType: ANALYTICS_SCREEN_TYPES.screenWithDrawer,
        }),
      );

      fireFocus(true, rerender);

      jest.clearAllMocks();

      fireDrawer(true, rerender);

      expect(trackScreenChange).not.toHaveBeenCalled();
    });

    it('tracks screen change on drawer close', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useSelector as jest.Mock).mockReturnValue(true);

      const { rerender } = renderHook(() =>
        useAnalytics(screenFragments, {
          screenType: ANALYTICS_SCREEN_TYPES.screenWithDrawer,
        }),
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

      const { result } = renderHook(() =>
        useAnalytics(screenFragments, {
          screenType: ANALYTICS_SCREEN_TYPES.screenWithDrawer,
        }),
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

      const { rerender } = renderHook(() =>
        useAnalytics(screenFragments, {
          screenType: ANALYTICS_SCREEN_TYPES.drawer,
        }),
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

      const { rerender } = renderHook(() =>
        useAnalytics(screenFragments, {
          screenType: ANALYTICS_SCREEN_TYPES.drawer,
        }),
      );

      expect(trackScreenChange).not.toHaveBeenCalled();

      fireFocus(true, rerender);

      expect(trackScreenChange).not.toHaveBeenCalled();
    });

    it('tracks screen change on drawer open', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useSelector as jest.Mock).mockReturnValue(false);

      const { rerender } = renderHook(() =>
        useAnalytics(screenFragments, {
          screenType: ANALYTICS_SCREEN_TYPES.drawer,
        }),
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

      const { rerender } = renderHook(() =>
        useAnalytics(screenFragments, {
          screenType: ANALYTICS_SCREEN_TYPES.drawer,
        }),
      );

      fireFocus(true, rerender);

      jest.clearAllMocks();

      fireDrawer(false, rerender);

      expect(trackScreenChange).not.toHaveBeenCalled();
    });

    it('tracks screen change with callback', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useSelector as jest.Mock).mockReturnValue(false);

      const { result } = renderHook(() =>
        useAnalytics(screenFragments, {
          screenType: ANALYTICS_SCREEN_TYPES.drawer,
        }),
      );

      result.current(screenFragments);

      expect(trackScreenChange).toHaveBeenCalledWith(
        screenFragments,
        undefined,
      );
    });
  });
});
