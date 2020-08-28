/* eslint-disable max-lines */
import React from 'react';
import { ActionSheetIOS } from 'react-native';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { ORG_PERMISSIONS } from '../../../constants';
import { orgPermissionSelector } from '../../../selectors/people';
import { getPersonDetails } from '../../../actions/person';
import { navigatePush } from '../../../actions/navigation';
import { RelationshipTypeEnum } from '../../../../__generated__/globalTypes';
import { PersonType } from '../../AddContactScreen';
import { PERSON_FRAGMENT } from '../../PersonItem/queries';
import { PersonFragment } from '../../PersonItem/__generated__/PersonFragment';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import AddContactFields from '..';

jest.mock('../../../selectors/people');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/person');
jest.mock('../../../auth/authStore', () => ({ isAuthenticated: () => true }));

const orgPermission = { permission_id: ORG_PERMISSIONS.CONTACT };
const getPersonDetailsResults = { type: 'get person details' };
const navigatePushResults = { type: 'navigate push' };
const myId = '2';
const onUpdateData = jest.fn();
const emptyPerson: PersonType = {
  id: '',
  firstName: '',
  lastName: '',
  fullName: '',
  relationshipType: null,
  stage: null,
  steps: {
    __typename: 'StepConnection',
    pageInfo: { __typename: 'BasePageInfo', totalCount: 0 },
  },
  picture: null,
};
const next = jest.fn();
const mockImage = 'base64image.jpeg';

const mockPersonFragment = mockFragment<PersonFragment>(PERSON_FRAGMENT, {
  mocks: {
    Stage: () => ({ id: '2', name: 'Forgiven' }),
  },
});
const mockPerson: PersonType = {
  ...mockPersonFragment,
  firstName: 'Christian',
  lastName: 'Huffman',
  fullName: 'Christian Huffman',
  relationshipType: RelationshipTypeEnum.family,
  picture: mockImage,
};

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
      mocks: { User: () => ({ person: () => ({ id: myId }) }) },
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
      person={{ ...mockPerson, id: myId, picture: mockImage }}
    />,
    {
      mocks: { User: () => ({ person: () => ({ id: myId }) }) },
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
        ...mockPerson,
        id: myId,
        picture: null,
      }}
    />,
    {
      mocks: { User: () => ({ person: () => ({ id: myId }) }) },
    },
  );
  snapshot();
});

it('render correctly | With Person | No Stage', () => {
  const { snapshot } = renderWithContext(
    <AddContactFields
      next={next}
      organization={null}
      onUpdateData={onUpdateData}
      person={{ ...mockPerson, id: myId, stage: null }}
    />,
    {
      mocks: { User: () => ({ person: () => ({ id: myId }) }) },
    },
  );
  snapshot();
});

it('render correctly | With Person | Not Me | No Person Category', () => {
  const { snapshot } = renderWithContext(
    <AddContactFields
      next={next}
      organization={null}
      onUpdateData={onUpdateData}
      person={{
        ...mockPerson,
        relationshipType: null,
      }}
    />,
    {
      mocks: { User: () => ({ person: () => ({ id: myId }) }) },
    },
  );
  snapshot();
});

it('render correctly | With Person | Not Me | With Person Category', () => {
  const { snapshot } = renderWithContext(
    <AddContactFields
      next={next}
      organization={null}
      onUpdateData={onUpdateData}
      person={{
        ...mockPerson,
        relationshipType: RelationshipTypeEnum.family,
      }}
    />,
    {
      mocks: { User: () => ({ person: () => ({ id: myId }) }) },
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
    );
    recordSnapshot();
    fireEvent(getByTestId('firstNameInput'), 'onFocus');
    fireEvent.changeText(getByTestId('firstNameInput'), 'Christian');
    diffSnapshot();
    expect(onUpdateData).toHaveBeenLastCalledWith({
      ...emptyPerson,
      firstName: 'Christian',
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
    );
    recordSnapshot();
    fireEvent(getByTestId('lastNameInput'), 'onFocus');
    fireEvent.changeText(getByTestId('lastNameInput'), 'Huffman');
    diffSnapshot();
    expect(onUpdateData).toHaveBeenLastCalledWith({
      ...emptyPerson,
      lastName: 'Huffman',
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
          ...mockPerson,
          relationshipType: RelationshipTypeEnum.family,
        }}
      />,
    );
    recordSnapshot();
    fireEvent(getByTestId('popupMenuButton'), 'onPress');
    (ActionSheetIOS.showActionSheetWithOptions as jest.Mock).mock.calls[0][1](
      1,
    );
    diffSnapshot();
    expect(onUpdateData).toHaveBeenLastCalledWith({
      ...mockPerson,
      relationshipType: RelationshipTypeEnum.friend,
    });
  });

  it('updates profile picture', async () => {
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <AddContactFields
        next={next}
        organization={null}
        onUpdateData={onUpdateData}
        person={{ ...mockPerson, id: myId, picture: null }}
      />,
      {
        mocks: { User: () => ({ person: () => ({ id: myId }) }) },
      },
    );

    await flushMicrotasksQueue();
    recordSnapshot();
    await fireEvent(getByTestId('ImagePicker'), 'onSelectImage', {
      data: `data:image/jpeg;base64,${mockImage}`,
    });
    diffSnapshot();
    expect(onUpdateData).toHaveBeenLastCalledWith({
      ...mockPerson,
      id: myId,
      picture: `data:image/jpeg;base64,${mockImage}`,
    });
  });

  it('updates Stage', () => {
    const { getByTestId } = renderWithContext(
      <AddContactFields
        next={next}
        organization={null}
        onUpdateData={onUpdateData}
        person={{ ...mockPerson, id: myId }}
      />,
    );
    fireEvent.press(getByTestId('stageSelectButton'));
    expect(next).toHaveBeenCalledWith({
      orgId: undefined,
      person: { ...mockPerson, id: myId },
      navigateToStageSelection: true,
      updatePerson: onUpdateData,
    });
  });
});
