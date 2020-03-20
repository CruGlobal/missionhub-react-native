import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { fireEvent } from 'react-native-testing-library';

import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import { UPDATE_PERSON } from '../../../containers/SetupScreen/queries';
import { RelationshipTypeEnum } from '../../../../__generated__/globalTypes';
import { renderWithContext } from '../../../../testUtils';

import PersonCategoryScreen from '..';

jest.mock('../../../utils/hooks/useAnalytics');

const person = {
  id: '1',
};
const orgId = {
  id: '2',
};
const nextResult = { type: 'testNext' };
const next = jest.fn().mockReturnValue(nextResult);

describe('Onboarding', () => {
  it('renders correctly', () => {
    renderWithContext(<PersonCategoryScreen next={next} />).snapshot();
    expect(useAnalytics).toHaveBeenCalledWith([
      'add person',
      'select category',
    ]);
  });

  it('fires onPress', async () => {
    const { recordSnapshot, diffSnapshot, getByTestId } = renderWithContext(
      <PersonCategoryScreen next={next} />,
    );
    recordSnapshot();
    await fireEvent.press(getByTestId('familyButton'));
    diffSnapshot();
    expect(next).toHaveBeenCalledWith({
      relationshipType: RelationshipTypeEnum.family,
    });
    expect(useAnalytics).toHaveBeenCalledWith([
      'add person',
      'select category',
    ]);
  });
});

describe('Edit Person', () => {
  it('renders correctly | no relationship_type', () => {
    renderWithContext(<PersonCategoryScreen next={next} />, {
      navParams: {
        person: person.id,
      },
    }).snapshot();
    expect(useAnalytics).toHaveBeenCalledWith([
      'add person',
      'select category',
    ]);
  });

  it('fires onPress and updates person | no relationship_type', async () => {
    const { recordSnapshot, diffSnapshot, getByTestId } = renderWithContext(
      <PersonCategoryScreen next={next} />,
      {
        navParams: {
          personId: person.id,
        },
      },
    );
    recordSnapshot();
    await fireEvent.press(getByTestId('familyButton'));
    diffSnapshot();
    expect(next).toHaveBeenCalledWith({
      personId: person.id,
    });
    expect(useMutation).toHaveBeenMutatedWith(UPDATE_PERSON, {
      variables: {
        input: {
          id: person.id,
          relationshipType: RelationshipTypeEnum.family,
        },
      },
    });
    expect(useAnalytics).toHaveBeenCalledWith([
      'add person',
      'select category',
    ]);
  });

  it('fires onPress and updates person with orgId | no relationship_type', async () => {
    const { recordSnapshot, diffSnapshot, getByTestId } = renderWithContext(
      <PersonCategoryScreen next={next} />,
      {
        navParams: {
          personId: person.id,
          orgId,
        },
      },
    );
    recordSnapshot();
    await fireEvent.press(getByTestId('familyButton'));
    diffSnapshot();
    expect(next).toHaveBeenCalledWith({
      personId: person.id,
      orgId,
    });
    expect(useMutation).toHaveBeenMutatedWith(UPDATE_PERSON, {
      variables: {
        input: {
          id: person.id,
          relationshipType: RelationshipTypeEnum.family,
        },
      },
    });
    expect(useAnalytics).toHaveBeenCalledWith([
      'add person',
      'select category',
    ]);
  });

  it('renders correctly | relationship_type', () => {
    renderWithContext(<PersonCategoryScreen next={next} />, {
      navParams: {
        personId: person.id,
        relationshipType: RelationshipTypeEnum.family,
      },
    }).snapshot();
    expect(useAnalytics).toHaveBeenCalledWith([
      'add person',
      'select category',
    ]);
  });

  it('fires onPress and updates person | relationship_type', async () => {
    const { recordSnapshot, diffSnapshot, getByTestId } = renderWithContext(
      <PersonCategoryScreen next={next} />,
      {
        navParams: {
          personId: person.id,
          relationshipType: RelationshipTypeEnum.family,
        },
      },
    );
    recordSnapshot();
    await fireEvent.press(getByTestId('friendButton'));
    diffSnapshot();
    expect(next).toHaveBeenCalledWith({
      personId: person.id,
    });
    expect(useMutation).toHaveBeenMutatedWith(UPDATE_PERSON, {
      variables: {
        input: {
          id: person.id,
          relationshipType: RelationshipTypeEnum.friend,
        },
      },
    });
    expect(useAnalytics).toHaveBeenCalledWith([
      'add person',
      'select category',
    ]);
  });

  it('fires onPress and updates person with orgId | relationship_type', async () => {
    const { recordSnapshot, diffSnapshot, getByTestId } = renderWithContext(
      <PersonCategoryScreen next={next} />,
      {
        navParams: {
          personId: person.id,
          relationshipType: RelationshipTypeEnum.family,
          orgId,
        },
      },
    );
    recordSnapshot();
    await fireEvent.press(getByTestId('friendButton'));
    diffSnapshot();
    expect(next).toHaveBeenCalledWith({
      personId: person.id,
      orgId,
    });
    expect(useMutation).toHaveBeenMutatedWith(UPDATE_PERSON, {
      variables: {
        input: {
          id: person.id,
          relationshipType: RelationshipTypeEnum.friend,
        },
      },
    });
    expect(useAnalytics).toHaveBeenCalledWith([
      'add person',
      'select category',
    ]);
  });
});
