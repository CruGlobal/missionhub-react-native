import React from 'react';

import { renderWithContext } from '../../../../testUtils';
import { ScreenContext } from '../../../actions/analytics';
import { ANALYTICS_ASSIGNMENT_TYPE } from '../../../constants';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';

import Analytics from '..';

jest.mock('../../../utils/hooks/useAnalytics');

it('renders and calls useAnalytics hook', () => {
  const screenName = 'screen';
  const screenContext: Partial<ScreenContext> = {
    [ANALYTICS_ASSIGNMENT_TYPE]: 'self',
  };

  renderWithContext(
    <Analytics screenName={screenName} screenContext={screenContext} />,
  ).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith({ screenName, screenContext });
});
