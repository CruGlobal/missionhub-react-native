import 'react-native';
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import CommentLikeComponent from '..';

import { renderShallow } from '../../../../testUtils';
import { toggleLike } from '../../../actions/celebration';
import { ACTIONS } from '../../../constants';
import { trackActionWithoutData } from '../../../actions/analytics';

jest.mock('../../../actions/celebration');
jest.mock('../../../actions/analytics');

const mockStore = configureStore([thunk]);
let store;

const myId = '2342';
const toggleLikeResponse = { type: 'item was liked' };
const trackActionResponse = { type: 'tracked action' };

toggleLike.mockReturnValue(dispatch => dispatch(toggleLikeResponse));
trackActionWithoutData.mockReturnValue(dispatch =>
  dispatch(trackActionResponse),
);

beforeEach(() => {
  jest.clearAllMocks();

  store = mockStore({ auth: { person: { id: myId } } });
});

it('renders nothing with no subject person', () => {
  expect(
    renderShallow(<CommentLikeComponent event={{}} />, store),
  ).toMatchSnapshot();
});

describe('with subject person', () => {
  const event = {
    id: '777711',
    liked: false,
    subject_person: {},
    likes_count: 54,
    comments_count: 15,
    organization: { id: '88732' },
  };

  it('renders for me', () => {
    expect(
      renderShallow(<CommentLikeComponent event={event} />, store),
    ).toMatchSnapshot();
  });

  it('renders for someone else', () => {
    expect(
      renderShallow(
        <CommentLikeComponent
          event={{ ...event, subject_person: { id: myId } }}
        />,
        store,
      ),
    ).toMatchSnapshot();
  });

  it('renders when liked', () => {
    expect(
      renderShallow(
        <CommentLikeComponent event={{ ...event, liked: true }} />,
        store,
      ),
    ).toMatchSnapshot();
  });

  describe('onPress like button', () => {
    function subject() {
      renderShallow(<CommentLikeComponent event={event} />, store)
        .childAt(3)
        .props()
        .onPress();
    }

    it('toggles like', () => {
      subject();

      expect(toggleLike).toHaveBeenCalledWith(
        event.organization.id,
        event.id,
        event.liked,
      );
      expect(store.getActions()).toEqual(
        expect.arrayContaining([toggleLikeResponse]),
      );
    });

    it('tracks action', () => {
      subject();

      expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.ITEM_LIKED);
      expect(store.getActions()).toEqual(
        expect.arrayContaining([trackActionResponse]),
      );
    });
  });
});
