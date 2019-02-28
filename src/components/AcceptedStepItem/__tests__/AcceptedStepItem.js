import React from 'react';

import { renderShallow, testSnapshotShallow } from '../../../../testUtils';
import { completeStep } from '../../../actions/steps';
import { navigatePush } from '../../../actions/navigation';
import StepSuggestionItem from '../';
import { ACCEPTED_STEP_DETAIL_SCREEN } from '../../../containers/AcceptedStepDetailScreen';
import { CONTACT_STEPS } from '../../../constants';

jest.mock('.../../../actions/navigation');
jest.mock('.../../../actions/steps');

const step = {
  id: '1',
  body: 'Step of Faith',
};

describe('AcceptedStepItem', () => {
  it('renders accepted correctly', () => {
    testSnapshotShallow(<StepSuggestionItem step={step} />);
  });

  it('renders completed correctly', () => {
    testSnapshotShallow(
      <StepSuggestionItem step={{ ...step, completed_at: '12/12/2012' }} />,
    );
  });

  it('navigates to StepDetailScreen', () => {
    navigatePush.mockReturnValue({ type: 'navigate push' });

    const component = renderShallow(<StepSuggestionItem step={step} />);

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
    );

    await component
      .childAt(1)
      .props()
      .onPress();

    expect(completeStep).toHaveBeenCalledWith(step, CONTACT_STEPS);
    expect(onComplete).toHaveBeenCalled();
  });
});
