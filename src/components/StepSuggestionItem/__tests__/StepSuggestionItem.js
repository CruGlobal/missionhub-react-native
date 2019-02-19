import React from 'react';

import { renderShallow, testSnapshotShallow } from '../../../../testUtils';
import { navigatePush } from '../../../actions/navigation';
import StepSuggestionItem from '../';
import { STEP_DETAIL_SCREEN } from '../../../containers/StepDetailScreen';

jest.mock('.../../../actions/navigation');

const step = {
  id: '1',
  body: 'Step of Faith',
};

describe('StepSuggestionScreen', () => {
  it('renders correctly', () => {
    testSnapshotShallow(<StepSuggestionItem step={step} />);
  });

  it('navigates to StepDetailScreen', () => {
    navigatePush.mockReturnValue({ type: 'navigate push' });

    const component = renderShallow(<StepSuggestionItem step={step} />);

    component.props().onPress();

    expect(navigatePush).toHaveBeenCalledWith(STEP_DETAIL_SCREEN, { step });
  });
});
