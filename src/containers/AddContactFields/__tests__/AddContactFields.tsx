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
const emptyPerson = {
  id: '',
  firstName: '',
  lastName: '',
  relationshipType: null,
};

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
      person={emptyPerson}
    />,
    {
      initialState,
    },
  );
  snapshot();
});

it('render correctly | With Person', () => {
  const { snapshot } = renderWithContext(
    <AddContactFields
      organization={null}
      onUpdateData={onUpdateData}
      person={{
        id: '1',
        relationshipType: null,
        firstName: 'Christian',
        lastName: 'Huffman',
      }}
    />,
    {
      initialState,
    },
  );
  snapshot();
});

describe('calls methods', () => {
  it('calls update firstName and changeFocusedField', () => {
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <AddContactFields
        organization={null}
        onUpdateData={onUpdateData}
        person={emptyPerson}
      />,
      {
        initialState,
      },
    );
    recordSnapshot();
    fireEvent(getByTestId('firstNameInput'), 'onFocus');
    fireEvent.changeText(getByTestId('firstNameInput'), 'Christian');
    diffSnapshot();
    expect(onUpdateData).toHaveBeenLastCalledWith({
      firstName: 'Christian',
      id: '',
      lastName: '',
      relationshipType: null,
    });
  });

  it('calls update lastName and changeFocusedField', () => {
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <AddContactFields
        organization={null}
        onUpdateData={onUpdateData}
        person={emptyPerson}
      />,
      {
        initialState,
      },
    );
    recordSnapshot();
    fireEvent(getByTestId('lastNameInput'), 'onFocus');
    fireEvent.changeText(getByTestId('lastNameInput'), 'Huffman');
    diffSnapshot();
    expect(onUpdateData).toHaveBeenLastCalledWith({
      firstName: '',
      lastName: 'Huffman',
      id: '',
      relationshipType: null,
    });
  });
});
