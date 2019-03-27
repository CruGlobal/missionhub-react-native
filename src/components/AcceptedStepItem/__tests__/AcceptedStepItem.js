import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { renderShallow, testSnapshotShallow } from '../../../../testUtils';
import { completeStep } from '../../../actions/steps';
import { navigatePush } from '../../../actions/navigation';
import StepSuggestionItem from '../';
import { ACCEPTED_STEP_DETAIL_SCREEN } from '../../../containers/AcceptedStepDetailScreen';
import { CONTACT_STEPS } from '../../../constants';
import { reminderSelector } from '../../../selectors/stepReminders';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/steps');
jest.mock('../../../selectors/stepReminders');

const stepId = '1';
const reminderId = '11';
const reminder = { id: reminderId };
const step = {
  id: '1',
  body: 'Step of Faith',
  reminder,
};
const stepReminders = {
  allByStep: {
    [stepId]: reminder,
  },
};

const mockStore = configureStore([thunk]);

let store;

beforeEach(() => {
  store = mockStore({
    stepReminders,
  });
  reminderSelector.mockReturnValue(reminder);
});

describe('AcceptedStepItem', () => {
  it('renders accepted correctly', () => {
    testSnapshotShallow(<StepSuggestionItem step={step} />, store);
  });

  it('renders completed correctly', () => {
    testSnapshotShallow(
      <StepSuggestionItem step={{ ...step, completed_at: '12/12/2012' }} />,
      store,
    );
  });

  it('selects reminder from Redux', () => {
    const component = renderShallow(<StepSuggestionItem step={step} />, store);

    expect(reminderSelector).toHaveBeenCalledWith(
      { stepReminders },
      { stepId },
    );
  });

  it('navigates to StepDetailScreen', () => {
    navigatePush.mockReturnValue({ type: 'navigate push' });

    const component = renderShallow(<StepSuggestionItem step={step} />, store);

    component.props().onPress();

    expect(navigatePush).toHaveBeenCalledWith(ACCEPTED_STEP_DETAIL_SCREEN, {
      step,
    });
  });

  it('calls completeStep', async () => {
    completeStep.mockReturnValue({ type: 'complete step' });
    const onComplete = jest.fn();

    const component = renderShallow(
      <StepSuggestionItem step={step} onComplete={onComplete} />,
      store,
    );

    await component
      .childAt(1)
      .props()
      .onPress();

    expect(completeStep).toHaveBeenCalledWith(step, CONTACT_STEPS);
    expect(onComplete).toHaveBeenCalled();
  });
});
