import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { CommunityFeedItemName } from '../index';
import { renderWithContext } from '../../../../testUtils';
import { COMMUNITY_MEMBER_TABS } from '../../../containers/Communities/Community/CommunityMembers/CommunityMember/CommunityMemberTabs';
import { navigatePush } from '../../../actions/navigation';

jest.mock('../../../actions/navigation');
jest.mock('../../../selectors/people');

const name = 'Test Person';
const personId = '1';
const communityId = '2';

const navigatePushResult = { type: 'navigatePush' };

beforeEach(() => {
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResult);
});

it('renders correctly without name', () => {
  renderWithContext(
    <CommunityFeedItemName
      name={null}
      personId={personId}
      communityId={communityId}
      pressable={true}
    />,
  ).snapshot();
});

it('renders correctly with name', () => {
  renderWithContext(
    <CommunityFeedItemName
      name={name}
      personId={personId}
      communityId={communityId}
      pressable={true}
    />,
  ).snapshot();
});

it('renders correctly not pressable', () => {
  renderWithContext(
    <CommunityFeedItemName
      name={name}
      personId={personId}
      communityId={communityId}
      pressable={false}
    />,
  ).snapshot();
});

it('navigates to person screen', () => {
  const { store, getByTestId } = renderWithContext(
    <CommunityFeedItemName
      name={name}
      personId={personId}
      communityId={communityId}
      pressable={true}
    />,
  );

  fireEvent.press(getByTestId('NameButton'));

  expect(navigatePush).toHaveBeenCalledWith(COMMUNITY_MEMBER_TABS, {
    personId,
    communityId,
  });
  expect(store.getActions()).toEqual([navigatePushResult]);
});

it('does not navigate if not apart of community', () => {
  const { store, getByTestId } = renderWithContext(
    <CommunityFeedItemName name={name} personId={undefined} pressable={true} />,
  );

  fireEvent.press(getByTestId('NameButton'));

  expect(navigatePush).not.toHaveBeenCalled();
  expect(store.getActions()).toEqual([]);
});
