/* eslint-disable max-lines */

import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import {
  navigateToStageScreen,
  navigateToAddStepFlow,
} from '../../../actions/misc';
import { navToPersonScreen } from '../../../actions/person';
import { hasOrgPermissions } from '../../../utils/common';
import { PersonFragment } from '../__generated__/PersonFragment';
import { PERSON_FRAGMENT } from '../queries';
import { PersonItem } from '..';
import { mockFragment } from '../../../../testUtils/apolloMockClient';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/misc');
jest.mock('../../../actions/person');
jest.mock('../../../utils/common');

const mePerson = mockFragment<PersonFragment>(PERSON_FRAGMENT, {
  mocks: { Stage: () => ({ position: 3 }) },
});
const person = mockFragment<PersonFragment>(PERSON_FRAGMENT, {
  mocks: { Stage: () => ({ position: 3 }) },
});

const initialState = {
  auth: {
    person: {
      id: mePerson.id,
    },
  },
};

const mePersonWithoutSteps: PersonFragment = {
  ...mePerson,
  steps: {
    __typename: 'StepConnection',
    pageInfo: { __typename: 'BasePageInfo', totalCount: 0 },
  },
};
const mePersonWithoutStage: PersonFragment = {
  ...mePerson,
  stage: null,
};
const personWithoutSteps: PersonFragment = {
  ...person,
  steps: {
    __typename: 'StepConnection',
    pageInfo: { __typename: 'BasePageInfo', totalCount: 0 },
  },
};
const personWithoutStage: PersonFragment = {
  ...person,
  stage: null,
};
const personWithoutStageOrSteps: PersonFragment = {
  ...person,
  stage: null,
  steps: {
    __typename: 'StepConnection',
    pageInfo: { __typename: 'BasePageInfo', totalCount: 0 },
  },
};

const navToPersonScreenResult = { type: 'nav to person screen' };
const navigateToStageScreenResult = { type: 'nav to stage screen' };
const navigateToAddStepFlowResult = { type: 'nav to add step flow' };

beforeEach(() => {
  (navToPersonScreen as jest.Mock).mockReturnValue(navToPersonScreenResult);
  (navigateToStageScreen as jest.Mock).mockReturnValue(
    navigateToStageScreenResult,
  );
  (navigateToAddStepFlow as jest.Mock).mockReturnValue(
    navigateToAddStepFlowResult,
  );
});

it('renders me correctly', () => {
  (hasOrgPermissions as jest.Mock).mockReturnValue(false);

  renderWithContext(<PersonItem person={mePerson} />, {
    initialState,
  }).snapshot();

  expect(hasOrgPermissions).not.toHaveBeenCalled();
});

it('renders person correctly', () => {
  (hasOrgPermissions as jest.Mock).mockReturnValue(false);

  renderWithContext(<PersonItem person={person} />, {
    initialState,
  }).snapshot();

  expect(hasOrgPermissions).not.toHaveBeenCalled();
});

it('renders personal ministry with no steps correctly', () => {
  (hasOrgPermissions as jest.Mock).mockReturnValue(false);

  const { getByTestId, snapshot } = renderWithContext(
    <PersonItem person={personWithoutSteps} />,
    {
      initialState,
    },
  );
  snapshot();
  expect(getByTestId('stepIcon')).toBeTruthy();
  expect(hasOrgPermissions).not.toHaveBeenCalled();
});

it('renders person with no stage correctly', () => {
  const { snapshot } = renderWithContext(
    <PersonItem person={personWithoutStage} />,
    {
      initialState,
    },
  );
  snapshot();
});

describe('handleChangeStage', () => {
  describe('isMe', () => {
    it('navigates to my stage screen without stage', () => {
      const { getByTestId, store } = renderWithContext(
        <PersonItem person={mePersonWithoutStage} />,
        {
          initialState,
        },
      );

      fireEvent.press(getByTestId('stageText'));

      expect(navigateToStageScreen).toHaveBeenCalledWith(
        mePerson.id,
        undefined,
        true,
      );
      expect(store.getActions()).toEqual([navigateToStageScreenResult]);
    });
  });

  describe('not isMe', () => {
    it('navigates to person stage screen without stage', () => {
      const { getByTestId, store } = renderWithContext(
        <PersonItem person={personWithoutStage} />,
        { initialState },
      );

      fireEvent.press(getByTestId('stageText'));

      expect(navigateToStageScreen).toHaveBeenCalledWith(
        personWithoutStage.id,
        undefined,
        true,
      );
      expect(store.getActions()).toEqual([navigateToStageScreenResult]);
    });
  });
});

describe('handleSelect', () => {
  it('navigate to person view for me', () => {
    const { getByTestId, store } = renderWithContext(
      <PersonItem person={mePerson} />,
      { initialState },
    );

    fireEvent.press(getByTestId('personCard'));

    expect(navToPersonScreen).toHaveBeenCalledWith(mePerson.id);
    expect(store.getActions()).toEqual([navToPersonScreenResult]);
  });

  it('navigate to person view for other', () => {
    const { getByTestId, store } = renderWithContext(
      <PersonItem person={person} />,
      { initialState },
    );

    fireEvent.press(getByTestId('personCard'));

    expect(navToPersonScreen).toHaveBeenCalledWith(person.id);
    expect(store.getActions()).toEqual([navToPersonScreenResult]);
  });

  it('navigate to person view with no org if orgId === "personal"', () => {
    const { getByTestId, store } = renderWithContext(
      <PersonItem person={person} />,
      { initialState },
    );

    fireEvent.press(getByTestId('personCard'));

    expect(navToPersonScreen).toHaveBeenCalledWith(person.id);
    expect(store.getActions()).toEqual([navToPersonScreenResult]);
  });
});

describe('handleAddStep', () => {
  it('navigate to select step for me', () => {
    const { getByTestId, store } = renderWithContext(
      <PersonItem person={mePersonWithoutSteps} />,
      { initialState },
    );

    fireEvent.press(getByTestId('stepIcon'));

    expect(navigateToAddStepFlow).toHaveBeenCalledWith(mePerson.id);
    expect(store.getActions()).toEqual([navigateToAddStepFlowResult]);
  });

  it('navigate to select step for other', () => {
    const { getByTestId, store } = renderWithContext(
      <PersonItem person={personWithoutSteps} />,
      { initialState },
    );

    fireEvent.press(getByTestId('stepIcon'));

    expect(navigateToAddStepFlow).toHaveBeenCalledWith(person.id);
    expect(store.getActions()).toEqual([navigateToAddStepFlowResult]);
  });

  it('navigate to select stage for other person without stage', () => {
    const { getByTestId, store } = renderWithContext(
      <PersonItem person={personWithoutStageOrSteps} />,
      { initialState },
    );

    fireEvent.press(getByTestId('stepIcon'));

    expect(navigateToStageScreen).toHaveBeenCalledWith(
      personWithoutStageOrSteps.id,
      undefined,
      true,
    );
    expect(store.getActions()).toEqual([navigateToStageScreenResult]);
  });
});
