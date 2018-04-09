import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import Enzyme, { shallow } from 'enzyme';
import { TouchableWithoutFeedback } from 'react-native';
import { Provider } from 'react-redux';
import { createMockStore } from '../../testUtils/index';
import LoginScreen from '../../src/containers/LoginScreen';
import { renderShallow } from '../../testUtils';
import * as analytics from '../../src/actions/analytics';
import renderer from 'react-test-renderer';
import Carousel from 'react-native-snap-carousel';
import Adapter from 'enzyme-adapter-react-16/build/index';

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
  Enzyme.configure({ adapter: new Adapter() });
  const page = shallow(carouselProps.renderItem({ item }));

  page.find(TouchableWithoutFeedback).simulate('press');
  screen.update();

  expect(carouselProps.autoplay).toEqual(false);
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