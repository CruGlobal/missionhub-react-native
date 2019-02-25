import React from 'react';

import { renderShallow, testSnapshotShallow } from '../../../../testUtils';
import { completeStep } from '../../../actions/steps';
import { navigatePush } from '../../../actions/navigation';
import StepSuggestionItem from '../';
import { STEP_DETAIL_SCREEN } from '../../../containers/StepDetailScreen';
import { CONTACT_STEPS } from '../../../constants';

jest.mock('.../../../actions/navigation');
jest.mock('.../../../actions/steps');

const step = {
  id: '1',
  body: 'Step of Faith',
};

describe('StepSuggestionItem', () => {
  it('renders correctly', () => {
    testSnapshotShallow(<StepSuggestionItem step={step} />);
  });

  it('navigates to StepDetailScreen', () => {
    navigatePush.mockReturnValue({ type: 'navigate push' });

    const component = renderShallow(<StepSuggestionItem step={step} />);

    component.props().onPress();

    expect(navigatePush).toHaveBeenCalledWith(STEP_DETAIL_SCREEN, { step });
  });

  it('calls completeStep', () => {
    completeStep.mockReturnValue({ type: 'complete step' });

    const component = renderShallow(<StepSuggestionItem step={step} />);

    component
      .childAt(0)
      .childAt(1)
      .props()
      .onPress();

    expect(completeStep).toHaveBeenCalledWith(step, CONTACT_STEPS);
  });
});
