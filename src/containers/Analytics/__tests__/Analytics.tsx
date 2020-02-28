import React from 'react';

import { renderWithContext } from '../../../../testUtils';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';

import Analytics from '..';

jest.mock('../../../utils/hooks/useAnalytics');

it('renders and calls useAnalytics hook', () => {
  const screenName = 'screen';

  renderWithContext(<Analytics screenName={screenName} />).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith({ screenName });
});
