import { renderHook } from '@testing-library/react-hooks';
import { BackHandler } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';

import { useAndroidBackButton } from '../useAndroidBackButton';

jest.mock('react-native', () => ({
  BackHandler: { addEventListener: jest.fn(), removeEventListener: jest.fn() },
}));
jest.mock('react-navigation-hooks', () => ({
  useNavigation: jest.fn(),
}));

const events: { [key: string]: () => void } = {};
const fireEvent = (eventName: string) => events[eventName]();

const remove = jest.fn();
let navigation: { addListener: jest.Mock };

beforeEach(() => {
  (remove as jest.Mock).mockClear();
  (BackHandler.addEventListener as jest.Mock).mockImplementation(
    (eventName: string, listener: () => void) => {
      events[eventName] = listener;
    },
  );
  (BackHandler.removeEventListener as jest.Mock).mockImplementation(
    (eventName: string) => {
      events[eventName] = () => {};
    },
  );
  navigation = {
    addListener: jest
      .fn()
      .mockImplementation((eventName: string, listener: () => void) => {
        events[eventName] = listener;
        return { remove };
      }),
  };
  (useNavigation as jest.Mock).mockReturnValue(navigation);
});

describe('useAndroidBackButton', () => {
  describe('back button disabled, no custom navigate', () => {
    beforeEach(() => {
      renderHook(() => useAndroidBackButton());
    });

    it('on mount, setup listeners', () => {
      expect(navigation.addListener).toHaveBeenCalledWith(
        'willFocus',
        expect.any(Function),
      );
      expect(navigation.addListener).toHaveBeenCalledWith(
        'willBlur',
        expect.any(Function),
      );
    });

    it('on focus, set listener', () => {
      fireEvent('willFocus');

      expect(BackHandler.addEventListener).toHaveBeenCalledWith(
        'hardwareBackPress',
        expect.any(Function),
      );
    });

    it('press Android button, return true', () => {
      fireEvent('willFocus');

      expect(fireEvent('hardwareBackPress')).toEqual(true);
    });

    it('on blur, remove listener', () => {
      fireEvent('willFocus');
      fireEvent('willBlur');

      expect(BackHandler.removeEventListener).toHaveBeenCalledWith(
        'hardwareBackPress',
        expect.any(Function),
      );
    });
  });

  describe('back button enabled, no custom navigate', () => {
    beforeEach(() => {
      renderHook(() => useAndroidBackButton(true));
    });

    it('on mount, setup listeners', () => {
      expect(navigation.addListener).toHaveBeenCalledWith(
        'willFocus',
        expect.any(Function),
      );
      expect(navigation.addListener).toHaveBeenCalledWith(
        'willBlur',
        expect.any(Function),
      );
    });

    it('on focus, set listener', () => {
      fireEvent('willFocus');

      expect(BackHandler.addEventListener).toHaveBeenCalledWith(
        'hardwareBackPress',
        expect.any(Function),
      );
    });

    it('press Android button, return false', () => {
      fireEvent('willFocus');

      expect(fireEvent('hardwareBackPress')).toEqual(false);
    });

    it('on blur, remove listener', () => {
      fireEvent('willFocus');
      fireEvent('willBlur');

      expect(BackHandler.removeEventListener).toHaveBeenCalledWith(
        'hardwareBackPress',
        expect.any(Function),
      );
    });
  });

  describe('back button enabled, custom navigate', () => {
    const customNavigate = jest.fn();

    beforeEach(() => {
      renderHook(() => useAndroidBackButton(true, customNavigate));
    });

    it('on mount, setup listeners', () => {
      expect(navigation.addListener).toHaveBeenCalledWith(
        'willFocus',
        expect.any(Function),
      );
      expect(navigation.addListener).toHaveBeenCalledWith(
        'willBlur',
        expect.any(Function),
      );
    });

    it('on focus, set listener', () => {
      fireEvent('willFocus');

      expect(BackHandler.addEventListener).toHaveBeenCalledWith(
        'hardwareBackPress',
        expect.any(Function),
      );
    });

    it('press Android button, return true, call customNavigate', () => {
      fireEvent('willFocus');

      expect(fireEvent('hardwareBackPress')).toEqual(true);
      expect(customNavigate).toHaveBeenCalledWith();
    });

    it('on blur, remove listener', () => {
      fireEvent('willFocus');
      fireEvent('willBlur');

      expect(BackHandler.removeEventListener).toHaveBeenCalledWith(
        'hardwareBackPress',
        expect.any(Function),
      );
    });
  });
});
