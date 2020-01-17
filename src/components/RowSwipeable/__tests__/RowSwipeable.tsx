import { Animated } from 'react-native';
import React from 'react';
import { View } from 'react-native';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { testSnapshot } from '../../../../testUtils';

import RowSwipeable from '..';

const mockStart = jest.fn();
beforeEach(() => {
  // @ts-ignore
  Animated.timing = jest.fn(() => ({ start: mockStart }));
  // @ts-ignore
  Animated.spring = jest.fn(() => ({ start: mockStart }));
});

it('renders correctly', () => {
  testSnapshot(
    <RowSwipeable>
      <View />
    </RowSwipeable>,
  );
});

it('renders remove/complete actions correctly', () => {
  testSnapshot(
    // @ts-ignore
    <RowSwipeable onComplete={jest.fn()} onDelete={jest.fn()}>
      <View />
    </RowSwipeable>,
  );
});

it('renders edit action correctly', () => {
  testSnapshot(
    // @ts-ignore
    <RowSwipeable onEdit={jest.fn()}>
      <View />
    </RowSwipeable>,
  );
});

it('renders edit bump correctly', () => {
  testSnapshot(
    // @ts-ignore
    <RowSwipeable bump={true} onBumpComplete={jest.fn()}>
      <View />
    </RowSwipeable>,
  );
});

describe('swipe gestures', () => {
  // @ts-ignore
  let swipeComponent;
  const pressProps = ['test'];
  const props = {
    onComplete: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    deletePressProps: pressProps,
    completePressProps: pressProps,
    editPressProps: pressProps,
  };
  beforeEach(() => {
    Enzyme.configure({ adapter: new Adapter() });
    const screen = shallow(
      <RowSwipeable {...props}>
        <View />
      </RowSwipeable>,
    );

    swipeComponent = screen.dive().instance();
  });

  it('opens swipe after gesture', () => {
    // @ts-ignore
    swipeComponent.snapBack(undefined, {
      dx: -300,
    });
    // @ts-ignore
    expect(swipeComponent.isOpen).toBe(true);
  });

  it('closes swipe after gesture', () => {
    // @ts-ignore
    swipeComponent.snapBack(undefined, {
      dx: 100,
    });
    // @ts-ignore
    expect(swipeComponent.isOpen).toBe(false);
  });

  it('opens swipe', () => {
    // @ts-ignore
    swipeComponent.open();
    // @ts-ignore
    expect(swipeComponent.isOpen).toBe(true);
  });

  it('closes swipe', () => {
    // @ts-ignore
    swipeComponent.close();
    // @ts-ignore
    expect(swipeComponent.isOpen).toBe(false);
  });

  it('calls move', () => {
    // @ts-ignore
    swipeComponent.move = jest.fn();
    // @ts-ignore
    swipeComponent.move(100);
    // @ts-ignore
    expect(swipeComponent.move).toHaveBeenCalledTimes(1);
  });

  it('checks should move', () => {
    // @ts-ignore
    swipeComponent.isOpen = false;
    // @ts-ignore
    const result = swipeComponent.checkShouldMove(undefined, { dx: -20 });
    expect(result).toBe(true);
  });

  it('checks should not move', () => {
    // @ts-ignore
    swipeComponent.isOpen = false;
    // @ts-ignore
    const result = swipeComponent.checkShouldMove(undefined, { dx: 20 });
    expect(result).toBe(false);
  });

  it('checks should move while open', () => {
    // @ts-ignore
    swipeComponent.isOpen = true;
    // @ts-ignore
    const result = swipeComponent.checkShouldMove(undefined, { dx: 20 });
    expect(result).toBe(true);
  });

  it('checks should not move while open', () => {
    // @ts-ignore
    swipeComponent.isOpen = true;
    // @ts-ignore
    const result = swipeComponent.checkShouldMove(undefined, { dx: 1 });
    expect(result).toBe(false);
  });

  it('handle select', () => {
    // @ts-ignore
    swipeComponent.isOpen = true;
    const cb = jest.fn();
    // @ts-ignore
    const result = swipeComponent.handleSelect(cb);
    result();
    expect(cb).toHaveBeenCalledTimes(1);
    // @ts-ignore
    expect(swipeComponent.isOpen).toBe(false);
  });

  it('handles delete', () => {
    // @ts-ignore
    swipeComponent.handleDelete();
    expect(props.onDelete).toHaveBeenCalledWith(pressProps[0]);
  });

  it('handles complete', () => {
    // @ts-ignore
    swipeComponent.handleComplete();
    expect(props.onComplete).toHaveBeenCalledWith(pressProps[0]);
  });

  it('handles edit', () => {
    // @ts-ignore
    swipeComponent.handleEdit();
    expect(props.onEdit).toHaveBeenCalledWith(pressProps[0]);
  });
});
