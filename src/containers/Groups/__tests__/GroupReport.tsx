import React from 'react';
import { flushMicrotasksQueue, fireEvent } from 'react-native-testing-library';
import { useMutation } from '@apollo/react-hooks';

import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import GroupReport from '../GroupReport';
import { renderWithContext } from '../../../../testUtils';
import { navigateBack } from '../../../actions/navigation';

jest.mock('../../../utils/hooks/useAnalytics');
jest.mock('../../../actions/celebrateComments');
jest.mock('../../../actions/reportComments');
jest.mock('../../../actions/navigation');

const organization = { id: '12345' };
const navigateBackResult = { type: 'navigate back' };
const me = { id: 'myId' };
const comment1 = { id: 'reported1' };
const initialState = {
  organizations: [],
  auth: {
    person: me,
  },
  celebrateComments: {
    all: {
      [organization.id]: [comment1],
    },
  },
};

const mockReportedContentList = [
  {
    subject: () => ({
      __typename: 'CommunityCelebrationItemComment',
    }),
  },
  {
    subject: () => ({
      __typename: 'Story',
    }),
  },
];

beforeEach(() => {
  (navigateBack as jest.Mock).mockReturnValue(navigateBackResult);
});

it('should render correctly', async () => {
  const { snapshot, queryByText } = renderWithContext(<GroupReport />, {
    initialState,
    navParams: {
      organization,
    },
    mocks: {
      Community: () => ({
        contentComplaints: () => ({
          nodes: () => mockReportedContentList,
        }),
      }),
    },
  });

  await flushMicrotasksQueue();
  expect(useAnalytics).toHaveBeenCalledWith(['celebrate', 'reported content']);
  expect(queryByText('No items have been reported.')).not.toBeTruthy();
  snapshot();
});

it('should render empty correctly', async () => {
  const { snapshot, queryByText } = renderWithContext(<GroupReport />, {
    initialState,
    navParams: {
      organization,
    },
    mocks: {
      Community: () => ({
        contentComplaints: () => ({
          nodes: () => [],
        }),
      }),
    },
  });

  await flushMicrotasksQueue();
  expect(useAnalytics).toHaveBeenCalledWith(['celebrate', 'reported content']);
  expect(queryByText('No items have been reported.')).toBeTruthy();
  snapshot();
});

it('should call navigate back', async () => {
  const { snapshot, queryByText, getByTestId } = renderWithContext(
    <GroupReport />,
    {
      initialState,
      navParams: {
        organization,
      },
      mocks: {
        Community: () => ({
          contentComplaints: () => ({
            nodes: () => mockReportedContentList,
          }),
        }),
      },
    },
  );

  await flushMicrotasksQueue();
  expect(useAnalytics).toHaveBeenCalledWith(['celebrate', 'reported content']);
  expect(queryByText('No comments have been reported.')).not.toBeTruthy();
  await fireEvent.press(getByTestId('closeButton'));
  snapshot();
  expect(navigateBack).toHaveBeenCalled();
});

it('should refresh correctly', async () => {
  // const refetch = jest.fn();
  const { snapshot, queryByText, getAllByTestId } = renderWithContext(
    <GroupReport />,
    {
      initialState,
      navParams: {
        organization,
      },
      mocks: {
        Community: () => ({
          contentComplaints: () => ({
            nodes: () => mockReportedContentList,
          }),
        }),
      },
    },
  );

  await flushMicrotasksQueue();
  expect(useAnalytics).toHaveBeenCalledWith(['celebrate', 'reported content']);
  expect(queryByText('No comments have been reported.')).not.toBeTruthy();
  await fireEvent.press(getAllByTestId('ignoreButton')[0]);
  expect(useMutation).toHaveBeenCalled();
  snapshot();
});
