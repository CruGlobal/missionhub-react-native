import React from 'react';
import { Alert, ActionSheetIOS } from 'react-native';
import { fireEvent } from 'react-native-testing-library';
import MockDate from 'mockdate';
import i18next from 'i18next';
import { useMutation } from '@apollo/react-hooks';

import { trackActionWithoutData } from '../../../actions/analytics';
import { navigatePush } from '../../../actions/navigation';
import { renderWithContext } from '../../../../testUtils';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { GLOBAL_COMMUNITY_ID } from '../../../constants';
import { CELEBRATE_DETAIL_SCREEN } from '../../../containers/CelebrateDetailScreen';
import { CREATE_POST_SCREEN } from '../../../containers/Groups/CreatePostScreen';
import { Organization } from '../../../reducers/organizations';
import {
  GetCelebrateFeed_community_celebrationItems_nodes as CelebrateItemData,
  GetCelebrateFeed_community_celebrationItems_nodes_subjectPerson as CelebrateItemPerson,
} from '../../../containers/CelebrateFeed/__generated__/GetCelebrateFeed';
import { CELEBRATE_ITEM_FRAGMENT, COMMUNITY_PERSON_FRAGMENT } from '../queries';
import { CommunityCelebrationCelebrateableEnum } from '../../../../__generated__/globalTypes';

import CelebrateItem, { DELETE_STORY, REPORT_STORY } from '..';

jest.mock('../../../actions/analytics');
jest.mock('../../../actions/navigation');

const globalOrg: Organization = { id: GLOBAL_COMMUNITY_ID };
const organization: Organization = { id: '3', name: 'Communidad' };

const event = mockFragment<CelebrateItemData>(CELEBRATE_ITEM_FRAGMENT);
const mePerson = mockFragment<CelebrateItemPerson>(COMMUNITY_PERSON_FRAGMENT);
const myId = mePerson.id;

MockDate.set('2019-08-21 12:00:00', 300);

let onRefresh = jest.fn();
let onClearNotification = jest.fn();

const trackActionResult = { type: 'tracked plain action' };
const navigatePushResult = { type: 'navigate push' };

const storyEvent: CelebrateItemData = {
  ...event,
  celebrateableType: CommunityCelebrationCelebrateableEnum.STORY,
};

const initialState = { auth: { person: { id: myId } } };

beforeEach(() => {
  onRefresh = jest.fn();
  onClearNotification = jest.fn();
  (trackActionWithoutData as jest.Mock).mockReturnValue(trackActionResult);
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResult);
});

describe('global community', () => {
  it('renders correctly', () => {
    renderWithContext(
      <CelebrateItem
        event={event}
        onRefresh={onRefresh}
        organization={globalOrg}
        namePressable={false}
      />,
      { initialState },
    ).snapshot();
  });

  it('renders with clear notification button correctly', () => {
    renderWithContext(
      <CelebrateItem
        event={event}
        onRefresh={onRefresh}
        organization={globalOrg}
        namePressable={false}
        onClearNotification={onClearNotification}
      />,
      { initialState },
    ).snapshot();
  });

  it('renders story item correctly', () => {
    renderWithContext(
      <CelebrateItem
        event={storyEvent}
        onRefresh={onRefresh}
        organization={globalOrg}
        namePressable={false}
      />,
      { initialState },
    ).snapshot();
  });
});

describe('Community', () => {
  it('renders correctly', () => {
    renderWithContext(
      <CelebrateItem
        event={event}
        onRefresh={onRefresh}
        organization={organization}
        namePressable={false}
      />,
      { initialState },
    ).snapshot();
  });

  it('renders with clear notification button correctly', () => {
    renderWithContext(
      <CelebrateItem
        event={event}
        onRefresh={onRefresh}
        organization={organization}
        onClearNotification={onClearNotification}
        namePressable={false}
      />,
      { initialState },
    ).snapshot();
  });

  it('renders story item correctly', () => {
    renderWithContext(
      <CelebrateItem
        event={storyEvent}
        onRefresh={onRefresh}
        organization={organization}
        namePressable={false}
      />,
      { initialState },
    ).snapshot();
  });
});

it('renders with name pressable correctly', () => {
  renderWithContext(
    <CelebrateItem
      event={event}
      onRefresh={onRefresh}
      organization={organization}
      namePressable={true}
    />,
    { initialState },
  ).snapshot();
});

