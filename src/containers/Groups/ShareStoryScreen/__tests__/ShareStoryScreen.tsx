import React from 'react';
import ShareStoryScreen from '..';
import { renderWithContext } from '../../../../../testUtils';
import { navigatePush } from '../../../../actions/navigation';

const onComplete = jest.fn();
jest.mock('../../../../actions/navigation');
const navigatePushResult = { type: 'navigated push' };

const organization = {
  id: '1234',
};

beforeEach(() => {
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResult);
});

it('renders correctly', () => {
  renderWithContext(<ShareStoryScreen />, {
    initialState: {
      navigation: { state: { params: { onComplete, organization } } },
    },
  }).snapshot();
});
