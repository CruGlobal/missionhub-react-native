import React from 'react';
import { Provider } from 'react-redux';
import MockDate from 'mockdate';
import moment from 'moment';

import AddChallengeScreen from '..';

import {
  createMockNavState,
  testSnapshotShallow,
  createThunkStore,
  renderShallow,
} from '../../../../testUtils';

const mockDate = '2018-09-01';
MockDate.set(mockDate);

const store = createThunkStore();

const editChallenge = {
  id: '1',
  title: 'Test Title',
  end_date: '2018-09-30',
};

it('renders correctly', () => {
  testSnapshotShallow(
    <AddChallengeScreen
      navigation={createMockNavState({
        onComplete: jest.fn(),
      })}
    />,
    store,
  );
});

it('renders edit challenge correctly', () => {
  const component = renderShallow(
    <AddChallengeScreen
      navigation={createMockNavState({
        onComplete: jest.fn(),
        challenge: editChallenge,
        isEdit: true,
      })}
    />,
    store,
  );
  component.setState({ date: '2018-09-30 23:59:59' });
  component.update();

  expect(component).toMatchSnapshot();
});

describe('create methods', () => {
  let component;
  let instance;
  const mockComplete = jest.fn();
  beforeEach(() => {
    component = renderShallow(
      <AddChallengeScreen
        navigation={createMockNavState({
          onComplete: mockComplete,
        })}
      />,
      store,
    );
    instance = component.instance();
  });

  it('changes title', () => {
    const title = 'New Title';
    instance.onChangeTitle(title);
    expect(instance.state.title).toEqual(title);
  });

  it('changes date', () => {
    const date = new Date();
    instance.onChangeDate(date);
    expect(instance.state.date).toEqual(date);
  });

  it('clears date', () => {
    instance.onChangeDate();
    expect(instance.state.date).toEqual('');
  });

  it('sets disable false', () => {
    const title = 'New Title';
    const date = new Date();
    instance.onChangeTitle(title);
    instance.onChangeDate(date);
    expect(instance.state.disableBtn).toEqual(false);
  });

  it('calls onComplete', () => {
    const challenge = {
      title: 'New Title',
      date: moment()
        .endOf('day')
        .format(),
    };
    instance.setState({ title: challenge.title, date: challenge.date });
    component
      .childAt(2)
      .props()
      .onPress();
    expect(mockComplete).toHaveBeenCalledWith(challenge);
  });

  it('calls onChangeTitle from input', () => {
    const title = 'New Title';
    component
      .childAt(1)
      .childAt(0)
      .props()
      .onChangeText(title);
    expect(instance.state.title).toEqual(title);
  });

  it('calls onChangeDate from input', () => {
    const date = new Date();
    component
      .childAt(1)
      .childAt(1)
      .props()
      .onDateChange(date);
    expect(instance.state.date).toEqual(date);
  });
});

describe('edit methods', () => {
  let component;
  let instance;
  const mockComplete = jest.fn();
  beforeEach(() => {
    component = renderShallow(
      <AddChallengeScreen
        navigation={createMockNavState({
          onComplete: mockComplete,
          challenge: editChallenge,
          isEdit: true,
        })}
      />,
      store,
    );
    instance = component.instance();
  });

  it('calls onComplete', () => {
    const challenge = {
      title: editChallenge.title,
      date: moment(editChallenge.end_date)
        .endOf('day')
        .format(),
      id: editChallenge.id,
    };
    instance.setState({
      title: challenge.title,
      date: challenge.date,
      disableBtn: false,
    });
    component
      .childAt(2)
      .props()
      .onPress();
    expect(mockComplete).toHaveBeenCalledWith(challenge);
  });
});
