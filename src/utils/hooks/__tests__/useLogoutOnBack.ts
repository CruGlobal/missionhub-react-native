import { renderHook } from '@testing-library/react-hooks';
import i18n from 'i18next';

import { prompt } from '../../prompt';
import { logout } from '../../../actions/auth/auth';
import { navigateBack } from '../../../actions/navigation';
import { useLogoutOnBack } from '../useLogoutOnBack';
import { useAndroidBackButton } from '../useAndroidBackButton';

jest.mock('../../../store', () => ({
  store: {
    dispatch: jest.fn(),
  },
}));
jest.mock('../../prompt');
jest.mock('../../../actions/auth/auth');
jest.mock('../../../actions/navigation');
jest.mock('../useAndroidBackButton');

let handleBack: (() => void) | undefined;

const logoutResult = { type: 'logout' };
const navigateBackResult = { type: 'navigate back' };

beforeEach(() => {
  (prompt as jest.Mock).mockReturnValue(Promise.resolve(true));
  (logout as jest.Mock).mockReturnValue(logoutResult);
  (navigateBack as jest.Mock).mockReturnValue(navigateBackResult);
});

describe('useLogoutOnBack', () => {
  describe('enableBackButton = true, logoutOnBack = true', () => {
    beforeEach(() => {
      handleBack = renderHook(() => useLogoutOnBack(true, true)).result.current;
    });

    it('useAndroidBackButton called', () => {
      expect(useAndroidBackButton).toHaveBeenCalledWith(true, handleBack);
    });

    it('logs out', async () => {
      handleBack && (await handleBack());

      expect(prompt).toHaveBeenCalledWith({
        title: i18n.t('goBackAlert:title'),
        description: i18n.t('goBackAlert:description'),
        actionLabel: i18n.t('goBackAlert:action'),
      });
      expect(logout).toHaveBeenCalledWith();
      expect(navigateBack).not.toHaveBeenCalled();
    });
  });

  describe('enableBackButton = true, logoutOnBack = false', () => {
    beforeEach(() => {
      handleBack = renderHook(() => useLogoutOnBack(true, false)).result
        .current;
    });

    it('useAndroidBackButton called', () => {
      expect(useAndroidBackButton).toHaveBeenCalledWith(true, handleBack);
    });

    it('navigates back', async () => {
      handleBack && (await handleBack());

      expect(prompt).not.toHaveBeenCalled();
      expect(logout).not.toHaveBeenCalled();
      expect(navigateBack).toHaveBeenCalledWith();
    });
  });

  describe('enableBackButton = false, logoutOnBack = true', () => {
    beforeEach(() => {
      handleBack = renderHook(() => useLogoutOnBack(false, true)).result
        .current;
    });

    it('useAndroidBackButton called', () => {
      expect(useAndroidBackButton).toHaveBeenCalledWith(false, undefined);
    });

    it('returns undefined', () => {
      expect(handleBack).toEqual(undefined);
    });
  });

  describe('enableBackButton = false, logoutOnBack = false', () => {
    beforeEach(() => {
      handleBack = renderHook(() => useLogoutOnBack(false, false)).result
        .current;
    });

    it('useAndroidBackButton called', () => {
      expect(useAndroidBackButton).toHaveBeenCalledWith(false, undefined);
    });

    it('returns undefined', () => {
      expect(handleBack).toEqual(undefined);
    });
  });

  describe('user cancels prompt', () => {
    beforeEach(() => {
      (prompt as jest.Mock).mockReturnValue(Promise.resolve(false));
      handleBack = renderHook(() => useLogoutOnBack(true, true)).result.current;
    });

    it('does not logout or navigate back', async () => {
      handleBack && (await handleBack());

      expect(prompt).toHaveBeenCalledWith({
        title: i18n.t('goBackAlert:title'),
        description: i18n.t('goBackAlert:description'),
        actionLabel: i18n.t('goBackAlert:action'),
      });
      expect(logout).not.toHaveBeenCalled();
      expect(navigateBack).not.toHaveBeenCalled();
    });
  });

  describe('logoutOnBack value changes', () => {
    it('first callback calls navigateBack, then logout', async () => {
      const { result, rerender } = renderHook(
        ({ enableBackButton, logoutOnBack }) =>
          useLogoutOnBack(enableBackButton, logoutOnBack),
        {
          initialProps: { enableBackButton: true, logoutOnBack: false },
        },
      );
      result.current && (await result.current());

      expect(prompt).not.toHaveBeenCalled();
      expect(logout).not.toHaveBeenCalled();
      expect(navigateBack).toHaveBeenCalledWith();

      jest.clearAllMocks();
      rerender({ enableBackButton: true, logoutOnBack: true });
      result.current && (await result.current());

      expect(prompt).toHaveBeenCalledWith({
        title: i18n.t('goBackAlert:title'),
        description: i18n.t('goBackAlert:description'),
        actionLabel: i18n.t('goBackAlert:action'),
      });
      expect(logout).toHaveBeenCalledWith();
      expect(navigateBack).not.toHaveBeenCalled();
    });

    it('first callback calls navigateBack, then logout', async () => {
      const { result, rerender } = renderHook(
        ({ enableBackButton, logoutOnBack }) =>
          useLogoutOnBack(enableBackButton, logoutOnBack),
        {
          initialProps: { enableBackButton: true, logoutOnBack: true },
        },
      );
      result.current && (await result.current());

      expect(prompt).toHaveBeenCalledWith({
        title: i18n.t('goBackAlert:title'),
        description: i18n.t('goBackAlert:description'),
        actionLabel: i18n.t('goBackAlert:action'),
      });
      expect(logout).toHaveBeenCalledWith();
      expect(navigateBack).not.toHaveBeenCalled();

      jest.clearAllMocks();
      rerender({ enableBackButton: true, logoutOnBack: false });
      result.current && (await result.current());

      expect(prompt).not.toHaveBeenCalled();
      expect(logout).not.toHaveBeenCalled();
      expect(navigateBack).toHaveBeenCalledWith();
    });
  });
});
