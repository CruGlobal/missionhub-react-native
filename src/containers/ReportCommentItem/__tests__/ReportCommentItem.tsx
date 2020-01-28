import React from 'react';
import { Alert } from 'react-native';
import i18n from 'i18next';
import { fireEvent } from 'react-native-testing-library';
import { useMutation } from '@apollo/react-hooks';

import { renderWithContext } from '../../../../testUtils';
import { deleteCelebrateComment } from '../../../actions/celebrateComments';
import {
  ignoreReportComment,
  getReportedComments,
} from '../../../actions/reportComments';

import ReportCommentItem, { RESPOND_TO_CONTENT_COMPLAINT } from '..';

jest.mock('../../../actions/celebrateComments');
jest.mock('../../../actions/reportComments');

(deleteCelebrateComment as jest.Mock).mockReturnValue({
  type: 'delete item',
});
(ignoreReportComment as jest.Mock).mockReturnValue({ type: 'ignore item' });
(getReportedComments as jest.Mock).mockReturnValue({
  type: 'get report items',
});
const refetch = jest.fn();

const subject = {
  id: 'commentId',
  content: 'something',
  createdAt: '2020-01-15T20:58:04Z',
  typeName: 'CommunityCelebrationItemComment',
  person: {
    fullName: 'Christian Huffman',
  },
};
const person = {
  id: 'personId',
  fullName: 'person full name',
};
const item = {
  id: 'reportId',
  subject,
  person,
};
const org = { id: 'orgId', reportedComments: [item] };

const props = {
  item,
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
  const { snapshot } = renderWithContext(<ReportCommentItem {...props} />, {
    initialState,
  });
  snapshot();
});

describe('report item', () => {
  describe('Reported comment', () => {
    it('call handleDelete', async () => {
      Alert.alert = jest.fn();
      const { getByTestId, snapshot } = renderWithContext(
        <ReportCommentItem {...props} />,
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
        <ReportCommentItem {...props} />,
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
        id: 'StoryReportId',
        subject: {
          id: 'storyId',
          content: 'some story',
          createdAt: '2020-01-15T20:58:04Z',
          typeName: 'Story',
          author: {
            fullName: 'Christian Huffman',
          },
        },
        person,
      },
    };

    it('call handleDelete', async () => {
      Alert.alert = jest.fn();
      const { getByTestId, snapshot } = renderWithContext(
        <ReportCommentItem {...StoryProps} />,
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
        <ReportCommentItem {...StoryProps} />,
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
