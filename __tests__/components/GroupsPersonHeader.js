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
  getPersonPhoneNumber,
  getStageIndex,
} from '../../src/utils/common';
import { navigatePush } from '../../src/actions/navigation';
import { STATUS_SELECT_SCREEN } from '../../src/containers/StatusSelectScreen';
import { PERSON_STAGE_SCREEN } from '../../src/containers/PersonStageScreen';
import { STAGE_SCREEN } from '../../src/containers/StageScreen';
import { openCommunicationLink } from '../../src/actions/misc';

jest.mock('uuid/v4');
jest.mock('../../src/utils/common');
jest.mock('../../src/actions/person');
jest.mock('../../src/actions/misc');
jest.mock('../../src/actions/navigation');

const store = configureStore([thunk])();

const person = { id: '1002', first_name: 'Roge' };
const organization = { id: '50' };
const dispatch = store.dispatch;
const myId = '1001';
const stages = [];
const contactAssignment = { id: '500', pathway_stage_id: 3 };
const myStageId = 4;

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
const openLinkResult = { type: 'opened link' };
const navigatePushResult = { type: 'navigated' };

beforeEach(() => {
  uuidv4.mockReturnValue('some key');
  getPersonEmailAddress.mockReset();
  getPersonPhoneNumber.mockReset();
  createContactAssignment.mockReturnValue(createContactAssignmentResult);
  navigatePush.mockReturnValue(navigatePushResult);
  getStageIndex.mockReturnValue(myStageId);
  openCommunicationLink.mockReturnValue(openLinkResult);
  store.clearActions();
});

describe('is self', () => {
  it('renders', () => {
    testSnapshotShallow(
      <GroupsPersonHeader {...props} myId={person.id} isMember={true} />,
    );
  });

  it('should navigate to stage screen', () => {
    const screen = renderShallow(
      <GroupsPersonHeader
        {...props}
        myId={person.id}
        isMember={true}
        contactAssignment={contactAssignment}
        myStageId={myStageId}
      />,
    );

    screen
      .childAt(0)
      .childAt(0)
      .props()
      .onClick();

    expect(navigatePush).toHaveBeenCalledWith(STAGE_SCREEN, {
      onComplete: expect.anything(),
      firstItem: myStageId,
      contactId: person.id,
      section: 'people',
      subsection: 'self',
      enableBackButton: true,
    });
    expect(store.getActions()).toEqual([navigatePushResult]);
    expect(getStageIndex).toHaveBeenCalledWith(stages, myStageId);
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
        ACTIONS.TEXT_ENGAGED,
      );
      expect(store.getActions()).toEqual([openLinkResult]);
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
        ACTIONS.CALL_ENGAGED,
      );
      expect(store.getActions()).toEqual([openLinkResult]);
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
        ACTIONS.EMAIL_ENGAGED,
      );
      expect(store.getActions()).toEqual([openLinkResult]);
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

    it('should navigate to person stage screen', () => {
      const screen = renderShallow(
        <GroupsPersonHeader
          {...props}
          isMember={true}
          contactAssignment={contactAssignment}
        />,
      );

      screen
        .childAt(0)
        .childAt(0)
        .props()
        .onClick();

      expect(navigatePush).toHaveBeenCalledWith(PERSON_STAGE_SCREEN, {
        onComplete: expect.anything(),
        firstItem: myStageId,
        name: person.first_name,
        contactId: person.id,
        contactAssignmentId: contactAssignment.id,
        orgId: organization.id,
        section: 'people',
        subsection: 'person',
      });
      expect(store.getActions()).toEqual([navigatePushResult]);
      expect(getStageIndex).toHaveBeenCalledWith(
        stages,
        contactAssignment.pathway_stage_id,
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
