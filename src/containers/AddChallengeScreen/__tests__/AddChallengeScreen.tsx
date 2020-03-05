import React from 'react';
import MockDate from 'mockdate';
import moment from 'moment';

import {
  createMockNavState,
  testSnapshotShallow,
  createThunkStore,
  renderShallow,
} from '../../../../testUtils';
import { ORG_PERMISSIONS } from '../../../constants';

import AddChallengeScreen from '..';

const mockDate = '2018-09-01';
MockDate.set(mockDate);

const myId = '5';
const orgId = '7';
const person = {
  id: myId,
  organizational_permissions: [
    { organization_id: orgId, permission_id: ORG_PERMISSIONS.OWNER },
  ],
};
const organization = { id: orgId };

const store = createThunkStore({
  auth: { person },
});

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
        organization,
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
        organization,
      })}
    />,
    store,
  );
  component.setState({ date: '2018-09-30 23:59:59' });
  component.update();

  expect(component).toMatchSnapshot();
});

describe('create methods', () => {
  // @ts-ignore
  let component;
  // @ts-ignore
  let instance;
  const mockComplete = jest.fn();
  beforeEach(() => {
    component = renderShallow(
      <AddChallengeScreen
        navigation={createMockNavState({
          onComplete: mockComplete,
          organization,
        })}
      />,
      store,
    );
    instance = component.instance();
  });

  it('changes title', () => {
    const title = 'New Title';
    // @ts-ignore
    instance.onChangeTitle(title);
    // @ts-ignore
    expect(instance.state.title).toEqual(title);
  });

  it('changes date', () => {
    const date = new Date();
    // @ts-ignore
    instance.onChangeDate(date);
    // @ts-ignore
    expect(instance.state.date).toEqual(date);
  });

  it('clears date', () => {
    // @ts-ignore
    instance.onChangeDate();
    // @ts-ignore
    expect(instance.state.date).toEqual('');
  });

  it('sets disable false', () => {
    const title = 'New Title';
    const date = new Date();
    // @ts-ignore
    instance.onChangeTitle(title);
    // @ts-ignore
    instance.onChangeDate(date);
    // @ts-ignore
    expect(instance.state.disableBtn).toEqual(false);
  });

  it('calls onComplete', () => {
    const challenge = {
      title: 'New Title',
      date: moment()
        .endOf('day')
        .format(),
    };
    // @ts-ignore
    instance.setState({ title: challenge.title, date: challenge.date });
    // @ts-ignore
    component
      .childAt(4)
      .props()
      .onPress();
    expect(mockComplete).toHaveBeenCalledWith(challenge);
  });

  it('calls onChangeTitle from input', () => {
    const title = 'New Title';
    // @ts-ignore
    component
      .childAt(3)
      .childAt(0)
      .props()
      .onChangeText(title);
    // @ts-ignore
    expect(instance.state.title).toEqual(title);
  });

  it('calls onChangeDate from input', () => {
    const date = new Date();
    // @ts-ignore
    component
      .childAt(3)
      .childAt(1)
      .props()
      .onDateChange(date);
    // @ts-ignore
    expect(instance.state.date).toEqual(date);
  });
});

describe('edit methods', () => {
  // @ts-ignore
  let component;
  // @ts-ignore
  let instance;
  const mockComplete = jest.fn();
  beforeEach(() => {
    component = renderShallow(
      <AddChallengeScreen
        navigation={createMockNavState({
          onComplete: mockComplete,
          challenge: editChallenge,
          isEdit: true,
          organization,
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
    // @ts-ignore
    instance.setState({
      title: challenge.title,
      date: challenge.date,
      disableBtn: false,
    });

    // @ts-ignore
    component
      .childAt(4)
      .props()
      .onPress();
    expect(mockComplete).toHaveBeenCalledWith(challenge);
  });
});
