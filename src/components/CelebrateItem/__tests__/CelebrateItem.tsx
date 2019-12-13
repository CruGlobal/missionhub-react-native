import React from 'react';
import * as ReactHooks from '@apollo/react-hooks';
import { MutationResult } from '@apollo/react-common';
import { Alert, ActionSheetIOS } from 'react-native';
import { fireEvent } from 'react-native-testing-library';
import MockDate from 'mockdate';
import i18next from 'i18next';
import { DocumentNode } from 'graphql';

import { trackActionWithoutData } from '../../../actions/analytics';
import { navigatePush } from '../../../actions/navigation';
import { renderWithContext } from '../../../../testUtils';
import { CELEBRATEABLE_TYPES, GLOBAL_COMMUNITY_ID } from '../../../constants';
import { CELEBRATE_DETAIL_SCREEN } from '../../../containers/CelebrateDetailScreen';
import { CELEBRATE_EDIT_STORY_SCREEN } from '../../../containers/Groups/EditStoryScreen';

import CelebrateItem, { Event, DELETE_STORY, REPORT_STORY } from '..';

jest.mock('../../../actions/analytics');
jest.mock('../../../actions/navigation');

const myId = '123';
const subjectPerson = {
  id: '234',
  first_name: 'John',
  last_name: 'Smith',
  full_name: 'John Smith',
};
const globalOrg = { id: GLOBAL_COMMUNITY_ID };
const organization = { id: '3' };

const date = '2019-08-21T12:00:00.000';
MockDate.set('2019-08-21 12:00:00', 300);

let onRefresh = jest.fn();
let onClearNotification = jest.fn();
let deleteStory = jest.fn();
let reportStory = jest.fn();

const trackActionResult = { type: 'tracked plain action' };
const navigatePushResult = { type: 'navigate push' };

const event: Event = {
  id: '222',
  changed_attribute_value: date,
  subject_person: subjectPerson,
  subject_person_name: subjectPerson.full_name,
  celebrateable_id: '2',
  celebrateable_type: CELEBRATEABLE_TYPES.completedStep,
  organization,
  object_description: 'Celebration',
};
const storyEvent: Event = {
  ...event,
  celebrateable_type: CELEBRATEABLE_TYPES.story,
};

const initialState = { auth: { person: { id: myId } } };

beforeEach(() => {
  onRefresh = jest.fn();
  onClearNotification = jest.fn();
  deleteStory = jest.fn();
  reportStory = jest.fn();
  (trackActionWithoutData as jest.Mock).mockReturnValue(trackActionResult);
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResult);
  jest
    .spyOn(ReactHooks, 'useMutation')
    .mockImplementation((input: DocumentNode) => [
      input === DELETE_STORY
        ? deleteStory
        : input === REPORT_STORY
        ? reportStory
        : jest.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { loading: false } as MutationResult<any>,
    ]);
});

describe('global community', () => {
  it('renders correctly', () => {
    renderWithContext(
      <CelebrateItem
        event={event}
        onRefresh={onRefresh}
        organization={globalOrg}
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
      />,
      { initialState },
    );

    fireEvent.press(getByTestId('CelebrateItemPressable'));

    expect(navigatePush).toHaveBeenCalledWith(CELEBRATE_DETAIL_SCREEN, {
      event,
    });
  });
});

describe('long-press card', () => {
  describe('story written by me', () => {
    const myStoryEvent = {
      ...storyEvent,
      subject_person: { ...subjectPerson, id: myId },
    };

    it('navigates to edit story screen', () => {
      ActionSheetIOS.showActionSheetWithOptions = jest.fn();
      Alert.alert = jest.fn();

      const { getByTestId } = renderWithContext(
        <CelebrateItem
          event={myStoryEvent}
          onRefresh={onRefresh}
          organization={organization}
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
      expect(deleteStory).toHaveBeenCalled();
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
      expect(reportStory).toHaveBeenCalled();
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
      />,
      { initialState },
    );

    fireEvent.press(getByTestId('ClearNotificationButton'));

    expect(onClearNotification).toHaveBeenCalledWith(event);
  });
});
