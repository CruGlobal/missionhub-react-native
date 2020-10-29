/* eslint-disable max-lines */

import * as Redux from 'react-redux';
import { useIsFocused } from 'react-navigation-hooks';
import { flushMicrotasksQueue } from 'react-native-testing-library';

import { renderHookWithContext } from '../../../../testUtils';
import { trackScreenChange } from '../../../actions/analytics';
import { useAnalytics, ANALYTICS_SCREEN_TYPES } from '../useAnalytics';
import { useIsDrawerOpen } from '../useIsDrawerOpen';
import {
  ANALYTICS_ASSIGNMENT_TYPE,
  ANALYTICS_SECTION_TYPE,
  ANALYTICS_EDIT_MODE,
  ANALYTICS_PERMISSION_TYPE,
} from '../../../constants';
import { PermissionEnum } from '../../../../__generated__/globalTypes';

jest.mock('react-navigation-hooks');
jest.mock('../../../actions/analytics');
jest.mock('../useIsDrawerOpen');
jest.mock('../../../auth/authStore', () => ({ isAuthenticated: () => true }));

const trackScreenChangeResult = { type: 'track screen change' };

const screenFragments = ['screen name', 'subsection'];
const myId = '123';
const personId = '321';
const communityId = '444';

const initialState = {
  onboarding: { currentlyOnboarding: true },
};

beforeEach(() => {
  (trackScreenChange as jest.Mock).mockReturnValue(trackScreenChangeResult);
  (Redux.useDispatch as jest.Mock) = jest.fn().mockReturnValue(jest.fn());
});

const fireFocus = (isFocused: boolean, rerender: () => void) => {
  (useIsFocused as jest.Mock).mockReturnValue(isFocused);
  rerender();
};

const fireDrawer = (isOpen: boolean, rerender: () => void) => {
  (useIsDrawerOpen as jest.Mock).mockReturnValue(isOpen);
  rerender();
};

