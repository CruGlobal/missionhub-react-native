/* eslint max-lines: 0 */
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { ORG_PERMISSIONS } from '../../../constants';
import { orgPermissionSelector } from '../../../selectors/people';

import AddContactFields from '..';

jest.mock('../../../selectors/people');

const orgPermission = { permission_id: ORG_PERMISSIONS.CONTACT };

const initialState = { auth: { person: {} } };
const onUpdateData = jest.fn();

beforeEach(() => {
  ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue(
    orgPermission,
  );
});

it('renders correctly | No Person', () => {
  const { snapshot } = renderWithContext(
    <AddContactFields
      organization={null}
      onUpdateData={onUpdateData}
      person={{}}
    />,
    {
      initialState,
    },
  );
  snapshot();
  expect(onUpdateData).toHaveBeenCalledWith({
    firstName: '',
    lastName: '',
  });
});

it('render correctly | With Person', () => {
  const { snapshot } = renderWithContext(
    <AddContactFields
      organization={null}
      onUpdateData={onUpdateData}
      person={{ first_name: 'Christian', last_name: 'Huffman' }}
    />,
    {
      initialState,
    },
  );
  snapshot();
  expect(onUpdateData).toHaveBeenCalledWith({
    firstName: 'Christian',
    lastName: 'Huffman',
  });
});

describe('calls methods', () => {
  it('calls update firstName and changeFocusedField', async () => {
    const { recordSnapshot, diffSnapshot, getByTestId } = renderWithContext(
      <AddContactFields
        organization={null}
        onUpdateData={onUpdateData}
        person={{}}
      />,
      {
        initialState,
      },
    );
    recordSnapshot();
    await fireEvent(getByTestId('firstNameInput'), 'onFocus');
    await fireEvent.changeText(getByTestId('firstNameInput'), 'Christian');
    diffSnapshot();
    expect(onUpdateData).toHaveBeenLastCalledWith({
      firstName: 'Christian',
      lastName: '',
    });
  });

  it('calls update lastName and changeFocusedField', async () => {
    const { recordSnapshot, diffSnapshot, getByTestId } = renderWithContext(
      <AddContactFields
        organization={null}
        onUpdateData={onUpdateData}
        person={{}}
      />,
      {
        initialState,
      },
    );
    recordSnapshot();
    await fireEvent(getByTestId('lastNameInput'), 'onFocus');
    await fireEvent.changeText(getByTestId('lastNameInput'), 'Huffman');
    diffSnapshot();
    expect(onUpdateData).toHaveBeenLastCalledWith({
      firstName: '',
      lastName: 'Huffman',
    });
  });
});
