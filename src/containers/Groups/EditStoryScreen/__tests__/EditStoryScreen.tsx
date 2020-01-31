import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { navigateBack } from '../../../../actions/navigation';
import { renderWithContext } from '../../../../../testUtils';
import { useAnalytics } from '../../../../utils/hooks/useAnalytics';

import EditStoryScreen from '..';

jest.mock('../../../../actions/navigation');
jest.mock('../../../../utils/hooks/useAnalytics');

const celebrationItem = {
  celebrateable_id: '111',
  object_description: 'It was the best of times...',
};

const newText = 'It was the worst of times...';

const onRefresh = jest.fn();
const navigateBackResult = { type: 'navigated back' };

beforeEach(() => {
  (navigateBack as jest.Mock).mockReturnValue(navigateBackResult);
});

it('renders correctly', () => {
  renderWithContext(<EditStoryScreen />, {
    navParams: {
      celebrationItem,
      onRefresh,
    },
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['story', 'edit']);
});

it('renders empty text correctly', () => {
  renderWithContext(<EditStoryScreen />, {
    navParams: {
      celebrationItem: { ...celebrationItem, object_description: '' },
      onRefresh,
    },
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['story', 'edit']);
});

describe('saveStory', () => {
  it('should not call onComplete if the user has not typed anything', () => {
    const { getByTestId } = renderWithContext(<EditStoryScreen />, {
      navParams: {
        celebrationItem,
        onRefresh,
      },
    });

    fireEvent.changeText(getByTestId('EditInput'), '');
    fireEvent.press(getByTestId('saveStoryButton'));

    expect(onRefresh).not.toHaveBeenCalled();
    expect(navigateBack).not.toHaveBeenCalled();
  });

  it('user edits story', () => {
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <EditStoryScreen />,
      {
        navParams: {
          celebrationItem,
          onRefresh,
        },
      },
    );
    recordSnapshot();
    fireEvent.changeText(getByTestId('EditInput'), newText);
    diffSnapshot();
  });

  it('calls saveStory function when the user clicks the share story button', async () => {
    const { getByTestId } = renderWithContext(<EditStoryScreen />, {
      navParams: {
        celebrationItem,
        onRefresh,
      },
    });

    await fireEvent(getByTestId('EditInput'), 'onChangeText', newText);
    await fireEvent.press(getByTestId('saveStoryButton'));

    expect(onRefresh).toHaveBeenCalledWith();
    expect(navigateBack).toHaveBeenCalledWith();
  });
});
