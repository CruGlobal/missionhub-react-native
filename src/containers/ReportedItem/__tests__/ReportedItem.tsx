import React from 'react';
import { Alert } from 'react-native';
import i18n from 'i18next';
import { fireEvent } from 'react-native-testing-library';
import { useMutation } from '@apollo/react-hooks';

import { renderWithContext } from '../../../../testUtils';
import {
  RESPOND_TO_CONTENT_COMPLAINT_GROUP,
  REPORTED_ITEM_FRAGMENT,
} from '../queries';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { ReportedItem as ReportedItemFragment } from '../__generated__/ReportedItem';
import {
  ContentComplaintResponseEnum,
  ContentComplaintSubjectTypeEnum,
} from '../../../../__generated__/globalTypes';

import ReportedItem from '..';

const initialState = { auth: { person: { id: '1' } } };

const mockReportedId = '1234';

const reportedComment = mockFragment<ReportedItemFragment>(
  REPORTED_ITEM_FRAGMENT,
  {
    mocks: {
      ContentComplaintGroup: () => ({
        subject: () => ({ __typename: 'FeedItemComment', id: mockReportedId }),
      }),
    },
  },
);

const reportedPost = mockFragment<ReportedItemFragment>(
  REPORTED_ITEM_FRAGMENT,
  {
    mocks: {
      ContentComplaintGroup: () => ({
        subject: () => ({ __typename: 'Post', id: mockReportedId }),
      }),
    },
  },
);

it('renders correctly', () => {
  const { snapshot } = renderWithContext(
    <ReportedItem reportedItem={reportedComment} />,
    { initialState },
  );
  snapshot();
});

describe('Reported comment', () => {
  it('call handleDelete', async () => {
    Alert.alert = jest.fn();
    const { getByTestId, snapshot } = renderWithContext(
      <ReportedItem reportedItem={reportedComment} />,
      { initialState },
    );

    await fireEvent.press(getByTestId('deleteButton'));
    await (Alert.alert as jest.Mock).mock.calls[0][2][1].onPress();
    expect(Alert.alert).toHaveBeenCalledWith(
      i18n.t('communityReported:deleteFeedItemComment.title'),
      i18n.t('communityReported:deleteFeedItemComment.message'),
      [
        { text: i18n.t('cancel'), style: 'cancel' },
        {
          text: i18n.t('communityReported:deleteFeedItemComment.buttonText'),
          onPress: expect.any(Function),
        },
      ],
    );
    expect(useMutation).toHaveBeenMutatedWith(
      RESPOND_TO_CONTENT_COMPLAINT_GROUP,
      {
        variables: {
          input: {
            response: ContentComplaintResponseEnum.delete,
            subjectId: mockReportedId,
            subjectType: ContentComplaintSubjectTypeEnum.FeedItemComment,
          },
        },
      },
    );

    snapshot();
  });

  it('call handleIgnore', async () => {
    const { snapshot, getByTestId } = renderWithContext(
      <ReportedItem reportedItem={reportedComment} />,
      { initialState },
    );
    await fireEvent.press(getByTestId('ignoreButton'));
    expect(useMutation).toHaveBeenMutatedWith(
      RESPOND_TO_CONTENT_COMPLAINT_GROUP,
      {
        variables: {
          input: {
            response: ContentComplaintResponseEnum.ignore,
            subjectId: mockReportedId,
            subjectType: ContentComplaintSubjectTypeEnum.FeedItemComment,
          },
        },
      },
    );

    snapshot();
  });
});
describe('Reported Post', () => {
  it('call handleDelete', async () => {
    Alert.alert = jest.fn();
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <ReportedItem reportedItem={reportedPost} />,
      {
        initialState,
      },
    );
    recordSnapshot();
    await fireEvent.press(getByTestId('deleteButton'));
    await (Alert.alert as jest.Mock).mock.calls[0][2][1].onPress();
    expect(Alert.alert).toHaveBeenCalledWith(
      i18n.t('communityReported:deletePost.title'),
      i18n.t('communityReported:deletePost.message'),
      [
        { text: i18n.t('cancel'), style: 'cancel' },
        {
          text: i18n.t('communityReported:deletePost.buttonText'),
          onPress: expect.any(Function),
        },
      ],
    );
    diffSnapshot();
    expect(useMutation).toHaveBeenMutatedWith(
      RESPOND_TO_CONTENT_COMPLAINT_GROUP,
      {
        variables: {
          input: {
            response: ContentComplaintResponseEnum.delete,
            subjectId: mockReportedId,
            subjectType: ContentComplaintSubjectTypeEnum.Post,
          },
        },
      },
    );
  });

  it('call handleIgnore', async () => {
    const { diffSnapshot, recordSnapshot, getByTestId } = renderWithContext(
      <ReportedItem reportedItem={reportedPost} />,
      {
        initialState,
      },
    );
    recordSnapshot();
    await fireEvent.press(getByTestId('ignoreButton'));
    expect(useMutation).toHaveBeenMutatedWith(
      RESPOND_TO_CONTENT_COMPLAINT_GROUP,
      {
        variables: {
          input: {
            response: ContentComplaintResponseEnum.ignore,
            subjectId: mockReportedId,
            subjectType: ContentComplaintSubjectTypeEnum.Post,
          },
        },
      },
    );
    diffSnapshot();
  });
});
