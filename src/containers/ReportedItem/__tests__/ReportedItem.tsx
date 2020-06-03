import React from 'react';
import { Alert } from 'react-native';
import i18n from 'i18next';
import { fireEvent } from 'react-native-testing-library';
import { useMutation } from '@apollo/react-hooks';

import { renderWithContext } from '../../../../testUtils';
import {
  RESPOND_TO_CONTENT_COMPLAINT,
  REPORTED_ITEM_FRAGMENT,
} from '../queries';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { ReportedItem as ReportedItemFragment } from '../__generated__/ReportedItem';

import ReportedItem from '..';

const refetch = jest.fn();

const initialState = { auth: { person: { id: '1' } } };

const reportedComment = mockFragment<ReportedItemFragment>(
  REPORTED_ITEM_FRAGMENT,
  {
    mocks: {
      ContentComplaint: () => ({
        subject: () => ({ __typename: 'FeedItemComment' }),
      }),
    },
  },
);

const reportedPost = mockFragment<ReportedItemFragment>(
  REPORTED_ITEM_FRAGMENT,
  {
    mocks: {
      ContentComplaint: () => ({
        subject: () => ({ __typename: 'Post' }),
      }),
    },
  },
);

it('renders correctly', () => {
  const { snapshot } = renderWithContext(
    <ReportedItem reportedItem={reportedComment} refetch={refetch} />,
    { initialState },
  );
  snapshot();
});

describe('Reported comment', () => {
  it('call handleDelete', async () => {
    Alert.alert = jest.fn();
    const { getByTestId, snapshot } = renderWithContext(
      <ReportedItem reportedItem={reportedComment} refetch={refetch} />,
      { initialState },
    );

    await fireEvent.press(getByTestId('deleteButton'));
    await (Alert.alert as jest.Mock).mock.calls[0][2][1].onPress();
    expect(Alert.alert).toHaveBeenCalledWith(
      i18n.t('reportComment:deleteTitle'),
      '',
      [
        { text: i18n.t('cancel'), style: 'cancel' },
        { text: i18n.t('ok'), onPress: expect.any(Function) },
      ],
    );
    expect(useMutation).toHaveBeenMutatedWith(RESPOND_TO_CONTENT_COMPLAINT, {
      variables: {
        input: { contentComplaintId: reportedComment.id, response: 'delete' },
      },
    });
    expect(refetch).toHaveBeenCalled();
    snapshot();
  });

  it('call handleIgnore', async () => {
    const { snapshot, getByTestId } = renderWithContext(
      <ReportedItem reportedItem={reportedComment} refetch={refetch} />,
      { initialState },
    );
    await fireEvent.press(getByTestId('ignoreButton'));
    expect(useMutation).toHaveBeenMutatedWith(RESPOND_TO_CONTENT_COMPLAINT, {
      variables: {
        input: { contentComplaintId: reportedComment.id, response: 'ignore' },
      },
    });
    expect(refetch).toHaveBeenCalled();
    snapshot();
  });
});
describe('Reported Post', () => {
  it('call handleDelete', async () => {
    Alert.alert = jest.fn();
    const { getByTestId, snapshot } = renderWithContext(
      <ReportedItem reportedItem={reportedPost} refetch={refetch} />,
      { initialState },
    );

    await fireEvent.press(getByTestId('deleteButton'));
    await (Alert.alert as jest.Mock).mock.calls[0][2][1].onPress();
    expect(Alert.alert).toHaveBeenCalledWith(
      i18n.t('reportComment:deleteTitle'),
      '',
      [
        { text: i18n.t('cancel'), style: 'cancel' },
        { text: i18n.t('ok'), onPress: expect.any(Function) },
      ],
    );
    expect(useMutation).toHaveBeenMutatedWith(RESPOND_TO_CONTENT_COMPLAINT, {
      variables: {
        input: { contentComplaintId: reportedPost.id, response: 'delete' },
      },
    });
    expect(refetch).toHaveBeenCalled();
    snapshot();
  });

  it('call handleIgnore', async () => {
    const { snapshot, getByTestId } = renderWithContext(
      <ReportedItem reportedItem={reportedPost} refetch={refetch} />,
      { initialState },
    );
    await fireEvent.press(getByTestId('ignoreButton'));
    expect(useMutation).toHaveBeenMutatedWith(RESPOND_TO_CONTENT_COMPLAINT, {
      variables: {
        input: { contentComplaintId: reportedPost.id, response: 'ignore' },
      },
    });
    expect(refetch).toHaveBeenCalled();
    snapshot();
  });
});
