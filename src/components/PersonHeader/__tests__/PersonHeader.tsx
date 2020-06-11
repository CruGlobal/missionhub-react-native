import React from 'react';
import { flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { PersonHeader } from '../PersonHeader';
import {
  personTabs,
  PersonCollapsibleHeaderContext,
} from '../../../containers/PersonScreen/PersonTabs';

const personId = '1';

const testPersonTabs = personTabs({ isMe: false });

it('should render loading', () => {
  renderWithContext(
    <PersonHeader
      collapsibleHeaderContext={PersonCollapsibleHeaderContext}
      tabs={testPersonTabs}
    />,
    {
      navParams: { personId },
    },
  ).snapshot();
});

it('should load person data correctly', async () => {
  const { recordSnapshot, diffSnapshot } = renderWithContext(
    <PersonHeader
      collapsibleHeaderContext={PersonCollapsibleHeaderContext}
      tabs={testPersonTabs}
    />,
    {
      navParams: { personId },
    },
  );

  recordSnapshot();
  await flushMicrotasksQueue();
  diffSnapshot();
});

it('should hide edit and stage for members', async () => {
  const { rerender, recordSnapshot, diffSnapshot } = renderWithContext(
    <PersonHeader
      collapsibleHeaderContext={PersonCollapsibleHeaderContext}
      tabs={testPersonTabs}
    />,
    {
      navParams: { personId },
    },
  );

  await flushMicrotasksQueue();

  recordSnapshot();
  rerender(
    <PersonHeader
      isMember
      collapsibleHeaderContext={PersonCollapsibleHeaderContext}
      tabs={testPersonTabs}
    />,
  );
  diffSnapshot();
});
