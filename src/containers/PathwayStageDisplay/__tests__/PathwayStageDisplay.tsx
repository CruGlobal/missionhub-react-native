import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { testSnapshotShallow } from '../../../../testUtils';
import {
  personSelector,
  contactAssignmentSelector,
} from '../../../selectors/people';

import PathwayStageDisplay from '..';

jest.mock('../../../selectors/people');

const stages = {
  stages: [
    { id: '1', name: 'Uninterested' },
    { id: '2', name: 'Curios' },
    { id: '3', name: 'Forgiven' },
  ],
};
const people = {};

const mockStore = configureStore([thunk]);
const person = { id: '51423423' };

describe('for self', () => {
  afterEach(() => {
    expect(personSelector).not.toHaveBeenCalled();
    expect(contactAssignmentSelector).not.toHaveBeenCalled();
  });

  it('renders stage', () => {
    testSnapshotShallow(
      <PathwayStageDisplay person={person} />,
      mockStore({
        auth: {
          person: {
            id: person.id,
            user: {
              pathway_stage_id: stages.stages[2].id,
            },
          },
        },
        stages,
      }),
    );
  });

  it('renders null if stage is not found', () => {
    testSnapshotShallow(
      <PathwayStageDisplay person={person} />,
      mockStore({
        auth: {
          person: {
            id: person.id,
            user: {
              pathway_stage_id: null,
            },
          },
        },
        stages,
      }),
    );
  });
});

describe('for person', () => {
  afterEach(() => {
    expect(personSelector).toHaveBeenCalledWith(
      { people },
      { personId: person.id },
    );
    expect(contactAssignmentSelector).toHaveBeenCalledWith(
      { auth },
      { person },
    );
  });

  const auth = {
    person: {},
  };

  it('renders stage', () => {
    // @ts-ignore
    personSelector.mockReturnValue(person);
    // @ts-ignore
    contactAssignmentSelector.mockReturnValue({
      pathway_stage_id: stages.stages[1].id,
    });

    testSnapshotShallow(
      <PathwayStageDisplay person={person} />,
      mockStore({
        auth,
        stages,
        people,
      }),
    );
  });

  it('renders null if stage is not found', () => {
    // @ts-ignore
    personSelector.mockReturnValue(person);
    // @ts-ignore
    contactAssignmentSelector.mockReturnValue({
      pathway_stage_id: null,
    });

    testSnapshotShallow(
      <PathwayStageDisplay person={person} />,
      mockStore({
        auth,
        stages,
        people,
      }),
    );
  });

  it('renders null if contact assignment is not found', () => {
    // @ts-ignore
    personSelector.mockReturnValue(person);
    // @ts-ignore
    contactAssignmentSelector.mockReturnValue(null);

    testSnapshotShallow(
      <PathwayStageDisplay person={person} />,
      mockStore({
        auth,
        stages,
        people,
      }),
    );
  });
});
