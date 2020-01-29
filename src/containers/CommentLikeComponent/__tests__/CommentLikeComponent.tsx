import 'react-native';
import React from 'react';
import { MockStore } from 'redux-mock-store';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { ReactTestInstance } from 'react-test-renderer';

import { renderWithContext } from '../../../../testUtils';
import { toggleLike } from '../../../actions/celebration';
import { ACTIONS } from '../../../constants';
import { trackActionWithoutData } from '../../../actions/analytics';
import { Organization } from '../../../reducers/organizations';
import {
  GetCelebrateFeed_community_celebrationItems_nodes,
  GetCelebrateFeed_community_celebrationItems_nodes_subjectPerson,
} from '../../CelebrateFeed/__generated__/GetCelebrateFeed';

import CommentLikeComponent from '..';

jest.mock('../../../actions/celebration');
jest.mock('../../../actions/analytics');

const myId = '2342';
const otherId = '3453';
const mePerson: GetCelebrateFeed_community_celebrationItems_nodes_subjectPerson = {
  __typename: 'Person',
  id: myId,
  firstName: 'Me',
  lastName: 'Meme',
};
const otherPerson: GetCelebrateFeed_community_celebrationItems_nodes_subjectPerson = {
  __typename: 'Person',
  id: otherId,
  firstName: 'Other',
  lastName: 'Otherother',
};
const organization: Organization = { id: '567' };
const baseEvent: GetCelebrateFeed_community_celebrationItems_nodes = {
  __typename: 'CommunityCelebrationItem',
  id: '777711',
  adjectiveAttributeName: null,
  adjectiveAttributeValue: null,
  celebrateableId: '1',
  celebrateableType: '',
  changedAttributeName: '',
  changedAttributeValue: '',
  commentsCount: 15,
  liked: false,
  likesCount: 54,
  objectDescription: null,
  subjectPerson: null,
  subjectPersonName: null,
};

const toggleLikeResponse = { type: 'item was liked' };
const trackActionResponse = { type: 'tracked action' };

const initialState = { auth: { person: { id: myId } } };

beforeEach(() => {
  (toggleLike as jest.Mock).mockReturnValue(toggleLikeResponse);
  (trackActionWithoutData as jest.Mock).mockReturnValue(trackActionResponse);
});

it('renders nothing with no subject person', () => {
  renderWithContext(
    <CommentLikeComponent
      event={{ ...baseEvent, subjectPerson: null }}
      organization={organization}
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
          ...baseEvent,
          subjectPerson: mePerson,
        }}
        organization={organization}
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
          ...baseEvent,
          subjectPerson: otherPerson,
        }}
        organization={organization}
      />,
      {
        initialState,
      },
    ).snapshot();
  });

  it('renders when liked', () => {
    renderWithContext(
      <CommentLikeComponent
        event={{
          ...baseEvent,
          subjectPerson: otherPerson,
          liked: true,
        }}
        organization={organization}
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
          ...baseEvent,
          subjectPerson: otherPerson,
          commentsCount: 0,
        }}
        organization={organization}
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
          ...baseEvent,
          subjectPerson: mePerson,
          likesCount: 0,
        }}
        organization={organization}
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
              ...baseEvent,
              subjectPerson: mePerson,
              liked: false,
            }}
            organization={organization}
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
          baseEvent.id,
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
              ...baseEvent,
              subjectPerson: mePerson,
              liked: true,
            }}
            organization={organization}
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
          baseEvent.id,
          true,
          organization.id,
        );
        expect(trackActionWithoutData).not.toHaveBeenCalled();
        expect(screen.store.getActions()).toEqual([toggleLikeResponse]);
      });
    });
  });
});
