import { Animated } from 'react-native';
import React from 'react';
import { View } from 'react-native';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Note: test renderer must be required after react-native.
import RowSwipeable from '../src/components/RowSwipeable';
import { testSnapshot } from '../testUtils';

const mockStart = jest.fn();
beforeEach(() => {
  Animated.timing = jest.fn(() => ({ start: mockStart }));
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
    <RowSwipeable onComplete={() => {}} onDelete={() => {}}>
      <View />
    </RowSwipeable>,
  );
});

it('renders edit action correctly', () => {
  testSnapshot(
    <RowSwipeable onEdit={() => {}}>
      <View />
    </RowSwipeable>,
  );
});

it('renders edit bump correctly', () => {
  testSnapshot(
    <RowSwipeable bump={true} onBumpComplete={() => {}}>
      <View />
    </RowSwipeable>,
  );
});

describe('swipe gestures', () => {
  let swipeComponent;
  beforeEach(() => {
    Enzyme.configure({ adapter: new Adapter() });
    const screen = shallow(
      <RowSwipeable onEdit={() => {}}>
        <View />
      </RowSwipeable>,
    );

    swipeComponent = screen
      .dive()
      .dive()
      .instance();
  });

  it('opens swipe after gesture', () => {
    swipeComponent.snapBack(undefined, {
      dx: -100,
    });
    expect(swipeComponent.isOpen).toBe(true);
  });

  it('closes swipe after gesture', () => {
    swipeComponent.snapBack(undefined, {
      dx: 100,
    });
    expect(swipeComponent.isOpen).toBe(false);
  });

  it('opens swipe', () => {
    swipeComponent.open();
    expect(swipeComponent.isOpen).toBe(true);
  });

  it('closes swipe', () => {
    swipeComponent.close();
    expect(swipeComponent.isOpen).toBe(false);
  });

  it('calls move', () => {
    swipeComponent.move = jest.fn();
    swipeComponent.move(100);
    expect(swipeComponent.move).toHaveBeenCalledTimes(1);
  });

  it('checks should move', () => {
    swipeComponent.isOpen = false;
    const result = swipeComponent.checkShouldMove(undefined, { dx: -20 });
    expect(result).toBe(true);
  });

  it('checks should not move', () => {
    swipeComponent.isOpen = false;
    const result = swipeComponent.checkShouldMove(undefined, { dx: 20 });
    expect(result).toBe(false);
  });

  it('checks should move while open', () => {
    swipeComponent.isOpen = true;
    const result = swipeComponent.checkShouldMove(undefined, { dx: 20 });
    expect(result).toBe(true);
  });

  it('checks should not move while open', () => {
    swipeComponent.isOpen = true;
    const result = swipeComponent.checkShouldMove(undefined, { dx: 1 });
    expect(result).toBe(false);
  });

  it('handle select', () => {
    swipeComponent.isOpen = true;
    const cb = jest.fn();
    const result = swipeComponent.handleSelect(cb);
    result();
    expect(cb).toHaveBeenCalledTimes(1);
    expect(swipeComponent.isOpen).toBe(false);
  });
});
