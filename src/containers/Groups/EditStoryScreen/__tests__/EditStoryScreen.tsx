import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import {
  ANALYTICS_PERMISSION_TYPE,
  ORG_PERMISSIONS,
} from '../../../../constants';
import { navigateBack } from '../../../../actions/navigation';
import { renderWithContext } from '../../../../../testUtils';
import { mockFragment } from '../../../../../testUtils/apolloMockClient';
import { useAnalytics } from '../../../../utils/hooks/useAnalytics';
import { CELEBRATE_ITEM_FRAGMENT } from '../../../../components/CelebrateItem/queries';
import { GetCelebrateFeed_community_celebrationItems_nodes as CelebrateItem } from '../../../CelebrateFeed/__generated__/GetCelebrateFeed';
import * as common from '../../../../utils/common';

import EditStoryScreen from '..';

jest.mock('../../../../actions/navigation');
jest.mock('../../../../utils/hooks/useAnalytics');

const celebrationItem = mockFragment<CelebrateItem>(CELEBRATE_ITEM_FRAGMENT);

const myId = '3';
const orgId = '4';
const organization = { id: orgId };
const orgPermission = {
  organization_id: orgId,
  permission_id: ORG_PERMISSIONS.OWNER,
};
const newText = 'It was the worst of times...';

const onRefresh = jest.fn();
const navigateBackResult = { type: 'navigated back' };

const initialState = {
  auth: { person: { id: myId, organizational_permissions: [orgPermission] } },
};

beforeEach(() => {
  ((common as unknown) as { isAndroid: boolean }).isAndroid = false;
  (navigateBack as jest.Mock).mockReturnValue(navigateBackResult);
});

it('renders correctly', () => {
  renderWithContext(<EditStoryScreen />, {
    initialState,
    navParams: {
      celebrationItem,
      onRefresh,
      organization,
    },
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['story', 'edit'], {
    screenContext: { [ANALYTICS_PERMISSION_TYPE]: 'owner' },
  });
});

it('renders correctly on android', () => {
  ((common as unknown) as { isAndroid: boolean }).isAndroid = true;
  renderWithContext(<EditStoryScreen />, {
    initialState,
    navParams: {
      celebrationItem,
      onRefresh,
      organization,
    },
  }).snapshot();
});

it('renders empty text correctly', () => {
  renderWithContext(<EditStoryScreen />, {
    initialState,
    navParams: {
      celebrationItem: { ...celebrationItem, objectDescription: null },
      onRefresh,
      organization,
    },
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['story', 'edit'], {
    screenContext: { [ANALYTICS_PERMISSION_TYPE]: 'owner' },
  });
});

describe('saveStory', () => {
  it('should not call onComplete if the user has not typed anything', () => {
    const { getByTestId } = renderWithContext(<EditStoryScreen />, {
      initialState,
      navParams: {
        celebrationItem,
        onRefresh,
        organization,
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
        initialState,
        navParams: {
          celebrationItem,
          onRefresh,
          organization,
        },
      },
    );
    recordSnapshot();
    fireEvent.changeText(getByTestId('EditInput'), newText);
    diffSnapshot();
  });

  it('calls saveStory function when the user clicks the share story button', async () => {
    const { getByTestId } = renderWithContext(<EditStoryScreen />, {
      initialState,
      navParams: {
        celebrationItem,
        onRefresh,
        organization,
      },
    });

    await fireEvent(getByTestId('EditInput'), 'onChangeText', newText);
    await fireEvent.press(getByTestId('saveStoryButton'));

    expect(onRefresh).toHaveBeenCalledWith();
    expect(navigateBack).toHaveBeenCalledWith();
  });
});
