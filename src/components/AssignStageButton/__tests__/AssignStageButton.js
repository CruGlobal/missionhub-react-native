import React from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

import { testSnapshotShallow, renderShallow } from '../../../../testUtils';
import { contactAssignmentSelector } from '../../../selectors/people';
import { navigateToStageScreen } from '../../../actions/misc';
import { getStageIndex } from '../../../utils/common';

import AssignStageButton from '..';

jest.mock('../../../selectors/people');
jest.mock('../../../actions/misc');
jest.mock('../../../utils/common');

const myId = '25';
const otherId = '52';
const stageId = '1';

const mockContactAssignment = {
  id: '123',
  pathway_stage_id: stageId,
};
const navigateToStageResult = { type: 'navigate to stage screen' };

const state = {
  auth: { person: { id: myId, user: { pathway_stage_id: stageId } } },
  people: {},
  stages: {
    stages: [
      {
        id: stageId,
        name: 'Stage Name',
      },
    ],
  },
};
let store;

const props = {
  person: { id: '1' },
  organization: { id: '11' },
};

beforeEach(() => {
  contactAssignmentSelector.mockReturnValue(mockContactAssignment);
  navigateToStageScreen.mockReturnValue(navigateToStageResult);
  getStageIndex.mockReturnValue(stageId);
  store = configureStore([thunk])(state);
});

it('renders correctly for me', () => {
  testSnapshotShallow(
    <AssignStageButton {...props} person={{ id: myId }} />,
    store,
  );
});

it('renders correctly for me without stage', () => {
  store = configureStore([thunk])({
    ...state,
    auth: {
      person: {
        id: myId,
        user: {},
      },
    },
  });

  testSnapshotShallow(
    <AssignStageButton {...props} person={{ id: myId }} />,
    store,
  );
});

it('renders correctly for other', () => {
  testSnapshotShallow(
    <AssignStageButton {...props} person={{ id: otherId }} />,
    store,
  );
});

it('renders correctly for other without stage', () => {
  contactAssignmentSelector.mockReturnValue({});
  testSnapshotShallow(
    <AssignStageButton {...props} person={{ id: otherId }} />,
    store,
  );
});

describe('assignStage', () => {
  describe('for me', () => {
    it('navigates to select my steps flow', () => {
      const person = { id: myId };
      const component = renderShallow(
        <AssignStageButton {...props} person={person} />,
        store,
      );

      component.props().onPress();

      expect(navigateToStageScreen).toHaveBeenCalledWith(
        true,
        person,
        null,
        props.organization,
        stageId,
      );
    });
  });

  describe('for other', () => {
    it('navigates to select person steps flow', () => {
      const person = { id: otherId };
      const component = renderShallow(
        <AssignStageButton {...props} person={person} />,
        store,
      );

      component.props().onPress();

      expect(navigateToStageScreen).toHaveBeenCalledWith(
        false,
        person,
        mockContactAssignment,
        props.organization,
        stageId,
      );
    });
  });
});
