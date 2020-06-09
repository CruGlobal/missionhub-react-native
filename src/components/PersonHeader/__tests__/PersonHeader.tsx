import React from 'react';
import { flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { PersonHeader } from '../PersonHeader';

const personId = '1';

it('should render loading', () => {
  renderWithContext(<PersonHeader />, {
    navParams: { personId },
  }).snapshot();
});

it('should load person data correctly', async () => {
  const { recordSnapshot, diffSnapshot } = renderWithContext(<PersonHeader />, {
    navParams: { personId },
  });

  recordSnapshot();
  await flushMicrotasksQueue();
  diffSnapshot();
});

it('should hide edit and stage for members', async () => {
  const { rerender, recordSnapshot, diffSnapshot } = renderWithContext(
    <PersonHeader />,
    {
      navParams: { personId },
    },
  );

  await flushMicrotasksQueue();

  recordSnapshot();
  rerender(<PersonHeader isMember />);
  diffSnapshot();
});
