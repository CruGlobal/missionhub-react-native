import React from 'react';
import { Alert } from 'react-native';
import i18n from 'i18next';

import {
  testSnapshotShallow,
  renderShallow,
  createMockStore,
} from '../../../../testUtils';
import { deleteCelebrateComment } from '../../../actions/celebrateComments';
import {
  ignoreReportComment,
  getReportedComments,
} from '../../../actions/reportComments';

import ReportCommentItem from '..';

jest.mock('../../../actions/celebrateComments');
jest.mock('../../../actions/reportComments');

deleteCelebrateComment.mockReturnValue({ type: 'delete comment' });
ignoreReportComment.mockReturnValue({ type: 'ignore comment' });
getReportedComments.mockReturnValue({ type: 'get report comments' });

beforeEach(() => {
  store = createMockStore(mockStore);
});

const event = { id: 'eventId' };
const org = { id: 'orgId', reportedComments: [item] };
const comment = {
  id: 'commentId',
  content: 'something',
  person: {
    first_name: 'commentFirst',
    last_name: 'commentLast',
    full_name: 'commentFirst commentLast',
  },
  organization_celebration_item: event,
};
const person = {
  id: 'personId',
  full_name: 'person full name',
};
const item = { id: 'reportId', comment, person };
const props = {
  item,
  organization: org,
};

let store;
const mockStore = {
  organizations: {
    all: [org],
  },
};

it('renders correctly', () => {
  testSnapshotShallow(<ReportCommentItem {...props} />);
});

describe('report item', () => {
  let component;
  beforeEach(() => {
    Alert.alert = jest.fn((a, b, c) => c[1].onPress());
    component = renderShallow(
      <ReportCommentItem item={item} organization={org} />,
      store,
    );
  });

  it('call handleDelete', async () => {
    await component
      .childAt(2)
      .childAt(1)
      .childAt(0)
      .props()
      .onPress();

    expect(Alert.alert).toHaveBeenCalledWith(
      i18n.t('reportComment:deleteTitle'),
      '',
      [
        { text: i18n.t('cancel'), style: 'cancel' },
        { text: i18n.t('ok'), onPress: expect.any(Function) },
      ],
    );
    expect(deleteCelebrateComment).toHaveBeenCalledWith(
      org.id,
      event,
      item.comment,
    );
    expect(getReportedComments).toHaveBeenCalled();
  });

  it('call handleIgnore', async () => {
    await component
      .childAt(2)
      .childAt(0)
      .childAt(0)
      .props()
      .onPress();

    expect(ignoreReportComment).toHaveBeenCalledWith(org.id, item.id);
    expect(getReportedComments).toHaveBeenCalled();
  });
});
