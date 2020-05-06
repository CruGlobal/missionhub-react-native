import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { CommunityFeedItemName } from '../index';
import { renderWithContext } from '../../../../testUtils';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { navToPersonScreen } from '../../../actions/person';
import { COMMUNITY_PERSON_FRAGMENT } from '../../CommunityFeedItem/queries';
import { CommunityPerson } from '../../CommunityFeedItem/__generated__/CommunityPerson';
import { orgPermissionSelector } from '../../../selectors/people';
import { ORG_PERMISSIONS } from '../../../constants';

jest.mock('../../../actions/person');
jest.mock('../../../selectors/people');

const person = mockFragment<CommunityPerson>(COMMUNITY_PERSON_FRAGMENT);

const name = `${person.firstName} ${person.lastName}`;

const communityId = '235234';

const navToPersonScreenResult = { type: 'navigated to person screen' };

beforeEach(() => {
  (navToPersonScreen as jest.Mock).mockReturnValue(navToPersonScreenResult);
  ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue({
    permission_id: ORG_PERMISSIONS.USER,
  });
});

it('renders correctly without name', () => {
  renderWithContext(
    <CommunityFeedItemName
      name={null}
      person={person}
      communityId={communityId}
      pressable={true}
    />,
  ).snapshot();
});

it('renders correctly with name', () => {
  renderWithContext(
    <CommunityFeedItemName
      name={name}
      person={person}
      communityId={communityId}
      pressable={true}
    />,
  ).snapshot();
});

it('renders correctly not pressable', () => {
  renderWithContext(
    <CommunityFeedItemName
      name={name}
      person={person}
      communityId={communityId}
      pressable={false}
    />,
  ).snapshot();
});

it('navigates to person screen', () => {
  const { store, getByTestId } = renderWithContext(
    <CommunityFeedItemName
      name={name}
      person={person}
      communityId={communityId}
      pressable={true}
    />,
  );

  fireEvent.press(getByTestId('NameButton'));

  expect(navToPersonScreen).toHaveBeenCalledWith(person, { id: communityId });
  expect(store.getActions()).toEqual([navToPersonScreenResult]);
});

it('does not navigate if not apart of community', () => {
  ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue(null);
  const { store, getByTestId } = renderWithContext(
    <CommunityFeedItemName
      name={name}
      person={person}
      communityId={communityId}
      pressable={true}
    />,
  );

  fireEvent.press(getByTestId('NameButton'));

  expect(navToPersonScreen).not.toHaveBeenCalled();
  expect(store.getActions()).toEqual([]);
});
