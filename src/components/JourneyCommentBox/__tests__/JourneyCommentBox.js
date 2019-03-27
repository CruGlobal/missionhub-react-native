import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { renderShallow } from '../../../../testUtils';
import { addNewInteraction } from '../../../actions/interactions';
import { INTERACTION_TYPES } from '../../../constants';

import JourneyCommentBox from '..';

jest.mock('../../../actions/interactions');

const mockStore = configureStore([thunk]);
const person = { id: '4243242' };
let organization;
const onSubmit = jest.fn();

let screen;
let store;

addNewInteraction.mockReturnValue(() => Promise.resolve());

beforeEach(() => {
  store = mockStore();

  screen = renderShallow(
    <JourneyCommentBox
      hideActions={true}
      person={person}
      organization={organization}
      onSubmit={onSubmit}
    />,
    store,
  );
});

it('renders correctly', () => {
  expect(screen).toMatchSnapshot();
});

describe('onSubmit', () => {
  const text = 'matt watts loves the spurs';
  let action;

  beforeAll(() => {
    organization = null;
  });
  beforeEach(() => screen.props().onSubmit(action, text));

  describe('without organization', () => {
    describe('action type is submitted', () => {
      const spiritualConversationAction =
        INTERACTION_TYPES.MHInteractionTypeSpiritualConversation;

      beforeAll(() => {
        action = spiritualConversationAction;
      });

      it('creates interaction with type', () => {
        expect(addNewInteraction).toHaveBeenCalledWith(
          person.id,
          spiritualConversationAction,
          text,
          undefined,
        );
      });
    });

    describe('action type is not submitted', () => {
      beforeAll(() => {
        action = null;
      });

      it('creates note', () => {
        expect(addNewInteraction).toHaveBeenCalledWith(
          person.id,
          INTERACTION_TYPES.MHInteractionTypeNote,
          text,
          undefined,
        );
      });
    });

    it('executes onSubmit', () => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });

  describe('with organization', () => {
    const org = { id: '99999' };

    beforeAll(() => {
      organization = org;
    });

    it('creates interaction with org id', () => {
      expect(addNewInteraction).toHaveBeenCalledWith(
        person.id,
        INTERACTION_TYPES.MHInteractionTypeNote,
        text,
        org.id,
      );
    });
  });
});
