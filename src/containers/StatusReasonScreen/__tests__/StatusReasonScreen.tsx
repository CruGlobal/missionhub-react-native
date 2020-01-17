import React from 'react';

import {
  createThunkStore,
  renderShallow,
  createMockNavState,
} from '../../../../testUtils';
import { deleteContactAssignment } from '../../../actions/person';
import { navigateBack } from '../../../actions/navigation';

import StatusReasonScreen from '..';

jest.mock('../../../actions/person');
jest.mock('../../../actions/navigation');

const store = createThunkStore({
  auth: {
    person: {
      id: '123',
      first_name: 'Me',
    },
  },
});

const orgPermission = { id: 'orgPerm1', organization_id: '1' };
const person = {
  id: 'person1',
  first_name: 'Person',
  full_name: 'Person One',
  organizational_permissions: [orgPermission],
};
const organization = { id: '1', name: 'Test Org' };
const contactAssignment = { id: '4' };

let onSubmit = undefined;

deleteContactAssignment.mockReturnValue({ type: 'deleted contact assignment' });
navigateBack.mockReturnValue({ type: 'navigated back' });

describe('StatusReasonScreen', () => {
  const createComponent = () => {
    return renderShallow(
      <StatusReasonScreen
        navigation={createMockNavState({
          person,
          organization,
          contactAssignment,
          onSubmit,
        })}
      />,
      store,
    );
  };

  it('should render correctly', () => {
    expect(createComponent()).toMatchSnapshot();
  });

  it('should change text', () => {
    const instance = createComponent().instance();
    const text = 'test';
    instance.handleChangeText(text);
    expect(instance.state.text).toBe(text);
  });

  it('should submit with note', () => {
    const instance = createComponent().instance();
    const text = 'test';
    instance.setState({ text });
    instance.submit();
    expect(deleteContactAssignment).toHaveBeenCalledWith(
      contactAssignment.id,
      person.id,
      organization.id,
      text,
    );
  });

  it('should submit with false', () => {
    const instance = createComponent().instance();
    instance.submit();
    expect(deleteContactAssignment).toHaveBeenCalledWith(
      contactAssignment.id,
      person.id,
      organization.id,
      '',
    );
  });

  it('should call onSubmit if exists', () => {
    onSubmit = jest.fn();
    const instance = createComponent().instance();
    instance.submit();
    expect(onSubmit).toHaveBeenCalled();
  });

  it('should call navigateBack if onSubmit does not exist', () => {
    onSubmit = undefined;
    const instance = createComponent().instance();
    instance.submit();
    expect(navigateBack).toHaveBeenCalled();
  });
});
