import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import CelebrateItemName from '../index';
import { renderWithContext } from '../../../../testUtils';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { navToPersonScreen } from '../../../actions/person';
import { Organization } from '../../../reducers/organizations';
import { CELEBRATE_ITEM_PERSON_FRAGMENT } from '../../../components/CommunityFeedItem/queries';
import { GetCelebrateFeed_community_celebrationItems_nodes_subjectPerson as CelebrateItemPerson } from '../../CelebrateFeed/__generated__/GetCelebrateFeed';

jest.mock('../../../actions/person');

const person = mockFragment<CelebrateItemPerson>(
  CELEBRATE_ITEM_PERSON_FRAGMENT,
);
const name = `${person.firstName} ${person.lastName}`;
const organization: Organization = {
  id: '235234',
};

const navToPersonScreenResult = { type: 'navigated to person screen' };

beforeEach(() => {
  (navToPersonScreen as jest.Mock).mockReturnValue(navToPersonScreenResult);
});

it('renders correctly without name', () => {
  renderWithContext(
    <CelebrateItemName
      name={null}
      person={person}
      organization={organization}
      pressable={true}
    />,
  ).snapshot();
});

it('renders correctly with name', () => {
  renderWithContext(
    <CelebrateItemName
      name={name}
      person={person}
      organization={organization}
      pressable={true}
    />,
  ).snapshot();
});

it('renders correctly not pressable', () => {
  renderWithContext(
    <CelebrateItemName
      name={name}
      person={person}
      organization={organization}
      pressable={false}
    />,
  ).snapshot();
});

it('navigates to person screen', () => {
  const { store, getByTestId } = renderWithContext(
    <CelebrateItemName
      name={name}
      person={person}
      organization={organization}
      pressable={true}
    />,
  );

  fireEvent.press(getByTestId('NameButton'));

  expect(navToPersonScreen).toHaveBeenCalledWith(person, organization);
  expect(store.getActions()).toEqual([navToPersonScreenResult]);
});
