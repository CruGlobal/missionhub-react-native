import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { testSnapshotShallow } from '../../../../testUtils';
import {
  personSelector,
  contactAssignmentSelector,
} from '../../../selectors/people';
import PathwayStageDisplay from '..';
import { getAuthPerson } from '../../../auth/authUtilities';

jest.mock('../../../selectors/people');
jest.mock('../../../auth/authUtilities');

const stages = {
  stages: [
    { id: '1', name: 'Uninterested' },
    { id: '2', name: 'Curios' },
    { id: '3', name: 'Forgiven' },
  ],
};
const people = {};

const mockStore = configureStore([thunk]);
const myId = '100';
const person = { id: '51423423' };

describe('for self', () => {
  afterEach(() => {
    expect(personSelector).not.toHaveBeenCalled();
    expect(contactAssignmentSelector).not.toHaveBeenCalled();
  });

  it('renders stage', () => {
    (getAuthPerson as jest.Mock).mockReturnValue({
      id: myId,
      stage: { id: '3' },
    });
    testSnapshotShallow(
      <PathwayStageDisplay person={{ id: myId }} />,
      mockStore({ stages }),
    );
  });

  it('renders null if stage is not found', () => {
    (getAuthPerson as jest.Mock).mockReturnValue({ id: myId, stage: null });
    testSnapshotShallow(
      <PathwayStageDisplay person={{ id: myId }} />,
      mockStore({
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
    expect(contactAssignmentSelector).toHaveBeenCalledWith({ person });
  });

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
        stages,
        people,
      }),
    );
  });
});
