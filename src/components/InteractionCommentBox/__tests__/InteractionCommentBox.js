import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { renderShallow } from '../../../../testUtils';
import { addNewInteraction } from '../../../actions/interactions';
import { INTERACTION_TYPES } from '../../../constants';

import InteractionCommentBox from '..';

jest.mock('../../../actions/interactions');

const mockStore = configureStore([thunk]);
const addNewInteractionResult = { type: 'created interaction' };
const person = { id: '4243242' };

let screen;
let store;

addNewInteraction.mockReturnValue(addNewInteractionResult);

beforeEach(() => {
  jest.clearAllMocks();

  store = mockStore();

  screen = renderShallow(
    <InteractionCommentBox hideActions={true} person={person} />,
    store,
  );
});

it('renders correctly', () => {
  expect(screen).toMatchSnapshot();
});

describe('onSubmit', () => {
  it('creates interaction', () => {
    const text = 'matt watts loves the spurs';

    screen.props().onSubmit(null, text);

    expect(addNewInteraction).toHaveBeenCalledWith(
      person.id,
      INTERACTION_TYPES.MHInteractionTypeNote,
      text,
      undefined,
    );
    expect(store.getActions()).toEqual([addNewInteractionResult]);
  });
});
