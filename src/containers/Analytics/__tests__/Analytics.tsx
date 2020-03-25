import React from 'react';

import { renderWithContext } from '../../../../testUtils';
import { ScreenContext } from '../../../actions/analytics';
import { ANALYTICS_SECTION_TYPE } from '../../../constants';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';

import Analytics from '..';

jest.mock('../../../utils/hooks/useAnalytics');

const screenName = 'screen';
const screenContext = { [ANALYTICS_SECTION_TYPE]: 'onboarding' } as Partial<
  ScreenContext
>;

it('renders and calls useAnalytics hook', () => {
  renderWithContext(<Analytics screenName={screenName} />).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(screenName, undefined);
});

it('renders and calls useAnalytics hook with context', () => {
  const screenName = 'screen';

  renderWithContext(
    <Analytics screenName={screenName} screenContext={screenContext} />,
  ).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(screenName, { screenContext });
});
