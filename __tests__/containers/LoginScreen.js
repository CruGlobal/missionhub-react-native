import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';
import { TouchableWithoutFeedback } from 'react-native';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import Carousel from 'react-native-snap-carousel';

import { createMockStore } from '../../testUtils/index';
import LoginScreen from '../../src/containers/LoginScreen';
import { renderShallow } from '../../testUtils';
import * as analytics from '../../src/actions/analytics';

const store = createMockStore({});
let screen;
let carouselProps;
let item;

jest.mock('react-native-device-info');
jest.mock('react-native-snap-carousel');

beforeEach(() => {
  screen = renderShallow(<LoginScreen />, store);
  carouselProps = screen.find(Carousel).props();
  item = carouselProps.data[2];
});

it('renders', () => {
  expect(screen).toMatchSnapshot();
});

it('renders onboarding', () => {
  expect(carouselProps.renderItem({ item })).toMatchSnapshot();
});

it('disables autoplay when reaches last page', () => {
  screen.instance().handleSnapToItem(2);
  screen.update();

  const carouselProps = screen.find(Carousel).props();

  expect(carouselProps.autoplay).toEqual(false);
});

it('disables autoplay when user touches onboarding page', () => {
  const page = shallow(carouselProps.renderItem({ item }));

  page.find(TouchableWithoutFeedback).props().onPressIn();
  screen.update();

  expect(screen.find(Carousel).props().autoplay).toEqual(false);
});

it('tracks state on launch', () => {
  analytics.trackState = jest.fn();

  renderer.create(
    <Provider store={store}>
      <LoginScreen />
    </Provider>,
  );

  expect(analytics.trackState).toHaveBeenCalled();
});
