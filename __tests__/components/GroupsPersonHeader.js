import React from 'react';
import uuidv4 from 'uuid/v4';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

import { ACTIONS } from '../../src/constants';
import { createContactAssignment } from '../../src/actions/person';
import GroupsPersonHeader from '../../src/components/GroupsPersonHeader/index';
import { testSnapshotShallow, renderShallow } from '../../testUtils/index';
import {
  getPersonEmailAddress,
  openCommunicationLink,
  getPersonPhoneNumber,
} from '../../src/utils/common';
import { navigatePush } from '../../src/actions/navigation';
import { STATUS_SELECT_SCREEN } from '../../src/containers/StatusSelectScreen';

jest.mock('uuid/v4');
jest.mock('../../src/utils/common');
jest.mock('../../src/actions/person');
jest.mock('../../src/actions/navigation');

const store = configureStore([thunk])({});

const person = { id: '1002' };
const organization = {};
const dispatch = store.dispatch;
const myId = '1001';
const stages = [];
const contactAssignment = { id: '500' };

const props = {
  person,
  organization,
  dispatch,
  myId,
  stages,
};

const phoneNumber = { number: '1800Roge' };
const emailAddress = { email: 'roge@test.com' };
const createContactAssignmentResult = { type: 'created contact assignment' };
const navigatePushResult = { type: 'navigated' };

beforeEach(() => {
  uuidv4.mockReturnValue('some key');
  getPersonEmailAddress.mockReset();
  getPersonPhoneNumber.mockReset();
  createContactAssignment.mockReturnValue(createContactAssignmentResult);
  navigatePush.mockReturnValue(navigatePushResult);
  store.clearActions();
});

//todo test with AND without stage?

describe('is self', () => {
  it('renders', () => {
    testSnapshotShallow(
      <GroupsPersonHeader {...props} myId={person.id} isMember={true} />,
    );
  });
});

describe('isMember', () => {
  it('renders with no contact assignment and no contact info', () => {
    testSnapshotShallow(
      <GroupsPersonHeader
        {...props}
        isMember={true}
        contactAssignment={undefined}
      />,
    );
  });

  describe('has contact info and contact assignment', () => {
    beforeEach(() => {
      getPersonEmailAddress.mockReturnValue(emailAddress);
      getPersonPhoneNumber.mockReturnValue(phoneNumber);
    });

    it('renders', () => {
      testSnapshotShallow(
        <GroupsPersonHeader
          {...props}
          isMember={true}
          contactAssignment={contactAssignment}
        />,
      );
    });

    it('should open sms link', () => {
      const screen = renderShallow(
        <GroupsPersonHeader
          {...props}
          isMember={true}
          contactAssignment={contactAssignment}
        />,
      );

      screen
        .childAt(0)
        .childAt(1)
        .props()
        .onClick();

      expect(openCommunicationLink).toHaveBeenCalledWith(
        `sms:${phoneNumber.number}`,
        dispatch,
        ACTIONS.TEXT_ENGAGED,
      );
    });

    it('should open call link', () => {
      const screen = renderShallow(
        <GroupsPersonHeader
          {...props}
          isMember={true}
          contactAssignment={contactAssignment}
        />,
      );

      screen
        .childAt(0)
        .childAt(2)
        .props()
        .onClick();

      expect(openCommunicationLink).toHaveBeenCalledWith(
        `tel:${phoneNumber.number}`,
        dispatch,
        ACTIONS.CALL_ENGAGED,
      );
    });

    it('should open email link', () => {
      const screen = renderShallow(
        <GroupsPersonHeader
          {...props}
          isMember={true}
          contactAssignment={contactAssignment}
        />,
      );

      screen
        .childAt(0)
        .childAt(3)
        .props()
        .onClick();

      expect(openCommunicationLink).toHaveBeenCalledWith(
        `mailto:${emailAddress.email}`,
        dispatch,
        ACTIONS.EMAIL_ENGAGED,
      );
    });
  });
});

describe('isContact', () => {
  describe('with no contact assignment', () => {
    it('renders with no contact assignment', () => {
      testSnapshotShallow(
        <GroupsPersonHeader
          {...props}
          isMember={false}
          contactAssignment={undefined}
        />,
      );
    });

    it('assigns to me when clicked', () => {
      const screen = renderShallow(
        <GroupsPersonHeader
          {...props}
          isMember={false}
          contactAssignment={undefined}
        />,
      );

      screen
        .childAt(0)
        .props()
        .onPress();

      expect(createContactAssignment).toHaveBeenCalledWith(
        organization.id,
        myId,
        person.id,
      );
      expect(store.getActions()).toEqual([createContactAssignmentResult]);
    });
  });

  describe('with contact assignment', () => {
    it('renders', () => {
      testSnapshotShallow(
        <GroupsPersonHeader
          {...props}
          isMember={false}
          contactAssignment={contactAssignment}
        />,
      );
    });

    it('navigates to status select screen', () => {
      const screen = renderShallow(
        <GroupsPersonHeader
          {...props}
          isMember={false}
          contactAssignment={contactAssignment}
        />,
      );

      screen
        .childAt(0)
        .childAt(1)
        .props()
        .onClick();

      expect(navigatePush).toHaveBeenCalledWith(STATUS_SELECT_SCREEN, {
        person,
        organization,
      });
      expect(store.getActions()).toEqual([navigatePushResult]);
    });
  });
});