describe('useAnalytics', () => {
  describe('default: screenType is "screen"', () => {
    it('tracks screen change on focus with drawer already open', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useIsDrawerOpen as jest.Mock).mockReturnValue(true);

      const { rerender } = renderHookWithContext(
        () => useAnalytics(screenFragments),
        { initialState },
      );

      expect(trackScreenChange).not.toHaveBeenCalled();

      fireFocus(true, rerender);

      expect(trackScreenChange).toHaveBeenCalledWith(screenFragments, {});
    });

    it('tracks screen change on focus with drawer already closed', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useIsDrawerOpen as jest.Mock).mockReturnValue(false);

      const { rerender } = renderHookWithContext(
        () => useAnalytics(screenFragments),
        { initialState },
      );

      expect(trackScreenChange).not.toHaveBeenCalled();

      fireFocus(true, rerender);

      expect(trackScreenChange).toHaveBeenCalledWith(screenFragments, {});
    });

    it('does not track screen change on drawer open', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useIsDrawerOpen as jest.Mock).mockReturnValue(false);

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
      (useIsDrawerOpen as jest.Mock).mockReturnValue(true);

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
      (useIsDrawerOpen as jest.Mock).mockReturnValue(false);

      const { result } = renderHookWithContext(
        () => useAnalytics(screenFragments),
        { initialState },
      );

      result.current(screenFragments);

      expect(trackScreenChange).toHaveBeenCalledWith(screenFragments, {});
    });

    it('delays track screen change', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useIsDrawerOpen as jest.Mock).mockReturnValue(true);

      const { rerender } = renderHookWithContext<
        { triggerTracking: boolean },
        void
      >(
        ({ triggerTracking }) =>
          useAnalytics(screenFragments, { triggerTracking }),
        {
          initialState,
          initialProps: { triggerTracking: false },
        },
      );

      expect(trackScreenChange).not.toHaveBeenCalled();

      fireFocus(true, rerender);

      expect(trackScreenChange).not.toHaveBeenCalled();

      rerender({ triggerTracking: true });

      expect(trackScreenChange).toHaveBeenCalledWith(screenFragments, {});
    });

    it('delays track screen change', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useIsDrawerOpen as jest.Mock).mockReturnValue(true);

      const { rerender } = renderHookWithContext<
        { triggerTracking: boolean },
        void
      >(
        ({ triggerTracking }) =>
          useAnalytics(screenFragments, { triggerTracking }),
        {
          initialState,
          initialProps: { triggerTracking: false },
        },
      );

      expect(trackScreenChange).not.toHaveBeenCalled();

      fireFocus(true, rerender);

      expect(trackScreenChange).not.toHaveBeenCalled();

      rerender({ triggerTracking: true });

      expect(trackScreenChange).toHaveBeenCalledWith(screenFragments, {});
    });
  });

  describe('screenType is "screenWithDrawer"', () => {
    it('does not track screen change on focus with drawer already open', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useIsDrawerOpen as jest.Mock).mockReturnValue(true);

      const { rerender } = renderHookWithContext(
        () =>
          useAnalytics(screenFragments, {
            screenType: ANALYTICS_SCREEN_TYPES.screenWithDrawer,
          }),
        { initialState },
      );

      expect(trackScreenChange).not.toHaveBeenCalled();

      fireFocus(true, rerender);

      expect(trackScreenChange).not.toHaveBeenCalled();
    });

    it('tracks screen change on focus with drawer already closed', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useIsDrawerOpen as jest.Mock).mockReturnValue(false);

      const { rerender } = renderHookWithContext(
        () =>
          useAnalytics(screenFragments, {
            screenType: ANALYTICS_SCREEN_TYPES.screenWithDrawer,
          }),
        { initialState },
      );

      expect(trackScreenChange).not.toHaveBeenCalled();

      fireFocus(true, rerender);

      expect(trackScreenChange).toHaveBeenCalledWith(screenFragments, {});
    });

    it('does not track screen change on drawer open', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useIsDrawerOpen as jest.Mock).mockReturnValue(false);

      const { rerender } = renderHookWithContext(
        () =>
          useAnalytics(screenFragments, {
            screenType: ANALYTICS_SCREEN_TYPES.screenWithDrawer,
          }),
        { initialState },
      );

      fireFocus(true, rerender);

      jest.clearAllMocks();

      fireDrawer(true, rerender);

      expect(trackScreenChange).not.toHaveBeenCalled();
    });

    it('tracks screen change on drawer close', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useIsDrawerOpen as jest.Mock).mockReturnValue(true);

      const { rerender } = renderHookWithContext(
        () =>
          useAnalytics(screenFragments, {
            screenType: ANALYTICS_SCREEN_TYPES.screenWithDrawer,
          }),
        { initialState },
      );

      fireFocus(true, rerender);

      jest.clearAllMocks();

      fireDrawer(false, rerender);

      expect(trackScreenChange).toHaveBeenCalledWith(screenFragments, {});
    });

    it('tracks screen change with callback', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useIsDrawerOpen as jest.Mock).mockReturnValue(false);

      const { result } = renderHookWithContext(
        () =>
          useAnalytics(screenFragments, {
            screenType: ANALYTICS_SCREEN_TYPES.screenWithDrawer,
          }),
        { initialState },
      );

      result.current(screenFragments);

      expect(trackScreenChange).toHaveBeenCalledWith(screenFragments, {});
    });

    it('delays track screen change', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useIsDrawerOpen as jest.Mock).mockReturnValue(false);

      const { rerender } = renderHookWithContext<
        { triggerTracking: boolean },
        void
      >(
        ({ triggerTracking }) =>
          useAnalytics(screenFragments, {
            triggerTracking,
            screenType: ANALYTICS_SCREEN_TYPES.screenWithDrawer,
          }),
        {
          initialState,
          initialProps: { triggerTracking: false },
        },
      );

      expect(trackScreenChange).not.toHaveBeenCalled();

      fireFocus(true, rerender);

      expect(trackScreenChange).not.toHaveBeenCalled();

      rerender({ triggerTracking: true });

      expect(trackScreenChange).toHaveBeenCalledWith(screenFragments, {});
    });

    it('delays track screen change', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useIsDrawerOpen as jest.Mock).mockReturnValue(false);

      const { rerender } = renderHookWithContext<
        { triggerTracking: boolean },
        void
      >(
        ({ triggerTracking }) =>
          useAnalytics(screenFragments, {
            triggerTracking,
            screenType: ANALYTICS_SCREEN_TYPES.screenWithDrawer,
          }),
        {
          initialState,
          initialProps: { triggerTracking: false },
        },
      );

      expect(trackScreenChange).not.toHaveBeenCalled();

      fireFocus(true, rerender);

      expect(trackScreenChange).not.toHaveBeenCalled();

      rerender({ triggerTracking: true });

      expect(trackScreenChange).toHaveBeenCalledWith(screenFragments, {});
    });
  });

  describe('default: screenType is "drawer"', () => {
    it('tracks screen change on focus with drawer already open', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useIsDrawerOpen as jest.Mock).mockReturnValue(true);

      const { rerender } = renderHookWithContext(
        () =>
          useAnalytics(screenFragments, {
            screenType: ANALYTICS_SCREEN_TYPES.drawer,
          }),
        { initialState },
      );

      expect(trackScreenChange).not.toHaveBeenCalled();

      fireFocus(true, rerender);

      expect(trackScreenChange).toHaveBeenCalledWith(screenFragments, {});
    });

    it('does not track screen change on focus with drawer already closed', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useIsDrawerOpen as jest.Mock).mockReturnValue(false);

      const { rerender } = renderHookWithContext(
        () =>
          useAnalytics(screenFragments, {
            screenType: ANALYTICS_SCREEN_TYPES.drawer,
          }),
        { initialState },
      );

      expect(trackScreenChange).not.toHaveBeenCalled();

      fireFocus(true, rerender);

      expect(trackScreenChange).not.toHaveBeenCalled();
    });

    it('tracks screen change on drawer open', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useIsDrawerOpen as jest.Mock).mockReturnValue(false);

      const { rerender } = renderHookWithContext(
        () =>
          useAnalytics(screenFragments, {
            screenType: ANALYTICS_SCREEN_TYPES.drawer,
          }),
        { initialState },
      );

      fireFocus(true, rerender);

      jest.clearAllMocks();

      fireDrawer(true, rerender);

      expect(trackScreenChange).toHaveBeenCalledWith(screenFragments, {});
    });

    it('does not track screen change on drawer close', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useIsDrawerOpen as jest.Mock).mockReturnValue(true);

      const { rerender } = renderHookWithContext(
        () =>
          useAnalytics(screenFragments, {
            screenType: ANALYTICS_SCREEN_TYPES.drawer,
          }),
        { initialState },
      );

      fireFocus(true, rerender);

      jest.clearAllMocks();

      fireDrawer(false, rerender);

      expect(trackScreenChange).not.toHaveBeenCalled();
    });

    it('tracks screen change with callback', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useIsDrawerOpen as jest.Mock).mockReturnValue(false);

      const { result } = renderHookWithContext(
        () =>
          useAnalytics(screenFragments, {
            screenType: ANALYTICS_SCREEN_TYPES.drawer,
          }),
        { initialState },
      );

      result.current(screenFragments);

      expect(trackScreenChange).toHaveBeenCalledWith(screenFragments, {});
    });

    it('delays track screen change', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useIsDrawerOpen as jest.Mock).mockReturnValue(false);

      const { rerender } = renderHookWithContext<
        { triggerTracking: boolean },
        void
      >(
        ({ triggerTracking }) =>
          useAnalytics(screenFragments, {
            triggerTracking,
            screenType: ANALYTICS_SCREEN_TYPES.drawer,
          }),
        {
          initialState,
          initialProps: { triggerTracking: false },
        },
      );

      expect(trackScreenChange).not.toHaveBeenCalled();

      fireFocus(true, rerender);

      jest.clearAllMocks();

      fireDrawer(true, rerender);

      expect(trackScreenChange).not.toHaveBeenCalled();

      rerender({ triggerTracking: true });

      expect(trackScreenChange).toHaveBeenCalledWith(screenFragments, {});
    });

    it('delays track screen change', () => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useIsDrawerOpen as jest.Mock).mockReturnValue(false);

      const { rerender } = renderHookWithContext<
        { triggerTracking: boolean },
        void
      >(
        ({ triggerTracking }) =>
          useAnalytics(screenFragments, {
            triggerTracking,
            screenType: ANALYTICS_SCREEN_TYPES.drawer,
          }),
        {
          initialState,
          initialProps: { triggerTracking: false },
        },
      );

      expect(trackScreenChange).not.toHaveBeenCalled();

      fireFocus(true, rerender);

      jest.clearAllMocks();

      fireDrawer(true, rerender);

      expect(trackScreenChange).not.toHaveBeenCalled();

      rerender({ triggerTracking: true });

      expect(trackScreenChange).toHaveBeenCalledWith(screenFragments, {});
    });
  });

  describe('analytics context', () => {
    beforeEach(() => {
      (useIsFocused as jest.Mock).mockReturnValue(false);
      (useIsDrawerOpen as jest.Mock).mockReturnValue(true);
    });

    describe('assignment type', () => {
      it('set to "self"', async () => {
        const { rerender } = renderHookWithContext(
          () =>
            useAnalytics(screenFragments, {
              assignmentType: { personId: myId, communityId },
            }),
          {
            initialState,
            mocks: { User: () => ({ person: () => ({ id: myId }) }) },
          },
        );

        await flushMicrotasksQueue();

        expect(trackScreenChange).not.toHaveBeenCalled();

        fireFocus(true, rerender);

        expect(trackScreenChange).toHaveBeenCalledWith(screenFragments, {
          [ANALYTICS_ASSIGNMENT_TYPE]: 'self',
        });
      });

      it('set to "community members"', () => {
        const { rerender } = renderHookWithContext(
          () =>
            useAnalytics(screenFragments, {
              assignmentType: { personId, communityId },
            }),
          { initialState },
        );

        expect(trackScreenChange).not.toHaveBeenCalled();

        fireFocus(true, rerender);

        expect(trackScreenChange).toHaveBeenCalledWith(screenFragments, {
          [ANALYTICS_ASSIGNMENT_TYPE]: 'community member',
        });
      });

      it('set to "contact"', () => {
        const { rerender } = renderHookWithContext(
          () =>
            useAnalytics(screenFragments, {
              assignmentType: { personId, communityId: '' },
            }),
          { initialState },
        );

        expect(trackScreenChange).not.toHaveBeenCalled();

        fireFocus(true, rerender);

        expect(trackScreenChange).toHaveBeenCalledWith(screenFragments, {
          [ANALYTICS_ASSIGNMENT_TYPE]: 'contact',
        });
      });
    });

    describe('section type', () => {
      it('set to "onboarding"', () => {
        const { rerender } = renderHookWithContext(
          () =>
            useAnalytics(screenFragments, {
              sectionType: true,
            }),
          { initialState },
        );

        expect(trackScreenChange).not.toHaveBeenCalled();

        fireFocus(true, rerender);

        expect(trackScreenChange).toHaveBeenCalledWith(screenFragments, {
          [ANALYTICS_SECTION_TYPE]: 'onboarding',
        });
      });

      it('set to ""', () => {
        const { rerender } = renderHookWithContext(
          () =>
            useAnalytics(screenFragments, {
              sectionType: true,
            }),
          {
            initialState: {
              ...initialState,
              onboarding: { currentlyOnboarding: false },
            },
          },
        );

        expect(trackScreenChange).not.toHaveBeenCalled();

        fireFocus(true, rerender);

        expect(trackScreenChange).toHaveBeenCalledWith(screenFragments, {
          [ANALYTICS_SECTION_TYPE]: '',
        });
      });
    });

    describe('edit mode', () => {
      it('set to "update"', () => {
        const { rerender } = renderHookWithContext(
          () =>
            useAnalytics(screenFragments, {
              editMode: { isEdit: true },
            }),
          { initialState },
        );

        expect(trackScreenChange).not.toHaveBeenCalled();

        fireFocus(true, rerender);

        expect(trackScreenChange).toHaveBeenCalledWith(screenFragments, {
          [ANALYTICS_EDIT_MODE]: 'update',
        });
      });

      it('set to "set"', () => {
        const { rerender } = renderHookWithContext(
          () =>
            useAnalytics(screenFragments, {
              editMode: { isEdit: false },
            }),
          {
            initialState,
          },
        );

        expect(trackScreenChange).not.toHaveBeenCalled();

        fireFocus(true, rerender);

        expect(trackScreenChange).toHaveBeenCalledWith(screenFragments, {
          [ANALYTICS_EDIT_MODE]: 'set',
        });
      });
    });

    describe('permission type', () => {
      it('set to "owner"', async () => {
        const { rerender } = renderHookWithContext(
          () =>
            useAnalytics(screenFragments, {
              permissionType: { communityId },
            }),
          {
            initialState,
            mocks: {
              CommunityPermission: () => ({ permission: PermissionEnum.owner }),
            },
          },
        );

        await flushMicrotasksQueue();

        expect(trackScreenChange).not.toHaveBeenCalled();

        fireFocus(true, rerender);

        expect(trackScreenChange).toHaveBeenCalledWith(screenFragments, {
          [ANALYTICS_PERMISSION_TYPE]: 'owner',
        });
      });
    });

    it('set to "admin"', async () => {
      const { rerender } = renderHookWithContext(
        () =>
          useAnalytics(screenFragments, {
            permissionType: { communityId },
          }),
        {
          initialState,
          mocks: {
            CommunityPermission: () => ({ permission: PermissionEnum.admin }),
          },
        },
      );

      await flushMicrotasksQueue();

      expect(trackScreenChange).not.toHaveBeenCalled();

      fireFocus(true, rerender);

      expect(trackScreenChange).toHaveBeenCalledWith(screenFragments, {
        [ANALYTICS_PERMISSION_TYPE]: 'admin',
      });
    });

    it('set to "member"', async () => {
      const { rerender } = renderHookWithContext(
        () =>
          useAnalytics(screenFragments, {
            permissionType: { communityId },
          }),
        {
          initialState,
          mocks: {
            CommunityPermission: () => ({ permission: PermissionEnum.user }),
          },
        },
      );

      await flushMicrotasksQueue();

      expect(trackScreenChange).not.toHaveBeenCalled();

      fireFocus(true, rerender);

      expect(trackScreenChange).toHaveBeenCalledWith(screenFragments, {
        [ANALYTICS_PERMISSION_TYPE]: 'member',
      });
    });
  });
});
