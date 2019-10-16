import { renderHook } from '@testing-library/react-hooks';
import { useNavigation } from 'react-navigation-hooks';
import i18n from 'i18next';

import { prompt } from '../../prompt';
import { logout } from '../../../actions/auth/auth';
import { navigateBack } from '../../../actions/navigation';
import { useLogoutOnBack } from '../useLogoutOnBack';
import { useAndroidBackButton } from '../useAndroidBackButton';

jest.mock('../../prompt');
jest.mock('../../../actions/auth/auth');
jest.mock('../../../actions/navigation');
jest.mock('../useAndroidBackButton');
jest.mock('react-navigation-hooks', () => ({
  useNavigation: jest.fn(),
}));

let navigation: { dispatch: jest.Mock };

let handleBack: (() => void) | undefined;

beforeEach(() => {
  navigation = {
    dispatch: jest.fn(),
  };
  (useNavigation as jest.Mock).mockReturnValue(navigation);
});

describe('useLogoutOnBack', () => {
  describe('enableBackButton = true, logoutOnBack = true', () => {
    beforeEach(() => {
      (prompt as jest.Mock).mockReturnValue(Promise.resolve(true));
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
      (prompt as jest.Mock).mockReturnValue(Promise.resolve(true));
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
      (prompt as jest.Mock).mockReturnValue(Promise.resolve(true));
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
      (prompt as jest.Mock).mockReturnValue(Promise.resolve(true));
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

  describe('logoutOnBack value changes', () => {
    beforeEach(() => {
      (prompt as jest.Mock).mockReturnValue(Promise.resolve(true));
    });

    describe('logoutOnBack starts false, then true', () => {
      it('first callback calls navigateBack, then logout', async () => {
        const testHook = async ({
          enableBackButton,
          logoutOnBack,
        }: {
          enableBackButton: boolean;
          logoutOnBack: boolean;
        }) => {
          const result = useLogoutOnBack(enableBackButton, logoutOnBack);
          result && (await result());
        };

        const { rerender } = await renderHook(testHook, {
          initialProps: { enableBackButton: true, logoutOnBack: false },
        });
        expect(prompt).not.toHaveBeenCalled();
        expect(logout).not.toHaveBeenCalled();
        expect(navigateBack).toHaveBeenCalledWith();

        await rerender({ enableBackButton: true, logoutOnBack: true });
        expect(prompt).toHaveBeenCalledWith({
          title: i18n.t('goBackAlert:title'),
          description: i18n.t('goBackAlert:description'),
          actionLabel: i18n.t('goBackAlert:action'),
        });
        expect(logout).toHaveBeenCalledWith();
      });
    });
  });
});
