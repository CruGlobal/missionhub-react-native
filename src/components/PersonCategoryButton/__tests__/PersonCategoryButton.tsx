import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { RelationshipTypeEnum } from '../../../../__generated__/globalTypes';

import PersonCategoryButton from '..';

const onPress = jest.fn();
const props = {
  currentCategory: RelationshipTypeEnum.family,
  category: RelationshipTypeEnum.friend,
  onPress,
};

it('render correctly | non-active', () => {
  renderWithContext(<PersonCategoryButton {...props} />, {
    noWrappers: true,
  }).snapshot();
});

it('render correctly | active', () => {
  renderWithContext(
    <PersonCategoryButton {...props} category={RelationshipTypeEnum.family} />,
    {
      noWrappers: true,
    },
  ).snapshot();
});

describe('Different Categories', () => {
  it('renders correctly | family', () => {
    renderWithContext(
      <PersonCategoryButton
        {...props}
        category={RelationshipTypeEnum.family}
      />,
      {
        noWrappers: true,
      },
    ).snapshot();
  });
  it('renders correctly | friend', () => {
    renderWithContext(<PersonCategoryButton {...props} />, {
      noWrappers: true,
    }).snapshot();
  });
  it('renders correctly | neighbor', () => {
    renderWithContext(
      <PersonCategoryButton
        {...props}
        category={RelationshipTypeEnum.neighbor}
      />,
      {
        noWrappers: true,
      },
    ).snapshot();
  });
  it('renders correctly | coworker', () => {
    renderWithContext(
      <PersonCategoryButton
        {...props}
        category={RelationshipTypeEnum.coworker}
      />,
      {
        noWrappers: true,
      },
    ).snapshot();
  });
  it('renders correctly | other', () => {
    renderWithContext(
      <PersonCategoryButton {...props} category={RelationshipTypeEnum.other} />,
      {
        noWrappers: true,
      },
    ).snapshot();
  });
});

describe('onPress', () => {
  it('fires onPress when clicked', async () => {
    const { snapshot, getByTestId } = renderWithContext(
      <PersonCategoryButton {...props} />,
      {
        noWrappers: true,
      },
    );
    snapshot();
    await fireEvent.press(getByTestId('friendButton'));
    expect(onPress).toHaveBeenCalled();
  });
});
