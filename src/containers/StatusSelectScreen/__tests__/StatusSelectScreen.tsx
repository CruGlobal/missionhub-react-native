import React from 'react';

import {
  createThunkStore,
  renderShallow,
  testSnapshotShallow,
  createMockNavState,
} from '../../../../testUtils';
import { updateFollowupStatus } from '../../../actions/person';
import * as navigation from '../../../actions/navigation';
import { STATUS_COMPLETE_SCREEN } from '../../StatusCompleteScreen';
import {
  contactAssignmentSelector,
  orgPermissionSelector,
  personSelector,
} from '../../../selectors/people';

import StatusSelectScreen, { mapStateToProps } from '..';

jest.mock('../../../actions/person', () => ({
  updateFollowupStatus: jest.fn(() => () => Promise.resolve()),
}));
jest.mock('../../../selectors/people');

const store = createThunkStore({});

const followupStatus = 'uncontacted';
const orgPermission = {
  id: 'orgPerm1',
  organization_id: '1',
  followup_status: followupStatus,
};
const contactAssignment = { id: 'assignment1' };

const person = {
  id: 'person1',
  full_name: 'Person One',
  organizational_permissions: [orgPermission],
};
const organization = { id: '1', name: 'Test Org' };

// @ts-ignore
contactAssignmentSelector.mockReturnValue(contactAssignment);
// @ts-ignore
orgPermissionSelector.mockReturnValue(orgPermission);
// @ts-ignore
personSelector.mockReturnValue(person);

describe('mapStateToProps', () => {
  it('provides props correctly', () => {
    expect(
      mapStateToProps(
        {
          auth: {
            person: {
              id: '1',
            },
          },
          people: {
            allByOrg: {
              [organization.id]: person,
            },
          },
        },
        {
          navigation: {
            state: {
              params: {
                organization,
                person,
              },
            },
          },
        },
      ),
    ).toEqual({
      person,
      organization,
      orgPermission,
      contactAssignment,
      status: followupStatus,
    });
  });
});

describe('StatusSelectScreen', () => {
  let instance;

  const component = (
    <StatusSelectScreen
      navigation={createMockNavState({
        person,
        organization,
      })}
    />
  );
  // @ts-ignore
  navigation.navigateBack = jest.fn(() => ({ type: 'navigated back' }));
  // @ts-ignore
  navigation.navigatePush = jest.fn(() => ({ type: 'navigated push' }));

  // @ts-ignore
  const testSubmit = async type => {
    instance = renderShallow(component, store).instance();
    instance.setState({ selected: type });
    // @ts-ignore
    await instance.submit();
    expect(updateFollowupStatus).toHaveBeenCalledWith(
      person,
      orgPermission.id,
      type,
    );
  };

  it('should render correctly', () => {
    testSnapshotShallow(component, store);
  });

  it('should navigate back', async () => {
    const instance = renderShallow(component, store).instance();
    // @ts-ignore
    await instance.submit();
    expect(navigation.navigateBack).toHaveBeenCalled();
  });

  it('should update status to attempted_contact', async () => {
    await testSubmit('attempted_contact');
  });

  it('should update status to completed', async () => {
    await testSubmit('completed');

    expect(navigation.navigatePush).toHaveBeenCalledWith(
      STATUS_COMPLETE_SCREEN,
      {
        organization,
        person,
        contactAssignment,
      },
    );
  });

  it('should update status to do_not_contact', async () => {
    await testSubmit('do_not_contact');

    expect(navigation.navigatePush).toHaveBeenCalledWith(
      STATUS_COMPLETE_SCREEN,
      {
        organization,
        person,
        contactAssignment,
      },
    );
  });

  it('set the state to contacted', () => {
    const instance = renderShallow(component, store).instance();
    const status = 'contacted';
    // @ts-ignore
    instance.select(status);
    // @ts-ignore
    expect(instance.state.selected).toEqual(status);
  });
});