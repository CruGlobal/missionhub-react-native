import React from 'react';
import { fireEvent } from 'react-native-testing-library';
import { useMutation } from '@apollo/react-hooks';

import {
  ACTIONS,
  ORG_PERMISSIONS,
  ANALYTICS_PERMISSION_TYPE,
} from '../../../../constants';
import { navigatePush } from '../../../../actions/navigation';
import { trackActionWithoutData } from '../../../../actions/analytics';
import { renderWithContext } from '../../../../../testUtils';
import { useAnalytics } from '../../../../utils/hooks/useAnalytics';
import * as common from '../../../../utils/common';

import ShareStoryScreen, { CREATE_A_STORY } from '..';

jest.mock('../../../../actions/navigation');
jest.mock('../../../../actions/analytics');
jest.mock('../../../../utils/hooks/useAnalytics');

const myId = '5';
const onComplete = jest.fn();
const navigatePushResult = { type: 'navigated push' };
const organization = {
  id: '1234',
};
const orgPermission = {
  organization_id: organization.id,
  permission_id: ORG_PERMISSIONS.OWNER,
};

const MOCK_STORY = 'This is my cool story! 📘✏️';

const initialState = {
  auth: { person: { id: myId, organizational_permissions: [orgPermission] } },
};

beforeEach(() => {
  ((common as unknown) as { isAndroid: boolean }).isAndroid = false;
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResult);
  (trackActionWithoutData as jest.Mock).mockReturnValue(() =>
    Promise.resolve(),
  );
});

it('renders correctly', () => {
  renderWithContext(<ShareStoryScreen />, {
    initialState,
    navParams: { onComplete, organization },
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['story', 'share'], {
    screenContext: {
      [ANALYTICS_PERMISSION_TYPE]: 'owner',
    },
  });
});

it('renders correctly on android', () => {
  ((common as unknown) as { isAndroid: boolean }).isAndroid = true;
  renderWithContext(<ShareStoryScreen />, {
    initialState,
    navParams: { onComplete, organization },
  }).snapshot();
});

it('should find the saveStoryButton', () => {
  const { getByTestId } = renderWithContext(<ShareStoryScreen />, {
    initialState,
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
      initialState,
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
        initialState,
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
      initialState,
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
      initialState,
      navParams: {
        onComplete,
        organization,
      },
    });

    await fireEvent(getByTestId('StoryInput'), 'onChangeText', MOCK_STORY);
    await fireEvent.press(getByTestId('SaveStoryButton'));

    expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.SHARE_STORY);
    expect(onComplete).toHaveBeenCalledWith();
    expect(useMutation).toHaveBeenMutatedWith(CREATE_A_STORY, {
      variables: {
        input: {
          content: 'This is my cool story! 📘✏️',
          organizationId: '1234',
        },
      },
    });
  });
});
