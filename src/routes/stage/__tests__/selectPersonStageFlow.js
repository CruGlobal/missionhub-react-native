/* eslint max-lines: 0 */
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { renderShallow } from '../../../../testUtils/index';
import { personSelector } from '../../../selectors/people';
import { SelectPersonStageFlowScreens } from '../selectPersonStageFlow';
import {
  updatePersonAttributes,
  getPersonDetails,
} from '../../../actions/person';
import { loadStepsAndJourney } from '../../../actions/misc';
import { navigatePush } from '../../../actions/navigation';
import { PERSON_STAGE_SCREEN } from '../../../containers/PersonStageScreen';
import { PERSON_SELECT_STEP_SCREEN } from '../../../containers/PersonSelectStepScreen';
import { CELEBRATION_SCREEN } from '../../../containers/CelebrationScreen/index';

jest.mock('../../../selectors/people');
jest.mock('../../../actions/person');
jest.mock('../../../actions/misc');
jest.mock('../../../actions/navigation');

const myId = '111';
const otherId = '222';
const otherName = 'Other';
const orgId = '123';
const contactAssignmentId = '22';
const questionText = 'Text';

const stage = { id: '1' };
const person = {
  id: otherId,
  reverse_contact_assignments: [{ id: contactAssignmentId }],
};
const people = { allByOrg: {} };

const store = configureStore([thunk])({
  auth: { person: { id: myId, user: { pathway_stage_id: '0' } } },
  personProfile: { id: '1', personFirstName: otherName },
  people,
});

const buildAndCallNext = async (screen, navParams, nextProps) => {
  const Component = SelectPersonStageFlowScreens[screen];

  await store.dispatch(
    renderShallow(
      <Component
        navigation={{
          state: {
            params: navParams,
          },
        }}
      />,
      store,
    )
      .instance()
      .props.next(nextProps),
  );
};

const updatePersonResponse = { type: 'update person attributes' };
const getPersonDetailsResponse = { type: 'get person details' };
const loadStepsJourneyResponse = { type: 'load steps and journey' };
const navigatePushResponse = { type: 'navigate push' };

beforeEach(() => {
  store.clearActions();
  personSelector.mockReturnValue(person);
  updatePersonAttributes.mockReturnValue(updatePersonResponse);
  getPersonDetails.mockReturnValue(getPersonDetailsResponse);
  loadStepsAndJourney.mockReturnValue(loadStepsJourneyResponse);
  navigatePush.mockReturnValue(navigatePushResponse);
});

