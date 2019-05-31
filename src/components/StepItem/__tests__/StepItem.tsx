import React from 'react';
import { fireEvent, GetByAPI } from 'react-native-testing-library';
import { ReactTestInstance } from 'react-test-renderer';

import { renderWithContext } from '../../../../testUtils';

import StepItem, { STEP_ITEM_QUERY } from '..';

import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { StepItem as StepItemQueryResponse } from '../__generated__/StepItem';

jest.mock('../../../components/common', () => ({
  Flex: 'Flex',
  Text: 'Text',
  Touchable: 'Touchable',
  Icon: 'Icon',
}));
jest.mock('../../ItemHeaderText', () => 'ItemHeaderText');

const mockStep = mockFragment<StepItemQueryResponse>(STEP_ITEM_QUERY);

const initialState = {
  auth: {
    person: {
      id: '10',
    },
  },
};

it('renders me correctly', () => {
  renderWithContext(
    <StepItem
      step={mockFragment<StepItemQueryResponse>(STEP_ITEM_QUERY, {
        mocks: {
          AcceptedChallenge: () => ({
            receiver: () => ({
              id: '10',
            }),
          }),
        },
      })}
      type="swipeable"
    />,
    {
      initialState,
    },
  ).snapshot();
});

it('renders not me correctly', () => {
  renderWithContext(<StepItem step={mockStep} type="swipeable" />, {
    initialState,
  }).snapshot();
});

it('renders type swipeable correctly', () => {
  renderWithContext(<StepItem step={mockStep} type="swipeable" />, {
    initialState,
  }).snapshot();
});

it('renders type contact correctly', () => {
  renderWithContext(<StepItem step={mockStep} type="contact" />, {
    initialState,
  }).snapshot();
});

it('renders type reminder correctly', () => {
  renderWithContext(<StepItem step={mockStep} type="reminder" />, {
    initialState,
  }).snapshot();
});

it('renders type action correctly', () => {
  renderWithContext(
    <StepItem step={mockStep} type="swipeable" onAction={jest.fn()} />,
    {
      initialState,
    },
  ).snapshot();
});

it('renders hover for step', () => {
  const { getByTestId, snapshot } = renderWithContext(
    <StepItem step={mockStep} type="swipeable" onAction={jest.fn()} />,
    {
      initialState,
    },
  );
  fireEvent(getByTestId('star-icon-button'), 'onPressIn');
  snapshot();
});

describe('step item animations', () => {
  const getAnimation = (getByTestId: GetByAPI['getByTestId']) =>
    (getByTestId('star-icon-button').children[0] as ReactTestInstance).props
      .animation;

  it('renders animation fade in on mount', () => {
    const { snapshot, getByTestId } = renderWithContext(
      <StepItem step={mockStep} type="swipeable" onAction={jest.fn()} />,
      {
        initialState,
      },
    );
    expect(getAnimation(getByTestId)).toEqual('fadeInRight');
    snapshot();
  });
  it('renders no initial animation on mount', () => {
    renderWithContext(
      <StepItem
        step={mockStep}
        type="swipeable"
        hideAction={true}
        onAction={jest.fn()}
      />,
      {
        initialState,
      },
    ).snapshot();
  });
  it('changes animation from fade in to fade out', () => {
    const { rerender, snapshot, getByTestId } = renderWithContext(
      <StepItem
        step={mockStep}
        type="swipeable"
        onAction={jest.fn()}
        hideAction={false}
      />,
      {
        initialState,
      },
    );
    expect(getAnimation(getByTestId)).toEqual('fadeInRight');
    rerender(
      <StepItem
        step={mockStep}
        type="swipeable"
        onAction={jest.fn()}
        hideAction={true}
      />,
    );
    expect(getAnimation(getByTestId)).toEqual('fadeOutRight');
    snapshot();
  });
  it('changes animation from fade out to fade in', () => {
    const { rerender, snapshot, getByTestId } = renderWithContext(
      <StepItem
        step={mockStep}
        type="swipeable"
        onAction={jest.fn()}
        hideAction={true}
      />,
      {
        initialState,
      },
    );
    expect(() => getAnimation(getByTestId)).toThrow();
    rerender(
      <StepItem
        step={mockStep}
        type="swipeable"
        onAction={jest.fn()}
        hideAction={false}
      />,
    );
    expect(getAnimation(getByTestId)).toEqual('fadeInRight');
    snapshot();
  });
});

describe('step item methods', () => {
  const mockSelect = jest.fn();
  const mockAction = jest.fn();

  it('handles select', () => {
    const { getByTestId } = renderWithContext(
      <StepItem
        step={mockStep}
        onSelect={mockSelect}
        type="swipeable"
        onAction={mockAction}
      />,
      {
        initialState,
      },
    );

    fireEvent.press(getByTestId('step-item-row'));
    expect(mockSelect).toHaveBeenCalled();
  });

  it('handles action press', () => {
    const { getByTestId } = renderWithContext(
      <StepItem
        step={mockStep}
        onSelect={mockSelect}
        type="swipeable"
        onAction={mockAction}
      />,
      {
        initialState,
      },
    );

    fireEvent.press(getByTestId('star-icon-button'));
    expect(mockAction).toHaveBeenCalled();
  });
});
