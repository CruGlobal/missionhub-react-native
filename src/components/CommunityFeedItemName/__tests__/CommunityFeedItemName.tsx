import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { CommunityFeedItemName } from '../index';
import { renderWithContext } from '../../../../testUtils';
import { navToPersonScreen } from '../../../actions/person';

jest.mock('../../../actions/person');
jest.mock('../../../selectors/people');

const name = 'Test Person';
const personId = '1';

const navToPersonScreenResult = { type: 'navigated to person screen' };

beforeEach(() => {
  (navToPersonScreen as jest.Mock).mockReturnValue(navToPersonScreenResult);
});

it('renders correctly without name', () => {
  renderWithContext(
    <CommunityFeedItemName name={null} personId={personId} pressable={true} />,
  ).snapshot();
});

it('renders correctly with name', () => {
  renderWithContext(
    <CommunityFeedItemName name={name} personId={personId} pressable={true} />,
  ).snapshot();
});

it('renders correctly not pressable', () => {
  renderWithContext(
    <CommunityFeedItemName name={name} personId={personId} pressable={false} />,
  ).snapshot();
});

it('navigates to person screen', () => {
  const { store, getByTestId } = renderWithContext(
    <CommunityFeedItemName name={name} personId={personId} pressable={true} />,
  );

  fireEvent.press(getByTestId('NameButton'));

  expect(navToPersonScreen).toHaveBeenCalledWith(personId);
  expect(store.getActions()).toEqual([navToPersonScreenResult]);
});

it('does not navigate if not apart of community', () => {
  const { store, getByTestId } = renderWithContext(
    <CommunityFeedItemName name={name} personId={undefined} pressable={true} />,
  );

  fireEvent.press(getByTestId('NameButton'));

  expect(navToPersonScreen).not.toHaveBeenCalled();
  expect(store.getActions()).toEqual([]);
});
