import 'react-native';
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { renderShallow } from '../../../../testUtils';
import { insertName } from '../../../utils/steps';

import StepsList from '..';

jest.mock('../../../utils/steps');

const mockStore = configureStore([thunk]);
let store;

let personId;
let contactStageId;
let screen;

const organization = { id: '4234234' };
const stageIdWithSteps = '3';
const receiverId = '252342354234';
const contactName = 'bill';
const item = { body: 'some step' };
const suggestedForMe = {
  [stageIdWithSteps]: [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
  ],
};
const suggestedForOthers = {
  [stageIdWithSteps]: [
    { id: '7' },
    { id: '8' },
    { id: '9' },
    { id: '10' },
    { id: '11' },
    { id: '12' },
  ],
};

const insertNameResult = [{ body: 'take a step with roge' }];

const next = jest.fn();

beforeEach(() => {
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
      next={next}
    />,
    store,
  );
});

describe('for me', () => {
  beforeAll(() => {
    personId = receiverId;
  });

  describe('without steps', () => {
    beforeAll(() => {
      contactStageId = '100';
    });

    it('renders correctly', () => {
      expect(screen).toMatchSnapshot();
    });
  });

  describe('with steps', () => {
    beforeAll(() => {
      contactStageId = stageIdWithSteps;
    });

    it('renders correctly', () => {
      expect(screen).toMatchSnapshot();
    });

    describe('loadMore', () => {
      it('should show more steps and hide button', () => {
        pressLoadMore();

        expect(screen).toMatchSnapshot();
      });
    });
  });
});

describe('for another person', () => {
  beforeAll(() => {
    personId = '99900111';
  });

  describe('without steps', () => {
    beforeAll(() => {
      contactStageId = '100';
      insertName.mockReturnValue([]);
    });

    it('renders correctly', () => {
      expect(screen).toMatchSnapshot();
    });
  });

  describe('with steps', () => {
    beforeAll(() => {
      contactStageId = stageIdWithSteps;
      insertName.mockReturnValue(insertNameResult);
    });

    it('renders correctly', () => {
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
