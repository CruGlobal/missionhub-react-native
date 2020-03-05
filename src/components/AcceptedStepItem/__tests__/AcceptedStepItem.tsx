import React from 'react';
import { fireEvent } from 'react-native-testing-library';
import MockDate from 'mockdate';

import { renderWithContext } from '../../../../testUtils';
import { completeStep } from '../../../actions/steps';
import { navigatePush } from '../../../actions/navigation';
import { ACCEPTED_STEP_DETAIL_SCREEN } from '../../../containers/AcceptedStepDetailScreen';
import { CONTACT_STEPS } from '../../../constants';
import { reminderSelector } from '../../../selectors/stepReminders';
import { COMPLETED_STEP_DETAIL_SCREEN } from '../../../containers/CompletedStepDetailScreen';

import AcceptedStepItem from '..';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/steps');
jest.mock('../../../selectors/stepReminders');
const mockDate = '2019-08-24 12:00:00 PM GMT+0';
MockDate.set(mockDate);

const stepId = '1';
const reminderId = '11';
const reminder = { id: reminderId };
const step = {
  id: '1',
  title: 'title',
  body: 'Step of Faith',
  reminder,
};
const stepReminders = {
  allByStep: {
    [stepId]: reminder,
  },
};

const initialState = { stepReminders };

beforeEach(() => {
  (navigatePush as jest.Mock).mockReturnValue({ type: 'navigate push' });
  (completeStep as jest.Mock).mockReturnValue({ type: 'complete step' });
});

describe('AcceptedStepItem', () => {
  it('renders accepted correctly', () => {
    renderWithContext(<AcceptedStepItem step={step} />, {
      initialState,
    }).snapshot();
  });

  it('renders completed correctly', () => {
    renderWithContext(
      <AcceptedStepItem step={{ ...step, completed_at: '12/12/2012' }} />,
      { initialState },
    ).snapshot();
  });

  it('selects reminder from Redux', () => {
    renderWithContext(<AcceptedStepItem step={step} />, {
      initialState,
    });

    expect(reminderSelector).toHaveBeenCalledWith(
      { stepReminders },
      { stepId },
    );
  });

  it('navigates to AcceptedStepDetailScreen', () => {
    const { getByTestId } = renderWithContext(
      <AcceptedStepItem step={step} />,
      { initialState },
    );

    fireEvent.press(getByTestId('AcceptedCardButton'));

    expect(navigatePush).toHaveBeenCalledWith(ACCEPTED_STEP_DETAIL_SCREEN, {
      stepId,
    });
  });

  it('navigates to CompletedStepDetailScreen', () => {
    const completedStep = { ...step, completed_at: '2018' };
    const { getByTestId } = renderWithContext(
      <AcceptedStepItem step={completedStep} />,
      { initialState },
    );

    fireEvent.press(getByTestId('CompletedCardButton'));

    expect(navigatePush).toHaveBeenCalledWith(COMPLETED_STEP_DETAIL_SCREEN, {
      stepId: completedStep.id,
    });
  });

  it('calls completeStep', async () => {
    const onComplete = jest.fn();
    const { getByTestId } = renderWithContext(
      <AcceptedStepItem step={step} onComplete={onComplete} />,
      { initialState },
    );

    await fireEvent.press(getByTestId('CompleteStepButton'));

    expect(completeStep).toHaveBeenCalledWith(step, CONTACT_STEPS);
    expect(onComplete).toHaveBeenCalled();
  });
});
