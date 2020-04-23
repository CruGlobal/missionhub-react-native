import 'react-native';
import React from 'react';
import { MockStore } from 'redux-mock-store';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { ReactTestInstance } from 'react-test-renderer';

import { renderWithContext } from '../../../../testUtils';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { toggleLike } from '../../../actions/celebration';
import { ACTIONS } from '../../../constants';
import { trackActionWithoutData } from '../../../actions/analytics';
import { Organization } from '../../../reducers/organizations';
import {
  CELEBRATE_ITEM_FRAGMENT,
  COMMUNITY_PERSON_FRAGMENT,
} from '../../../components/CelebrateItem/queries';
import {
  GetCelebrateFeed_community_celebrationItems_nodes as CelebrateItem,
  GetCelebrateFeed_community_celebrationItems_nodes_subjectPerson as CelebrateItemPerson,
} from '../../../containers/CelebrateFeed/__generated__/GetCelebrateFeed';

import CommentLikeComponent from '..';

jest.mock('../../../actions/celebration');
jest.mock('../../../actions/analytics');

const mePerson = mockFragment<CelebrateItemPerson>(COMMUNITY_PERSON_FRAGMENT);
const otherPerson = mockFragment<CelebrateItemPerson>(
  COMMUNITY_PERSON_FRAGMENT,
);
const myId = mePerson.id;
const organization: Organization = { id: '567' };
const event = mockFragment<CelebrateItem>(CELEBRATE_ITEM_FRAGMENT);

const toggleLikeResponse = { type: 'item was liked' };
const trackActionResponse = { type: 'tracked action' };

const initialState = { auth: { person: { id: myId } } };

let onRefresh: jest.Mock;

beforeEach(() => {
  onRefresh = jest.fn();
  (toggleLike as jest.Mock).mockReturnValue(toggleLikeResponse);
  (trackActionWithoutData as jest.Mock).mockReturnValue(trackActionResponse);
});

it('renders nothing with no subject person', () => {
  renderWithContext(
    <CommentLikeComponent
      event={{ ...event, subjectPerson: null }}
      organization={organization}
      onRefresh={onRefresh}
    />,
    {
      initialState,
    },
  ).snapshot();
});

describe('with subject person', () => {
  it('renders for me', () => {
    renderWithContext(
      <CommentLikeComponent
        event={{
          ...event,
          subjectPerson: mePerson,
        }}
        organization={organization}
        onRefresh={onRefresh}
      />,
      {
        initialState,
      },
    ).snapshot();
  });

  it('renders for someone else', () => {
    renderWithContext(
      <CommentLikeComponent
        event={{
          ...event,
          subjectPerson: otherPerson,
        }}
        organization={organization}
        onRefresh={onRefresh}
      />,
      {
        initialState,
      },
    ).snapshot();
  });

  it('renders when not liked', () => {
    renderWithContext(
      <CommentLikeComponent
        event={{
          ...event,
          subjectPerson: otherPerson,
          liked: false,
        }}
        organization={organization}
        onRefresh={onRefresh}
      />,
      {
        initialState,
      },
    ).snapshot();
  });

  it('renders 0 comments_count', () => {
    renderWithContext(
      <CommentLikeComponent
        event={{
          ...event,
          subjectPerson: otherPerson,
          commentsCount: 0,
        }}
        organization={organization}
        onRefresh={onRefresh}
      />,
      {
        initialState,
      },
    ).snapshot();
  });

  it('renders 0 likes_count', () => {
    renderWithContext(
      <CommentLikeComponent
        event={{
          ...event,
          subjectPerson: mePerson,
          likesCount: 0,
        }}
        organization={organization}
        onRefresh={onRefresh}
      />,
      {
        initialState,
      },
    ).snapshot();
  });

  describe('onPress like button', () => {
    describe('unlike -> like', () => {
      let screen: {
        store: MockStore;
        recordSnapshot: () => void;
        diffSnapshot: () => void;
        getByTestId: (id: string) => ReactTestInstance;
      };

      beforeEach(() => {
        screen = renderWithContext(
          <CommentLikeComponent
            event={{
              ...event,
              subjectPerson: mePerson,
              liked: false,
            }}
            organization={organization}
            onRefresh={onRefresh}
          />,
          {
            initialState,
          },
        );
      });

      it('renders disabled heart button', async () => {
        screen.recordSnapshot();

        fireEvent.press(screen.getByTestId('LikeIconButton'));

        screen.diffSnapshot();

        await flushMicrotasksQueue();
      });

      it('toggles like', async () => {
        await fireEvent.press(screen.getByTestId('LikeIconButton'));

        expect(toggleLike).toHaveBeenCalledWith(
          event.id,
          false,
          organization.id,
        );
        expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.ITEM_LIKED);
        expect(screen.store.getActions()).toEqual([
          toggleLikeResponse,
          trackActionResponse,
        ]);
      });
    });

    describe('like -> unlike', () => {
      let screen: {
        store: MockStore;
        recordSnapshot: () => void;
        diffSnapshot: () => void;
        getByTestId: (id: string) => ReactTestInstance;
      };

      beforeEach(() => {
        screen = renderWithContext(
          <CommentLikeComponent
            event={{
              ...event,
              subjectPerson: mePerson,
              liked: true,
            }}
            organization={organization}
            onRefresh={onRefresh}
          />,
          {
            initialState,
          },
        );
      });

      it('renders disabled heart button', async () => {
        screen.recordSnapshot();

        fireEvent.press(screen.getByTestId('LikeIconButton'));

        screen.diffSnapshot();

        await flushMicrotasksQueue();
      });

      it('toggles like', async () => {
        await fireEvent.press(screen.getByTestId('LikeIconButton'));

        expect(toggleLike).toHaveBeenCalledWith(
          event.id,
          true,
          organization.id,
        );
        expect(trackActionWithoutData).not.toHaveBeenCalled();
        expect(screen.store.getActions()).toEqual([toggleLikeResponse]);
      });
    });
  });
});
