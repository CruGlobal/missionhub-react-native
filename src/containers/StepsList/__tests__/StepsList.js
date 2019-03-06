import 'react-native';
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import StepsList from '..';

import { renderShallow } from '../../../../testUtils';
import { insertName } from '../../../utils/steps';

jest.mock('../../../utils/steps');

const mockStore = configureStore([thunk]);
let store;

let personId;
let screen;

const organization = { id: '4234234' };
const contactStageId = '3';
const receiverId = '252342354234';
const contactName = 'bill';
const item = { body: 'some step' };
const suggestedForMe = {
  [contactStageId]: [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
  ],
};
const suggestedForOthers = {
  [contactStageId]: [
    { id: '7' },
    { id: '8' },
    { id: '9' },
    { id: '10' },
    { id: '11' },
    { id: '12' },
  ],
};

const insertNameResult = [{ body: 'take a step with roge' }];

insertName.mockReturnValue(insertNameResult);

beforeEach(() => {
  jest.clearAllMocks();

  store = mockStore({
    auth: { person: { id: personId } },
    steps: { suggestedForMe, suggestedForOthers },
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

  it('renders correctly with steps', () => {
    expect(screen).toMatchSnapshot();
  });

  describe('loadMore', () => {
    it('should show more steps and hide button', () => {
      pressLoadMore();

      expect(screen).toMatchSnapshot();
    });
  });
});

describe('for another person', () => {
  beforeAll(() => {
    personId = '99900111';
  });

  it('renders correctly with steps', () => {
    expect(screen).toMatchSnapshot();
  });

  it('inserts name into steps', () => {
    expect(insertName).toHaveBeenCalledWith(
      suggestedForOthers[contactStageId].slice(0, 4),
      contactName,
    );
  });

  describe('loadMore', () => {
    beforeEach(() => {
      pressLoadMore();
    });

    it('should show more steps and hide button', () => {
      expect(screen).toMatchSnapshot();
    });

    it('should insert name', () => {
      expect(insertName).toHaveBeenCalledWith(
        suggestedForOthers[contactStageId].slice(0, 8),
        contactName,
      );
    });
  });
});

describe('renderItem', () => {
  it('renders correctly', () => {
    expect(screen.props().renderItem({ item })).toMatchSnapshot();
  });
});

function pressLoadMore() {
  screen.props().ListFooterComponent.props.onPress();
  screen.update();
}
