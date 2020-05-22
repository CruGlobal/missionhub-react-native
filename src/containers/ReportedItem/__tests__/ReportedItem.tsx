import React from 'react';
import { Alert } from 'react-native';
import i18n from 'i18next';
import { fireEvent } from 'react-native-testing-library';
import { useMutation } from '@apollo/react-hooks';

import { renderWithContext } from '../../../../testUtils';

import ReportedItem, { RESPOND_TO_CONTENT_COMPLAINT } from '..';

jest.mock('../../../actions/celebrateComments');
jest.mock('../../../actions/reportComments');

const refetch = jest.fn();

const subject = {
  __typename: 'CommunityCelebrationItemComment' as 'CommunityCelebrationItemComment',
  content: 'something',
  createdAt: '2020-01-15T20:58:04Z',
  updatedAt: '2020-01-15T20:58:04Z',
  id: 'commentId',
  person: {
    __typename: 'Person' as 'Person',
    fullName: 'Christian Huffman',
    firstName: 'Christian',
    lastName: 'Huffman',
    id: 'someid',
  },
};
const person = {
  __typename: 'Person' as 'Person',
  id: 'personId',
  fullName: 'person full name',
};
const item = {
  __typename: 'ContentComplaint' as 'ContentComplaint',
  id: 'reportId',
  subject,
  person,
};
const org = { id: 'orgId', reportedComments: [item] };

const props = {
  item,
  organization: org,
  refetch,
};

const initialState = {
  organizations: {
    all: [org],
  },
  celebrateComments: {
    all: [org],
  },
  auth: {
    person,
  },
};

it('renders correctly', () => {
  const { snapshot } = renderWithContext(<ReportedItem {...props} />, {
    initialState,
  });
  snapshot();
});

describe('report item', () => {
  describe('Reported comment', () => {
    it('call handleDelete', async () => {
      Alert.alert = jest.fn();
      const { getByTestId, snapshot } = renderWithContext(
        <ReportedItem {...props} />,
        {
          initialState,
        },
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
          input: { contentComplaintId: item.id, response: 'delete' },
        },
      });
      expect(refetch).toHaveBeenCalled();
      snapshot();
    });

    it('call handleIgnore', async () => {
      const { snapshot, getByTestId } = renderWithContext(
        <ReportedItem {...props} />,
        {
          initialState,
        },
      );
      await fireEvent.press(getByTestId('ignoreButton'));
      expect(useMutation).toHaveBeenMutatedWith(RESPOND_TO_CONTENT_COMPLAINT, {
        variables: {
          input: { contentComplaintId: item.id, response: 'ignore' },
        },
      });
      expect(refetch).toHaveBeenCalled();
      snapshot();
    });
  });
  describe('Reported Story', () => {
    const StoryProps = {
      ...props,
      item: {
        __typename: 'ContentComplaint' as 'ContentComplaint',
        id: 'StoryReportId',
        subject: {
          id: 'storyId',
          content: 'some story',
          createdAt: '2020-01-15T20:58:04Z',
          updatedAt: '2020-01-15T20:58:04Z',
          __typename: 'Story' as 'Story',
          author: {
            __typename: 'Person' as 'Person',
            fullName: 'Christian Huffman',
            firstName: 'Christian',
            lastName: 'Huffman',
            id: 'someid',
          },
        },
        person,
      },
    };

    it('call handleDelete', async () => {
      Alert.alert = jest.fn();
      const { getByTestId, snapshot } = renderWithContext(
        <ReportedItem {...StoryProps} />,
        {
          initialState,
        },
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
          input: { contentComplaintId: StoryProps.item.id, response: 'delete' },
        },
      });
      expect(refetch).toHaveBeenCalled();
      snapshot();
    });

    it('call handleIgnore', async () => {
      const { snapshot, getByTestId } = renderWithContext(
        <ReportedItem {...StoryProps} />,
        {
          initialState,
        },
      );
      await fireEvent.press(getByTestId('ignoreButton'));
      expect(useMutation).toHaveBeenMutatedWith(RESPOND_TO_CONTENT_COMPLAINT, {
        variables: {
          input: { contentComplaintId: StoryProps.item.id, response: 'ignore' },
        },
      });
      expect(refetch).toHaveBeenCalled();
      snapshot();
    });
  });
});