describe('press card', () => {
  it('not pressable in global community', () => {
    const { getByTestId } = renderWithContext(
      <CelebrateItem
        event={event}
        onRefresh={onRefresh}
        organization={globalOrg}
        namePressable={false}
      />,
      { initialState },
    );

    expect(getByTestId('CelebrateItemPressable').props.onPress).toEqual(
      undefined,
    );
  });

  it('navigates to celebrate detail screen', () => {
    const { getByTestId } = renderWithContext(
      <CelebrateItem
        event={event}
        onRefresh={onRefresh}
        organization={organization}
        namePressable={false}
      />,
      { initialState },
    );

    fireEvent.press(getByTestId('CelebrateItemPressable'));

    expect(navigatePush).toHaveBeenCalledWith(CELEBRATE_DETAIL_SCREEN, {
      event,
      orgId: organization.id,
      onRefreshCelebrateItem: onRefresh,
    });
  });
});

describe('long-press card', () => {
  describe('story written by me', () => {
    const myStoryEvent: CelebrateItemData = {
      ...storyEvent,
      subjectPerson: mePerson,
    };

    it('navigates to edit story screen', () => {
      ActionSheetIOS.showActionSheetWithOptions = jest.fn();
      Alert.alert = jest.fn();

      const { getByTestId } = renderWithContext(
        <CelebrateItem
          event={myStoryEvent}
          onRefresh={onRefresh}
          organization={organization}
          namePressable={false}
        />,
        { initialState },
      );

      fireEvent(getByTestId('popupMenuButton'), 'onLongPress');
      (ActionSheetIOS.showActionSheetWithOptions as jest.Mock).mock.calls[0][1](
        0,
      );

      expect(navigatePush).toHaveBeenCalledWith(CREATE_POST_SCREEN, {
        post: myStoryEvent,
        onComplete: onRefresh,
        orgId: organization.id,
      });
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('deletes story', async () => {
      ActionSheetIOS.showActionSheetWithOptions = jest.fn();
      Alert.alert = jest.fn();

      const { getByTestId } = renderWithContext(
        <CelebrateItem
          event={myStoryEvent}
          onRefresh={onRefresh}
          organization={organization}
          namePressable={false}
        />,
        { initialState },
      );

      fireEvent(getByTestId('popupMenuButton'), 'onLongPress');
      (ActionSheetIOS.showActionSheetWithOptions as jest.Mock).mock.calls[0][1](
        1,
      );
      await (Alert.alert as jest.Mock).mock.calls[0][2][1].onPress();

      expect(navigatePush).not.toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith(
        i18next.t('celebrateItems:delete.title'),
        i18next.t('celebrateItems:delete.message'),
        [
          { text: i18next.t('cancel') },
          {
            text: i18next.t('celebrateItems:delete.buttonText'),
            onPress: expect.any(Function),
          },
        ],
      );
      expect(useMutation).toHaveBeenMutatedWith(DELETE_STORY, {
        variables: { input: { id: myStoryEvent.celebrateableId } },
      });
      expect(onRefresh).toHaveBeenCalled();
    });
  });

  describe('story written by other', () => {
    it('reports story', async () => {
      ActionSheetIOS.showActionSheetWithOptions = jest.fn();
      Alert.alert = jest.fn();

      const { getByTestId } = renderWithContext(
        <CelebrateItem
          event={storyEvent}
          onRefresh={onRefresh}
          organization={organization}
          namePressable={false}
        />,
        { initialState },
      );

      fireEvent(getByTestId('popupMenuButton'), 'onLongPress');
      (ActionSheetIOS.showActionSheetWithOptions as jest.Mock).mock.calls[0][1](
        0,
      );
      await (Alert.alert as jest.Mock).mock.calls[0][2][1].onPress();

      expect(navigatePush).not.toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith(
        i18next.t('celebrateItems:report.title'),
        i18next.t('celebrateItems:report.message'),
        [
          { text: i18next.t('cancel') },
          {
            text: i18next.t('celebrateItems:report.confirmButtonText'),
            onPress: expect.any(Function),
          },
        ],
      );
      expect(useMutation).toHaveBeenMutatedWith(REPORT_STORY, {
        variables: { subjectId: storyEvent.celebrateableId },
      });
    });
  });
});

describe('clear notification button', () => {
  it('calls onClearNotification', () => {
    const { getByTestId } = renderWithContext(
      <CelebrateItem
        event={event}
        onRefresh={onRefresh}
        organization={organization}
        onClearNotification={onClearNotification}
        namePressable={false}
      />,
      { initialState },
    );

    fireEvent.press(getByTestId('ClearNotificationButton'));

    expect(onClearNotification).toHaveBeenCalledWith(event);
  });
});
