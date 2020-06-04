import React from 'react';

import { renderWithContext } from '../../../../testUtils';
import {
  useAnalytics,
  UseAnalyticsOptions,
  UseAnalyticsParams,
} from '../../../utils/hooks/useAnalytics';

import Analytics from '..';

jest.mock('../../../utils/hooks/useAnalytics');

const screenName = 'screen';
const screenParams = { personId: '11' } as UseAnalyticsParams;
const screenOptions = {
  includeSectionType: true,
} as UseAnalyticsOptions;

it('renders and calls useAnalytics hook', () => {
  renderWithContext(<Analytics screenName={screenName} />).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(screenName, undefined);
});

it('renders and calls useAnalytics hook with params and options', () => {
  const screenName = 'screen';

  renderWithContext(
    <Analytics
      screenName={screenName}
      params={screenParams}
      options={screenOptions}
    />,
  ).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(
    screenName,
    screenParams,
    screenOptions,
  );
});
