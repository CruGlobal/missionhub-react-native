/* eslint max-lines: 0 */
import React from 'react';
import { ActionSheetIOS } from 'react-native';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { ORG_PERMISSIONS } from '../../../constants';
import { orgPermissionSelector } from '../../../selectors/people';
import { getPersonDetails } from '../../../actions/person';
import { navigatePush } from '../../../actions/navigation';
import { RelationshipTypeEnum } from '../../../../__generated__/globalTypes';

import AddContactFields from '..';

jest.mock('../../../selectors/people');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/person');

const orgPermission = { permission_id: ORG_PERMISSIONS.CONTACT };
const getPersonDetailsResults = { type: 'get person details' };
const navigatePushResults = { type: 'navigate push' };
const myMockId = '2';
const initialState = { auth: { person: { id: myMockId } } };
const onUpdateData = jest.fn();
const emptyPerson = {
  id: '',
  firstName: '',
  lastName: '',
  relationshipType: null,
  stage: null,
  picture: null,
};
const next = jest.fn();
const mockImage = 'base64image.jpeg';

beforeEach(() => {
  ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue(
    orgPermission,
  );
  (getPersonDetails as jest.Mock).mockReturnValue(getPersonDetailsResults);
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResults);
  next.mockReturnValue({ type: 'next' });
});

it('renders correctly | No Person', () => {
  const { snapshot } = renderWithContext(
    <AddContactFields
      next={next}
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

it('render correctly | With Person | With Picture', () => {
  const { snapshot } = renderWithContext(
    <AddContactFields
      next={next}
      organization={null}
      onUpdateData={onUpdateData}
      person={{
        id: myMockId,
        relationshipType: null,
        firstName: 'Christian',
        lastName: 'Huffman',
        stage: {
          name: 'Forgiven',
          __typename: 'Stage',
        },
        picture: mockImage,
      }}
    />,
    {
      initialState,
    },
  );
  snapshot();
});

it('render correctly | With Person | No Picture', () => {
  const { snapshot } = renderWithContext(
    <AddContactFields
      next={next}
      organization={null}
      onUpdateData={onUpdateData}
      person={{
        id: myMockId,
        relationshipType: null,
        firstName: 'Christian',
        lastName: 'Huffman',
        stage: {
          name: 'Forgiven',
          __typename: 'Stage',
        },
        picture: null,
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
        next={next}
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
      stage: null,
      picture: null,
    });
  });

  it('calls update lastName and changeFocusedField', () => {
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <AddContactFields
        next={next}
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
      stage: null,
      picture: null,
    });
  });

  it('updates relationshipType', () => {
    ActionSheetIOS.showActionSheetWithOptions = jest.fn();
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <AddContactFields
        next={next}
        organization={null}
        onUpdateData={onUpdateData}
        person={{
          id: '1',
          relationshipType: RelationshipTypeEnum.family,
          firstName: 'Christian',
          lastName: 'Huffman',
          stage: {
            name: 'Forgiven',
            __typename: 'Stage',
          },
          picture: mockImage,
        }}
      />,
      {
        initialState,
      },
    );
    recordSnapshot();
    fireEvent(getByTestId('popupMenuButton'), 'onPress');
    (ActionSheetIOS.showActionSheetWithOptions as jest.Mock).mock.calls[0][1](
      1,
    );
    diffSnapshot();
    expect(onUpdateData).toHaveBeenLastCalledWith({
      firstName: 'Christian',
      lastName: 'Huffman',
      id: '1',
      relationshipType: RelationshipTypeEnum.friend,
      stage: {
        name: 'Forgiven',
        __typename: 'Stage',
      },
      picture: mockImage,
    });
  });

  it('updates profile picture', async () => {
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <AddContactFields
        next={next}
        organization={null}
        onUpdateData={onUpdateData}
        person={{
          id: myMockId,
          relationshipType: RelationshipTypeEnum.family,
          firstName: 'Christian',
          lastName: 'Huffman',
          stage: {
            name: 'Forgiven',
            __typename: 'Stage',
          },
          picture: null,
        }}
      />,
      {
        initialState,
      },
    );
    recordSnapshot();
    await fireEvent(getByTestId('ImagePicker'), 'onSelectImage', {
      data: `data:image/jpeg;base64,${mockImage}`,
    });
    diffSnapshot();
    expect(onUpdateData).toHaveBeenLastCalledWith({
      firstName: 'Christian',
      lastName: 'Huffman',
      id: myMockId,
      relationshipType: RelationshipTypeEnum.family,
      stage: {
        name: 'Forgiven',
        __typename: 'Stage',
      },
      picture: `data:image/jpeg;base64,${mockImage}`,
    });
  });

  it('updates Stage', () => {
    const { getByTestId } = renderWithContext(
      <AddContactFields
        next={next}
        organization={null}
        onUpdateData={onUpdateData}
        person={{
          id: '1',
          relationshipType: RelationshipTypeEnum.family,
          firstName: 'Christian',
          lastName: 'Huffman',
          stage: {
            __typename: 'Stage',
            name: 'Forgiven',
          },
          picture: mockImage,
        }}
      />,
      {
        initialState,
      },
    );
    fireEvent.press(getByTestId('stageSelectButton'));
    expect(next).toHaveBeenCalledWith({
      orgId: undefined,
      person: {
        id: '1',
        relationshipType: RelationshipTypeEnum.family,
        firstName: 'Christian',
        lastName: 'Huffman',
        stage: {
          __typename: 'Stage',
          name: 'Forgiven',
        },
        picture: mockImage,
      },
      navigateToStageSelection: true,
      updatePerson: onUpdateData,
    });
  });
});
