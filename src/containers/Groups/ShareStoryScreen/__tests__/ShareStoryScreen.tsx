import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { navigatePush } from '../../../../actions/navigation';
import { renderWithContext } from '../../../../../testUtils';

import ShareStoryScreen from '..';

jest.mock('../../../../actions/navigation');
const onComplete = jest.fn();
const navigatePushResult = { type: 'navigated push' };
const organization = {
  id: '1234',
};

const MOCK_STORY = 'This is my cool story! 📘✏️';
const mockVariables = {
  variables: {
    input: { content: MOCK_STORY, organizationId: organization.id },
  },
};

beforeEach(() => {
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResult);
});

it('renders correctly', () => {
  renderWithContext(<ShareStoryScreen />, {
    initialState: {
      navigation: { state: { params: { onComplete, organization } } },
    },
    navParams: {
      onComplete,
      organization,
    },
  }).snapshot();
});

it('should find the saveStoryButton', () => {
  const { getByTestId } = renderWithContext(<ShareStoryScreen />, {
    initialState: {
      navigation: { state: { params: { onComplete, organization } } },
    },
    navParams: {
      onComplete,
      organization,
    },
  });
  expect(getByTestId('SaveStoryButton')).toBeTruthy();
});

describe('Creating a story', () => {
  it('should not call onComplete if the user has not typed anything', () => {
    const { getByTestId } = renderWithContext(<ShareStoryScreen />, {
      initialState: {
        navigation: { state: { params: { onComplete, organization } } },
      },
      navParams: {
        onComplete,
        organization,
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
