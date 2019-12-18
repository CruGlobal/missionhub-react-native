import React from 'react';

import { renderWithContext } from '../../../../testUtils';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';

import { TrackOnFocus } from '..';

jest.mock('../../../utils/hooks/useAnalytics');

it('renders and calls useAnalytics hook', () => {
  const screenName = 'screen';
  const onFocus = jest.fn();

  renderWithContext(
    <TrackOnFocus screenName={screenName} onFocus={onFocus} />,
  ).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(screenName, onFocus);
});
