import React from 'react';
import MockDate from 'mockdate';
import moment from 'moment';
import { fireEvent } from 'react-native-testing-library';

import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import { renderWithContext } from '../../../../testUtils';

import AddChallengeScreen from '..';

const mockDate = '2020-02-13';
MockDate.set(mockDate);

jest.mock('../../../utils/hooks/useAnalytics');
jest.mock('../../../components/DatePicker', () => 'DatePicker');

const editChallenge = {
  id: '1',
  title: 'Test Title',
  end_date: '2020-02-29',
};
const onComplete = jest.fn();

it('renders correctly', () => {
  renderWithContext(<AddChallengeScreen />, {
    initialState: {},
    navParams: {
      onComplete,
      isEdit: false,
    },
  }).snapshot();
  expect(useAnalytics).toHaveBeenCalledWith(['challenge', 'create']);
});

it('renders edit challenge correctly', () => {
  renderWithContext(<AddChallengeScreen />, {
    initialState: {},
    navParams: {
      onComplete,
      challenge: editChallenge,
      isEdit: true,
    },
  }).snapshot();
  expect(useAnalytics).toHaveBeenCalledWith(['challenge', 'edit']);
});

describe('create methods', () => {
  it('focuses on press | titleInput', async () => {
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <AddChallengeScreen />,
      {
        initialState: {},
        navParams: {
          onComplete,
          isEdit: false,
        },
      },
    );
    recordSnapshot();
    await fireEvent(getByTestId('titleInput'), 'onFocus');
    diffSnapshot();
  });
  it('focuses on press | detailInput', async () => {
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <AddChallengeScreen />,
      {
        initialState: {},
        navParams: {
          onComplete,
          isEdit: false,
        },
      },
    );
    recordSnapshot();
    await fireEvent(getByTestId('detailInput'), 'onFocus');
    diffSnapshot();
  });

  it('fires onBlur | titleInput', async () => {
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <AddChallengeScreen />,
      {
        initialState: {},
        navParams: {
          onComplete,
          isEdit: false,
        },
      },
    );
    await fireEvent(getByTestId('titleInput'), 'onFocus');
    recordSnapshot();
    await fireEvent(getByTestId('detailInput'), 'onFocus');
    diffSnapshot();
  });

  it('fires onBlur | detailInput', async () => {
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <AddChallengeScreen />,
      {
        initialState: {},
        navParams: {
          onComplete,
          isEdit: false,
        },
      },
    );
    await fireEvent(getByTestId('detailInput'), 'onFocus');
    recordSnapshot();
    await fireEvent(getByTestId('titleInput'), 'onFocus');
    diffSnapshot();
  });

  it('changes title', async () => {
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <AddChallengeScreen />,
      {
        initialState: {},
        navParams: {
          onComplete,
          isEdit: false,
        },
      },
    );
    recordSnapshot();
    await fireEvent.changeText(
      getByTestId('titleInput'),
      'New Title For My Challenge',
    );
    diffSnapshot();
  });

  it('changes detail', async () => {
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <AddChallengeScreen />,
      {
        initialState: {},
        navParams: {
          onComplete,
          isEdit: false,
        },
      },
    );
    recordSnapshot();
    await fireEvent.changeText(
      getByTestId('detailInput'),
      'New details for my challenge',
    );
    diffSnapshot();
  });

  it('changes date', async () => {
    const date = new Date();
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <AddChallengeScreen />,
      {
        initialState: {},
        navParams: {
          onComplete,
          isEdit: false,
        },
      },
    );
    recordSnapshot();
    await fireEvent(getByTestId('datePicker'), 'onDateChange', date);
    diffSnapshot();
  });

  it('clears date', async () => {
    const date = new Date();
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <AddChallengeScreen />,
      {
        initialState: {},
        navParams: {
          onComplete,
          isEdit: false,
        },
      },
    );
    await fireEvent(getByTestId('datePicker'), 'onDateChange', date);
    recordSnapshot();
    await fireEvent(getByTestId('datePicker'), 'onDateChange', '');
    diffSnapshot();
  });

  it('sets disable false', async () => {
    const title = 'New Title';
    const date = new Date();
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <AddChallengeScreen />,
      {
        initialState: {},
        navParams: {
          onComplete,
          isEdit: false,
        },
      },
    );
    recordSnapshot();
    await fireEvent.changeText(getByTestId('titleInput'), title);
    await fireEvent(getByTestId('datePicker'), 'onDateChange', date);
    diffSnapshot();
  });

  it('calls onComplete', async () => {
    const title = 'New Title';
    const date = new Date();
    const details = 'New details for my challenge';
    const challenge = {
      title,
      date: moment(date)
        .endOf('day')
        .format(),
      id: '',
      details,
    };
    const { getByTestId, snapshot } = renderWithContext(
      <AddChallengeScreen />,
      {
        initialState: {},
        navParams: {
          onComplete,
          isEdit: false,
        },
      },
    );
    await fireEvent.changeText(getByTestId('titleInput'), title);
    await fireEvent(getByTestId('datePicker'), 'onDateChange', date);
    await fireEvent.changeText(getByTestId('detailInput'), details);
    await fireEvent.press(getByTestId('saveChallengeButton'));
    expect(onComplete).toHaveBeenCalledWith(challenge);
    snapshot();
  });
});
describe('edit methods', () => {
  const title = 'Old Title';
  const date = new Date();
  const details = 'New details for my challenge';
  const challenge = {
    title,
    date: moment(date)
      .endOf('day')
      .format(),
    id: '123',
  };
  it('calls onComplete', async () => {
    const { getByTestId, snapshot } = renderWithContext(
      <AddChallengeScreen />,
      {
        initialState: {},
        navParams: {
          onComplete,
          isEdit: true,
          challenge: { ...challenge, details_markdown: details },
        },
      },
    );
    await fireEvent.press(getByTestId('editButton'));
    expect(onComplete).toHaveBeenCalledWith({ ...challenge, details });
    snapshot();
  });

  it('disables button if user deletes title', async () => {
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <AddChallengeScreen />,
      {
        initialState: {},
        navParams: {
          onComplete,
          isEdit: true,
          challenge: { ...challenge, details_markdown: details },
        },
      },
    );
    recordSnapshot();
    await fireEvent.changeText(getByTestId('titleInput'), '');
    await fireEvent.press(getByTestId('editButton'));
    expect(onComplete).not.toHaveBeenCalled();
    diffSnapshot();
  });

  it('Saves challenge when user updates detail', async () => {
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <AddChallengeScreen />,
      {
        initialState: {},
        navParams: {
          onComplete,
          isEdit: true,
          challenge: { ...challenge, details_markdown: details },
        },
      },
    );
    recordSnapshot();
    await fireEvent.changeText(getByTestId('detailInput'), '');
    await fireEvent.press(getByTestId('editButton'));
    expect(onComplete).toHaveBeenCalledWith({ ...challenge, details: '' });
    diffSnapshot();
  });
});
