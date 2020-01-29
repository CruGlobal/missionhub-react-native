import React from 'react';
import { Alert, ActionSheetIOS } from 'react-native';
import { fireEvent } from 'react-native-testing-library';
import MockDate from 'mockdate';
import i18next from 'i18next';
import { useMutation } from '@apollo/react-hooks';

import { trackActionWithoutData } from '../../../actions/analytics';
import { navigatePush } from '../../../actions/navigation';
import { renderWithContext } from '../../../../testUtils';
import { CELEBRATEABLE_TYPES, GLOBAL_COMMUNITY_ID } from '../../../constants';
import { CELEBRATE_DETAIL_SCREEN } from '../../../containers/CelebrateDetailScreen';
import { CELEBRATE_EDIT_STORY_SCREEN } from '../../../containers/Groups/EditStoryScreen';
import { Organization } from '../../../reducers/organizations';
import {
  GetCelebrateFeed_community_celebrationItems_nodes,
  GetCelebrateFeed_community_celebrationItems_nodes_subjectPerson,
} from '../../../containers/CelebrateFeed/__generated__/GetCelebrateFeed';

import CelebrateItem, { DELETE_STORY, REPORT_STORY } from '..';

jest.mock('../../../actions/analytics');
jest.mock('../../../actions/navigation');

const myId = '123';
const subjectPerson: GetCelebrateFeed_community_celebrationItems_nodes_subjectPerson = {
  __typename: 'Person',
  id: '234',
  firstName: 'John',
  lastName: 'Smith',
};
const subjectPersonName = `${subjectPerson.firstName} ${subjectPerson.lastName}`;
const globalOrg: Organization = { id: GLOBAL_COMMUNITY_ID };
const organization: Organization = { id: '3' };

const date = '2019-08-21T12:00:00.000';
MockDate.set('2019-08-21 12:00:00', 300);

let onRefresh = jest.fn();
let onClearNotification = jest.fn();

const trackActionResult = { type: 'tracked plain action' };
const navigatePushResult = { type: 'navigate push' };

const baseEvent: GetCelebrateFeed_community_celebrationItems_nodes = {
  __typename: 'CommunityCelebrationItem',
  id: '222',
  adjectiveAttributeName: null,
  adjectiveAttributeValue: null,
  changedAttributeName: 'created_at',
  changedAttributeValue: date,
  commentsCount: 0,
  liked: false,
  likesCount: 1,
  subjectPerson: subjectPerson,
  subjectPersonName,
  celebrateableId: '2',
  celebrateableType: CELEBRATEABLE_TYPES.completedStep,
  objectDescription: 'Celebration',
};
const storyEvent: GetCelebrateFeed_community_celebrationItems_nodes = {
  ...baseEvent,
  celebrateableType: CELEBRATEABLE_TYPES.story,
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
        event={baseEvent}
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
        event={baseEvent}
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
        event={baseEvent}
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
        event={baseEvent}
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
      event={baseEvent}
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
        event={baseEvent}
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
        event={baseEvent}
        onRefresh={onRefresh}
        organization={organization}
        namePressable={false}
      />,
      { initialState },
    );

    fireEvent.press(getByTestId('CelebrateItemPressable'));

    expect(navigatePush).toHaveBeenCalledWith(CELEBRATE_DETAIL_SCREEN, {
      event: baseEvent,
      orgId: organization.id,
    });
  });
});

describe('long-press card', () => {
  describe('story written by me', () => {
    const myStoryEvent: GetCelebrateFeed_community_celebrationItems_nodes = {
      ...storyEvent,
      subjectPerson: { ...subjectPerson, id: myId },
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

      expect(navigatePush).toHaveBeenCalledWith(CELEBRATE_EDIT_STORY_SCREEN, {
        celebrationItem: myStoryEvent,
        onRefresh,
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
        event={baseEvent}
        onRefresh={onRefresh}
        organization={organization}
        onClearNotification={onClearNotification}
        namePressable={false}
      />,
      { initialState },
    );

    fireEvent.press(getByTestId('ClearNotificationButton'));

    expect(onClearNotification).toHaveBeenCalledWith(baseEvent);
  });
});
