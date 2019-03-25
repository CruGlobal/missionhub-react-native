import React from 'react';

import { renderShallow, testSnapshotShallow } from '../../../../testUtils';
import StepSuggestionItem from '../';

jest.mock('.../../../actions/navigation');

const receiverId = '2423423';
const orgId = '89989';
const step = {
  id: '1',
  body: 'Step of Faith',
};
const next = jest.fn(() => ({ type: 'hello world' }));

const props = { receiverId, orgId, step, next };

describe('StepSuggestionScreen', () => {
  it('renders correctly', () => {
    testSnapshotShallow(<StepSuggestionItem {...props} />);
  });

  it('executes next', () => {
    const component = renderShallow(<StepSuggestionItem {...props} />);

    component.props().onPress();

    expect(next).toHaveBeenCalledWith({
      isAddingCustomStep: false,
      step,
      receiverId,
      orgId,
    });
  });
});
