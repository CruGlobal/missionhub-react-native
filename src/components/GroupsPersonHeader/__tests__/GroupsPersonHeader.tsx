/* eslint max-lines: 0 */

import React from 'react';
import uuidv4 from 'uuid/v4';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

import { ACTIONS } from '../../../constants';
import {
  createContactAssignment,
  updatePersonAttributes,
  getPersonDetails,
} from '../../../actions/person';
import { testSnapshotShallow, renderShallow } from '../../../../testUtils';
import {
  getPersonEmailAddress,
  getPersonPhoneNumber,
  getStageIndex,
} from '../../../utils/common';
import { navigatePush } from '../../../actions/navigation';
import { STATUS_SELECT_SCREEN } from '../../../containers/StatusSelectScreen';
import {
  openCommunicationLink,
  navigateToStageScreen,
} from '../../../actions/misc';
import { reloadJourney } from '../../../actions/journey';

import GroupsPersonHeader from '..';

jest.mock('uuid/v4');
jest.mock('../../../utils/common');
jest.mock('../../../actions/person');
jest.mock('../../../actions/misc');
jest.mock('../../../actions/journey');
jest.mock('../../../actions/navigation');

const store = configureStore([thunk])();

const person = { id: '1002', first_name: 'Roge' };
const organization = { id: '50' };
const dispatch = store.dispatch;
const myId = '1001';
// @ts-ignore
const stages = [];
const myStageId = '4';
const personStageId = '3';
const contactAssignment = {
  id: '500',
  pathway_stage_id: personStageId,
  organization: { id: '231413' },
};
const isCruOrg = true;

const props = {
  person,
  organization,
  dispatch,
  myId,
  // @ts-ignore
  stages,
  isCruOrg,
};

const phoneNumber = { number: '1800Roge' };
const emailAddress = { email: 'roge@test.com' };
const createContactAssignmentResult = { type: 'created contact assignment' };
const openLinkResult = { type: 'opened link' };
const navigatePushResult = { type: 'navigated' };
const updatePersonResult = { type: 'update person attributes' };
const getPersonResult = { type: 'get person details' };
const reloadJourneyResult = { type: 'load steps and journey' };
const navigateToStageResult = { type: 'navigate to stage screen ' };

beforeEach(() => {
  // @ts-ignore
  uuidv4.mockReturnValue('some key');
  // @ts-ignore
  createContactAssignment.mockReturnValue(createContactAssignmentResult);
  // @ts-ignore
  navigatePush.mockReturnValue(navigatePushResult);
  // @ts-ignore
  getStageIndex.mockReturnValue(myStageId);
  // @ts-ignore
  openCommunicationLink.mockReturnValue(openLinkResult);
  // @ts-ignore
  updatePersonAttributes.mockReturnValue(updatePersonResult);
  // @ts-ignore
  getPersonDetails.mockReturnValue(getPersonResult);
  // @ts-ignore
  reloadJourney.mockReturnValue(reloadJourneyResult);
  // @ts-ignore
  navigateToStageScreen.mockReturnValue(navigateToStageResult);
  store.clearActions();
});

describe('is self', () => {
  it('renders for Cru Community', () => {
    testSnapshotShallow(
      <GroupsPersonHeader
        {...props}
        // @ts-ignore
        myId={person.id}
        isMember={true}
        isCruOrg={true}
      />,
    );
  });
  it('renders for User Created Community', () => {
    testSnapshotShallow(
      <GroupsPersonHeader
        {...props}
        // @ts-ignore
        myId={person.id}
        isMember={true}
        isCruOrg={false}
      />,
    );
  });

  it('should navigate to select stage flow', () => {
    const screen = renderShallow(
      <GroupsPersonHeader
        {...props}
        // @ts-ignore
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

    expect(navigateToStageScreen).toHaveBeenCalledWith(
      true,
      person,
      contactAssignment,
      organization,
      myStageId,
    );
    expect(store.getActions()).toEqual([navigateToStageResult]);
    // @ts-ignore
    expect(getStageIndex).toHaveBeenCalledWith(stages, myStageId);
  });
});

describe('isMember', () => {
  it('renders with no contact assignment and no contact info', () => {
    testSnapshotShallow(
      <GroupsPersonHeader
        {...props}
        // @ts-ignore
        isMember={true}
        contactAssignment={undefined}
      />,
    );
  });

  it('renders null because its not supposed to be visible', () => {
    testSnapshotShallow(
      // @ts-ignore
      <GroupsPersonHeader {...props} isMember={true} isVisible={false} />,
    );
  });

  it('renders null with no contact assignment for User-Created Org', () => {
    testSnapshotShallow(
      // @ts-ignore
      <GroupsPersonHeader {...props} isMember={true} isCruOrg={false} />,
    );
  });

  describe('has contact info and contact assignment', () => {
    beforeEach(() => {
      // @ts-ignore
      getPersonEmailAddress.mockReturnValue(emailAddress);
      // @ts-ignore
      getPersonPhoneNumber.mockReturnValue(phoneNumber);
    });

    it('renders for Cru Community', () => {
      testSnapshotShallow(
        <GroupsPersonHeader
          {...props}
          // @ts-ignore
          isMember={true}
          contactAssignment={contactAssignment}
        />,
      );
    });

    it('renders for User-Created Community', () => {
      testSnapshotShallow(
        <GroupsPersonHeader
          {...props}
          // @ts-ignore
          isMember={true}
          isCruOrg={false}
          contactAssignment={contactAssignment}
        />,
      );
    });

    it('should open sms link', () => {
      const screen = renderShallow(
        <GroupsPersonHeader
          {...props}
          // @ts-ignore
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
          // @ts-ignore
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
          // @ts-ignore
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
          // @ts-ignore
          isMember={false}
          contactAssignment={undefined}
        />,
      );
    });
  });

  describe('with contact assignment', () => {
    it('renders status button if contact is part of org', () => {
      testSnapshotShallow(
        <GroupsPersonHeader
          {...props}
          // @ts-ignore
          isMember={false}
          contactAssignment={contactAssignment}
        />,
      );
    });

    it('does not render status button if contact is not part of org', () => {
      testSnapshotShallow(
        <GroupsPersonHeader
          {...props}
          // @ts-ignore
          isMember={false}
          contactAssignment={{
            id: '500',
            pathway_stage_id: '3',
          }}
        />,
      );
    });

    it('renders no contact buttons if not Cru Org', () => {
      testSnapshotShallow(
        <GroupsPersonHeader
          {...props}
          // @ts-ignore
          isMember={false}
          isCruOrg={false}
          contactAssignment={contactAssignment}
        />,
      );
    });

    it('should navigate to select person stage flow, contact assignment', () => {
      // @ts-ignore
      getStageIndex.mockReturnValue(personStageId);

      const screen = renderShallow(
        <GroupsPersonHeader
          {...props}
          // @ts-ignore
          isMember={false}
          contactAssignment={contactAssignment}
          person={person}
        />,
      );

      screen
        .childAt(0)
        .childAt(0)
        .props()
        .onClick();

      expect(navigateToStageScreen).toHaveBeenCalledWith(
        false,
        person,
        contactAssignment,
        organization,
        personStageId,
      );
      expect(store.getActions()).toEqual([navigateToStageResult]);
      // @ts-ignore
      expect(getStageIndex).toHaveBeenCalledWith(stages, personStageId);
    });

    it('navigates to status select screen', () => {
      const screen = renderShallow(
        <GroupsPersonHeader
          {...props}
          // @ts-ignore
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
