import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { navigatePush } from '../../../../actions/navigation';
import { renderWithContext } from '../../../../../testUtils';

import EditStoryScreen from '..';

jest.mock('../../../../actions/navigation');

const organization = {
  id: '1234',
};
const celebrationItem = {
  celebrateable_id: '111',
  object_description: 'It was the best of times...',
};

const onRefresh = jest.fn();
const navigatePushResult = { type: 'navigated push' };

beforeEach(() => {
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResult);
});

it('renders correctly', () => {
  renderWithContext(<EditStoryScreen />, {
    navParams: {
      celebrationItem,
      onRefresh,
    },
  }).snapshot();
});

it('renders empty text correctly', () => {
  renderWithContext(<EditStoryScreen />, {
    navParams: {
      celebrationItem: { ...celebrationItem, object_description: '' },
      onRefresh,
    },
  }).snapshot();
});

describe('saveStory', () => {
  it('should not call onComplete if the user has not typed anything', () => {
    const { getByTestId } = renderWithContext(<EditStoryScreen />, {
      navParams: {
        celebrationItem,
        onRefresh,
      },
    });

    fireEvent.press(getByTestId('SaveStoryButton'));

    expect(onComplete).not.toBeCalled();
  });

  it('user types a story', () => {
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <ShareStoryScreen />,
      {
        initialState: {
          navigation: { state: { params: { onComplete, organization } } },
        },
        navParams: {
          onComplete,
          organization,
        },
      },
    );
    recordSnapshot();
    fireEvent.changeText(getByTestId('StoryInput'), MOCK_STORY);
    diffSnapshot();
  });
  it('calls changeStory function when the user types a story and input value changes', async () => {
    const changeStory = jest.spyOn(React, 'useState');
    const { getByTestId, snapshot } = renderWithContext(<ShareStoryScreen />, {
      initialState: {
        navigation: { state: { params: { onComplete, organization } } },
      },
      navParams: {
        onComplete,
        organization,
      },
    });

    await fireEvent(getByTestId('StoryInput'), 'onChangeText', MOCK_STORY);

    expect(changeStory).toHaveBeenCalled();
    snapshot();
  });
  it('calls saveStory function when the user clicks the share story button', async () => {
    const { getByTestId } = renderWithContext(<ShareStoryScreen />, {
      initialState: {
        navigation: { state: { params: { onComplete, organization } } },
      },
      navParams: {
        onComplete,
        organization,
      },
    });

    await fireEvent(getByTestId('StoryInput'), 'onChangeText', MOCK_STORY);
    await fireEvent.press(getByTestId('SaveStoryButton'));
    expect(onComplete).toHaveBeenCalled();
  });
});
