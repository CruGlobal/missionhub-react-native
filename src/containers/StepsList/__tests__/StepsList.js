import 'react-native';
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import StepsList from '..';

import { renderShallow } from '../../../../testUtils';

const mockStore = configureStore([thunk]);
let store;

let personId;
let screen;

const organization = { id: '4234234' };
const contactStageId = '3';
const receiverId = '252342354234';
const auth = { person: { id: personId } };
const contactName = 'bill';

beforeEach(() => {
  jest.clearAllMocks();

  store = mockStore({
    auth,
    steps: { suggestedForMe: {}, suggestedForOthers: {} },
  });

  screen = renderShallow(
    <StepsList
      contactStageId={contactStageId}
      organization={organization}
      receiverId={receiverId}
      contactName={contactName}
    />,
    store,
  );
});

describe('for me', () => {
  beforeAll(() => {
    personId = receiverId;
  });

  it('renders correctly', () => {
    expect(screen).toMatchSnapshot();
  });
});

describe('for another person', () => {
  beforeAll(() => {
    personId = '99900111';
  });

  it('renders correctly', () => {
    expect(screen).toMatchSnapshot();
  });
});
