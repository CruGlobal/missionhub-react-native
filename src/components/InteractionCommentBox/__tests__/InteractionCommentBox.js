import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { renderShallow } from '../../../../testUtils';
import { addNewInteraction } from '../../../actions/interactions';

import InteractionCommentBox from '..';

jest.mock('../../../actions/interactions');

const mockStore = configureStore([thunk]);
const addNewInteractionResult = { type: 'created interaction' };

let screen;
let store;
let hideActions;

addNewInteraction.mockReturnValue(addNewInteractionResult);

beforeEach(() => {
  jest.clearAllMocks();

  store = mockStore();

  screen = renderShallow(
    <InteractionCommentBox hideActions={hideActions} />,
    store,
  );
});

describe('hide actions', () => {
  beforeAll(() => {
    hideActions = true;
  });

  it('renders correctly', () => {
    expect(screen).toMatchSnapshot();
  });
});

describe('show actions', () => {
  beforeAll(() => {
    hideActions = false;
  });

  it('renders correctly', () => {
    expect(screen).toMatchSnapshot();
  });
});
