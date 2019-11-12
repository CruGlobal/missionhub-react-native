import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { getStepSuggestions } from '../../../actions/steps';

import StepsList from '..';

jest.mock('../../../actions/steps', () => ({
  getStepSuggestions: jest.fn().mockReturnValue({ type: 'getStepSuggestions' }),
}));
jest.mock('../../../components/LoadMore', () => 'LoadMore');

let authPersonId: string;
let contactStageId: string;
let screen: ReturnType<typeof renderWithContext>;

const navToCreateStep = jest.fn();
const stageIdWithSteps = '3';
const personId = '252342354234';
const contactName = 'Bill';
const suggestedForMe = {
  [stageIdWithSteps]: [
    { id: '1', body: 'Step for me' },
    { id: '2', body: 'Step for me' },
    { id: '3', body: 'Step for me' },
    { id: '4', body: 'Step for me' },
    { id: '5', body: 'Step for me' },
    { id: '6', body: 'Step for me' },
  ],
};
const suggestedForOthers = {
  [stageIdWithSteps]: [
    { id: '7', body: 'Step with <<name>>' },
    { id: '8', body: 'Step with <<name>>' },
    { id: '9', body: 'Step with <<name>>' },
    { id: '10', body: 'Step with <<name>>' },
    { id: '11', body: 'Step with <<name>>' },
    { id: '12', body: 'Step with <<name>>' },
  ],
};

const onPressStep = jest.fn();

beforeEach(() => {
  screen = renderWithContext(
    <StepsList
      onPressCreateStep={navToCreateStep}
      contactStageId={contactStageId}
      personId={personId}
      contactName={contactName}
      onPressStep={onPressStep}
    />,
    {
      initialState: {
        auth: { person: { id: authPersonId } },
        steps: { suggestedForMe, suggestedForOthers },
      },
    },
  );
});

describe('for me', () => {
  beforeAll(() => {
    authPersonId = personId;
  });

  describe('without steps', () => {
    beforeAll(() => {
      contactStageId = '100';
    });

    it('renders correctly', () => {
      expect(getStepSuggestions).toHaveBeenCalledWith(true, '100');
      screen.snapshot();
    });
  });

  describe('with steps', () => {
    beforeAll(() => {
      contactStageId = stageIdWithSteps;
    });

    it('renders correctly', () => {
      expect(getStepSuggestions).toHaveBeenCalledWith(true, '3');
      screen.snapshot();
    });

    describe('loadMore', () => {
      it('should show more steps and hide button', () => {
        screen.recordSnapshot();
        pressLoadMore();
        screen.diffSnapshot();
      });
    });
  });
});

describe('for another person', () => {
  beforeAll(() => {
    authPersonId = '99900111';
  });

  describe('without steps', () => {
    beforeAll(() => {
      contactStageId = '100';
    });

    it('renders correctly', () => {
      expect(getStepSuggestions).toHaveBeenCalledWith(false, '100');
      screen.snapshot();
    });
  });

  describe('with steps', () => {
    beforeAll(() => {
      contactStageId = stageIdWithSteps;
    });

    it('renders correctly', () => {
      expect(getStepSuggestions).toHaveBeenCalledWith(false, '3');
      screen.snapshot();
    });

    describe('loadMore', () => {
      it('should show more steps and hide button', () => {
        screen.recordSnapshot();
        pressLoadMore();
        screen.diffSnapshot();
      });
    });
  });
});

function pressLoadMore() {
  fireEvent.press(screen.getByTestId('loadMore'));
}