describe('PersonStageScreen next', () => {
  describe('isAlreadySelected', () => {
    describe('with contactAssignmentId', () => {
      beforeEach(async () => {
        await buildAndCallNext(
          PERSON_STAGE_SCREEN,
          {
            section: 'people',
            subsection: 'person',
            firstItem: 0,
            enableBackButton: false,
            noNav: true,
            questionText,
            orgId,
            contactId: otherId,
            contactAssignmentId,
            name: otherName,
          },
          {
            stage,
            contactId: otherId,
            name: otherName,
            orgId,
            isAlreadySelected: true,
            contactAssignmentId,
          },
        );
      });

      it('should select person', () => {
        expect(personSelector).toHaveBeenCalledWith(
          { people },
          { personId: otherId, orgId },
        );
      });

      it('should update person', () => {
        expect(updatePersonAttributes).toHaveBeenCalledWith(otherId, {
          reverse_contact_assignments: [
            { id: contactAssignmentId, pathway_stage_id: stage.id },
          ],
        });
      });

      it('should load steps and journey', () => {
        expect(loadStepsAndJourney).toHaveBeenCalledWith(otherId, orgId);
      });

      it('should navigate to CelebrationScreen', () => {
        expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN, {
          contactId: otherId,
          orgId,
        });
      });

      it('fires correct actions', () => {
        expect(store.getActions()).toEqual([
          updatePersonResponse,
          loadStepsJourneyResponse,
          navigatePushResponse,
        ]);
      });
    });

    describe('without contactAssignmentId', () => {
      beforeEach(async () => {
        await buildAndCallNext(
          PERSON_STAGE_SCREEN,
          {
            section: 'people',
            subsection: 'person',
            firstItem: 0,
            enableBackButton: false,
            noNav: true,
            questionText,
            orgId,
            contactId: otherId,
            name: otherName,
          },
          {
            stage,
            contactId: otherId,
            name: otherName,
            orgId,
            isAlreadySelected: true,
          },
        );
      });

      it('should select person', () => {
        expect(personSelector).toHaveBeenCalledWith(
          { people },
          { personId: otherId, orgId },
        );
      });

      it('should get person details', () => {
        expect(getPersonDetails).toHaveBeenCalledWith(otherId, orgId);
      });

      it('should load steps and journey', () => {
        expect(loadStepsAndJourney).toHaveBeenCalledWith(otherId, orgId);
      });

      it('should navigate to CelebrationScreen', () => {
        expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN, {
          contactId: otherId,
          orgId,
        });
      });

      it('fires correct actions', () => {
        expect(store.getActions()).toEqual([
          getPersonDetailsResponse,
          loadStepsJourneyResponse,
          navigatePushResponse,
        ]);
      });
    });
  });

  describe('not isAlreadySelected', () => {
    describe('with contactAssignmentId', () => {
      beforeEach(async () => {
        await buildAndCallNext(
          PERSON_STAGE_SCREEN,
          {
            section: 'people',
            subsection: 'person',
            firstItem: 0,
            enableBackButton: false,
            noNav: true,
            questionText,
            orgId,
            contactId: otherId,
            contactAssignmentId,
            name: otherName,
          },
          {
            stage,
            contactId: otherId,
            name: otherName,
            orgId,
            isAlreadySelected: false,
            contactAssignmentId,
          },
        );
      });

      it('should select person', () => {
        expect(personSelector).toHaveBeenCalledWith(
          { people },
          { personId: otherId, orgId },
        );
      });

      it('should update person', () => {
        expect(updatePersonAttributes).toHaveBeenCalledWith(otherId, {
          reverse_contact_assignments: [
            { id: contactAssignmentId, pathway_stage_id: stage.id },
          ],
        });
      });

      it('should load steps and journey', () => {
        expect(loadStepsAndJourney).toHaveBeenCalledWith(otherId, orgId);
      });

      it('should navigate to PersonSelectStepScreen', () => {
        expect(navigatePush).toHaveBeenCalledWith(PERSON_SELECT_STEP_SCREEN, {
          contactStage: stage,
          contactId: otherId,
          organization: { id: orgId },
          contactName: otherName,
        });
      });

      it('fires correct actions', () => {
        expect(store.getActions()).toEqual([
          updatePersonResponse,
          loadStepsJourneyResponse,
          navigatePushResponse,
        ]);
      });
    });

    describe('without contactAssignmentId', () => {
      beforeEach(async () => {
        await buildAndCallNext(
          PERSON_STAGE_SCREEN,
          {
            section: 'people',
            subsection: 'person',
            firstItem: 0,
            enableBackButton: false,
            noNav: true,
            questionText,
            orgId,
            contactId: otherId,
            name: otherName,
          },
          {
            stage,
            contactId: otherId,
            name: otherName,
            orgId,
            isAlreadySelected: false,
          },
        );
      });

      it('should select person', () => {
        expect(personSelector).toHaveBeenCalledWith(
          { people },
          { personId: otherId, orgId },
        );
      });

      it('should get person details', () => {
        expect(getPersonDetails).toHaveBeenCalledWith(otherId, orgId);
      });

      it('should load steps and journey', () => {
        expect(loadStepsAndJourney).toHaveBeenCalledWith(otherId, orgId);
      });

      it('should navigate to PersonSelectStepScreen', () => {
        expect(navigatePush).toHaveBeenCalledWith(PERSON_SELECT_STEP_SCREEN, {
          contactStage: stage,
          contactId: otherId,
          organization: { id: orgId },
          contactName: otherName,
        });
      });

      it('fires correct actions', () => {
        expect(store.getActions()).toEqual([
          getPersonDetailsResponse,
          loadStepsJourneyResponse,
          navigatePushResponse,
        ]);
      });
    });
  });
});
