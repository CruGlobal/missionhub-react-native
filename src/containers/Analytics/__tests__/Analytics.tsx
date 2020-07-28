import React from 'react';

import { renderWithContext } from '../../../../testUtils';
import {
  useAnalytics,
  UseAnalyticsOptions,
} from '../../../utils/hooks/useAnalytics';
import Analytics from '..';

jest.mock('../../../utils/hooks/useAnalytics');

const screenName = 'screen';
const screenContext = {
  assignmentType: { personId: '12', communityId: '34' },
} as UseAnalyticsOptions;

it('renders and calls useAnalytics hook', () => {
  renderWithContext(<Analytics screenName={screenName} />).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(screenName, undefined);
});

it('renders and calls useAnalytics hook with context', () => {
  const screenName = 'screen';

  renderWithContext(
    <Analytics screenName={screenName} screenContext={screenContext} />,
  ).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(screenName, screenContext);
});
