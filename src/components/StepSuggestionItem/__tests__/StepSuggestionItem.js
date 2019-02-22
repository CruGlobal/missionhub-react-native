import React from 'react';

import { renderShallow, testSnapshotShallow } from '../../../../testUtils';
import { navigatePush } from '../../../actions/navigation';
import StepSuggestionItem from '../';
import { STEP_DETAIL_SCREEN } from '../../../containers/StepDetailScreen';

jest.mock('.../../../actions/navigation');

const receiverId = '2423423';
const orgId = '89989';
const step = {
  id: '1',
  body: 'Step of Faith',
};

const props = { receiverId, orgId, step };

navigatePush.mockReturnValue({ type: 'navigate push' });

describe('StepSuggestionScreen', () => {
  it('renders correctly', () => {
    testSnapshotShallow(<StepSuggestionItem {...props} />);
  });

  it('navigates to StepDetailScreen', () => {
    const component = renderShallow(<StepSuggestionItem {...props} />);

    component.props().onPress();

    expect(navigatePush).toHaveBeenCalledWith(STEP_DETAIL_SCREEN, props);
  });
});
