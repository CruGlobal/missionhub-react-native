import React from 'react';
import { Alert } from 'react-native';
import i18n from 'i18next';
import { renderWithContext } from '../../../../testUtils';
import { deleteCelebrateComment } from '../../../actions/celebrateComments';
import {
  ignoreReportComment,
  getReportedComments,
} from '../../../actions/reportComments';

import ReportCommentItem from '..';
import { fireEvent } from 'react-native-testing-library';

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
  orgId: org.id,
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
    snapshot();
  });

  it('call handleIgnore', async () => {
    const { snapshot, getByTestId } = renderWithContext(
      <ReportCommentItem {...props} />,
      {
        initialState,
      },
    );

    // expect(ignoreReportComment).toHaveBeenCalledWith(org.id, item.id);
    // expect(getReportedComments).toHaveBeenCalled();
  });
});
