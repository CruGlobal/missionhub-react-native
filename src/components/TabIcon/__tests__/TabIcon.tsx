import 'react-native';
import React from 'react';
import { flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';

import TabIcon from '..';

describe('renders', () => {
  it('steps', () => {
    renderWithContext(<TabIcon name={'steps'} tintColor={'blue'} />).snapshot();
  });

  it('steps different tint color', async () => {
    const { snapshot } = renderWithContext(
      <TabIcon name={'steps'} tintColor={'grey'} />,
    );

    await flushMicrotasksQueue();

    snapshot();
  });

  it('people', async () => {
    const { snapshot } = renderWithContext(
      <TabIcon name={'people'} tintColor={'blue'} />,
    );

    await flushMicrotasksQueue();

    snapshot();
  });

  it('communities', async () => {
    const { snapshot } = renderWithContext(
      <TabIcon name={'communities'} tintColor={'blue'} />,
      {
        mocks: {
          Int: () => 0,
        },
      },
    );

    await flushMicrotasksQueue();

    snapshot();
  });

  it('communities with notification dot', async () => {
    const { snapshot } = renderWithContext(
      <TabIcon name={'communities'} tintColor={'blue'} />,
    );

    await flushMicrotasksQueue();

    snapshot();
  });

  it('notifications', async () => {
    const { snapshot } = renderWithContext(
      <TabIcon name="notifications" tintColor={'blue'} />,
      {
        mocks: {
          Int: () => 0,
        },
      },
    );

    await flushMicrotasksQueue();

    snapshot();
  });

  it('notifications with notification dot', async () => {
    const { snapshot } = renderWithContext(
      <TabIcon name="notifications" tintColor={'blue'} />,
    );

    await flushMicrotasksQueue();

    snapshot();
  });
});
