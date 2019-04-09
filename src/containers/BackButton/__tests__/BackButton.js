import React from 'react';

import { BackButton } from '..';

import { renderShallow } from '../../../../testUtils';
import * as navigation from '../../../actions/navigation';
import IconButton from '../../../components/IconButton';

let shallowScreen;

jest.mock('react-native-device-info');

describe('back button', () => {
  beforeEach(() => {
    shallowScreen = renderShallow(<BackButton dispatch={jest.fn()} />);
  });

  it('renders normally', () => {
    expect(shallowScreen).toMatchSnapshot();
  });

  it('calls navigate back once', () => {
    navigation.navigateBack = jest.fn();
    shallowScreen
      .dive()
      .find(IconButton)
      .props()
      .onPress();

    expect(navigation.navigateBack).toHaveBeenCalledTimes(1);
  });
});

describe('back button absolute', () => {
  beforeEach(() => {
    shallowScreen = renderShallow(
      <BackButton absolute={true} dispatch={jest.fn()} />,
    );
  });

  it('renders with absolute', () => {
    expect(shallowScreen.dive()).toMatchSnapshot();
  });
});

describe('back button customNavigate', () => {
  const mockCustomNav = jest.fn();

  beforeEach(() => {
    shallowScreen = renderShallow(
      <BackButton customNavigate={mockCustomNav} dispatch={jest.fn()} />,
    );
  });

  it('custom navigation function is called', () => {
    navigation.navigateBack = jest.fn();
    shallowScreen
      .dive()
      .find(IconButton)
      .props()
      .onPress();

    expect(mockCustomNav).toHaveBeenCalledTimes(1);
  });
});
