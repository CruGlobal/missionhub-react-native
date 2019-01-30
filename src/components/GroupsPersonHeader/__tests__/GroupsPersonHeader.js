/* eslint max-lines: 0, max-lines-per-function: 0 */

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

import GroupsPersonHeader from '..';

import { testSnapshotShallow, renderShallow } from '../../../../testUtils';
import {
  getPersonEmailAddress,
  getPersonPhoneNumber,
  getStageIndex,
} from '../../../utils/common';
import { navigatePush } from '../../../actions/navigation';
import { STATUS_SELECT_SCREEN } from '../../../containers/StatusSelectScreen';
import { PERSON_STAGE_SCREEN } from '../../../containers/PersonStageScreen';
import { STAGE_SCREEN } from '../../../containers/StageScreen';
import {
  openCommunicationLink,
  loadStepsAndJourney,
} from '../../../actions/misc';

jest.mock('uuid/v4');
jest.mock('../../../utils/common');
jest.mock('../../../actions/person');
jest.mock('../../../actions/misc');
jest.mock('../../../actions/navigation');

const store = configureStore([thunk])();

const person = { id: '1002', first_name: 'Roge' };
const organization = { id: '50' };
const dispatch = store.dispatch;
const myId = '1001';
const stages = [];
const contactAssignment = {
  id: '500',
  pathway_stage_id: 3,
  organization: { id: '231413' },
};
const myStageId = 4;
const isCruOrg = true;

const props = {
  person,
  organization,
  dispatch,
  myId,
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
const loadStepsJourneyResult = { type: 'load steps and journey' };

beforeEach(() => {
  uuidv4.mockReturnValue('some key');
  getPersonEmailAddress.mockReset();
  getPersonPhoneNumber.mockReset();
  createContactAssignment.mockReturnValue(createContactAssignmentResult);
  navigatePush.mockReturnValue(navigatePushResult);
  getStageIndex.mockReturnValue(myStageId);
  openCommunicationLink.mockReturnValue(openLinkResult);
  updatePersonAttributes.mockReturnValue(updatePersonResult);
  getPersonDetails.mockReturnValue(getPersonResult);
  loadStepsAndJourney.mockReturnValue(loadStepsJourneyResult);
  store.clearActions();
});

describe('is self', () => {
  it('renders for Cru Community', () => {
    testSnapshotShallow(
      <GroupsPersonHeader
        {...props}
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
        myId={person.id}
        isMember={true}
        isCruOrg={false}
      />,
    );
  });

  it('should navigate to stage screen', () => {
    const stage = { id: '5' };
    navigatePush.mockImplementation((_, { onComplete }) => {
      onComplete && onComplete(stage);
      return navigatePushResult;
    });

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
    expect(store.getActions()).toEqual([
      updatePersonResult,
      loadStepsJourneyResult,
      navigatePushResult,
    ]);
    expect(getStageIndex).toHaveBeenCalledWith(stages, myStageId);
    expect(updatePersonAttributes).toHaveBeenCalledWith(person.id, {
      user: { pathway_stage_id: stage.id },
    });
    expect(loadStepsAndJourney).toHaveBeenCalledWith(person, organization);
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

  it('renders null because its not supposed to be visible', () => {
    testSnapshotShallow(
      <GroupsPersonHeader {...props} isMember={true} isVisible={false} />,
    );
  });

  it('renders null with no contact assignment for User-Created Org', () => {
    testSnapshotShallow(
      <GroupsPersonHeader {...props} isMember={true} isCruOrg={false} />,
    );
  });

  describe('has contact info and contact assignment', () => {
    beforeEach(() => {
      getPersonEmailAddress.mockReturnValue(emailAddress);
      getPersonPhoneNumber.mockReturnValue(phoneNumber);
    });

    it('renders for Cru Community', () => {
      testSnapshotShallow(
        <GroupsPersonHeader
          {...props}
          isMember={true}
          contactAssignment={contactAssignment}
        />,
      );
    });

    it('renders for User-Created Community', () => {
      testSnapshotShallow(
        <GroupsPersonHeader
          {...props}
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
  });

  describe('with contact assignment', () => {
    it('renders status button if contact is part of org', () => {
      testSnapshotShallow(
        <GroupsPersonHeader
          {...props}
          isMember={false}
          contactAssignment={contactAssignment}
        />,
      );
    });

    it('does not render status button if contact is not part of org', () => {
      testSnapshotShallow(
        <GroupsPersonHeader
          {...props}
          isMember={false}
          contactAssignment={{
            id: '500',
            pathway_stage_id: 3,
          }}
        />,
      );
    });

    it('renders no contact buttons if not Cru Org', () => {
      testSnapshotShallow(
        <GroupsPersonHeader
          {...props}
          isMember={false}
          isCruOrg={false}
          contactAssignment={contactAssignment}
        />,
      );
    });

    it('should navigate to person stage screen, contact assignment', () => {
      const stage = { id: '5' };
      navigatePush.mockImplementation((_, { onComplete }) => {
        onComplete && onComplete(stage);
        return navigatePushResult;
      });

      const reverseContactAssignment = {
        id: contactAssignment.id,
      };
      const newPerson = {
        ...person,
        reverse_contact_assignments: [reverseContactAssignment],
      };

      const screen = renderShallow(
        <GroupsPersonHeader
          {...props}
          isMember={true}
          contactAssignment={contactAssignment}
          person={newPerson}
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
      expect(store.getActions()).toEqual([
        updatePersonResult,
        loadStepsJourneyResult,
        navigatePushResult,
      ]);
      expect(getStageIndex).toHaveBeenCalledWith(
        stages,
        contactAssignment.pathway_stage_id,
      );
      expect(updatePersonAttributes).toHaveBeenCalledWith(person.id, {
        reverse_contact_assignments: [
          {
            ...reverseContactAssignment,
            pathway_stage_id: stage.id,
          },
        ],
      });
      expect(loadStepsAndJourney).toHaveBeenCalledWith(person, organization);
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
