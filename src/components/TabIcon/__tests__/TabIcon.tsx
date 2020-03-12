import 'react-native';
import React from 'react';
import { MockList } from 'graphql-tools';
import { flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';

import TabIcon from '..';

describe('renders', () => {
  it('steps', () => {
    renderWithContext(<TabIcon name={'steps'} tintColor={'blue'} />, {
      mocks: {
        CommunityConnection: () => ({
          nodes: () => [],
        }),
      },
    }).snapshot();
  });

  it('steps different tint color', async () => {
    const { snapshot } = renderWithContext(
      <TabIcon name={'steps'} tintColor={'grey'} />,
      {
        mocks: {
          CommunityConnection: () => ({
            nodes: () => [],
          }),
        },
      },
    );

    await flushMicrotasksQueue();

    snapshot();
  });

  it('people', async () => {
    const { snapshot } = renderWithContext(
      <TabIcon name={'people'} tintColor={'blue'} />,
      {
        mocks: {
          CommunityConnection: () => ({
            nodes: () => [],
          }),
        },
      },
    );

    await flushMicrotasksQueue();

    snapshot();
  });

  it('group', async () => {
    const { snapshot } = renderWithContext(
      <TabIcon name={'group'} tintColor={'blue'} />,
      {
        mocks: {
          CommunityConnection: () => ({
            nodes: () => [],
          }),
        },
      },
    );

    await flushMicrotasksQueue();

    snapshot();
  });

  it('group with notification dot', async () => {
    const { snapshot } = renderWithContext(
      <TabIcon name={'group'} tintColor={'blue'} />,
      {
        mocks: {
          CommunityConnection: () => ({
            nodes: () => new MockList(10),
          }),
        },
      },
    );

    await flushMicrotasksQueue();

    snapshot();
  });
});
