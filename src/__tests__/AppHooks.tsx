import React from 'react';

import AppHooks from '../AppHooks';
import { useFeatureFlags } from '../utils/hooks/useFeatureFlags';
import { renderWithContext } from '../../testUtils';

jest.mock('../utils/hooks/useFeatureFlags', () => ({
  useFeatureFlags: jest.fn(),
}));

it('calls useFeatureFlags on mount', () => {
  renderWithContext(<AppHooks />);

  expect(useFeatureFlags).toHaveBeenCalledWith();
});
