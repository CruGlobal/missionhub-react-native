import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { navigateBack } from '../../../../actions/navigation';
import { renderWithContext } from '../../../../../testUtils';
import {
  ANALYTICS_PERMISSION_TYPE,
  ORG_PERMISSIONS,
} from '../../../../constants';
import { mockFragment } from '../../../../../testUtils/apolloMockClient';
import { useAnalytics } from '../../../../utils/hooks/useAnalytics';
import { CELEBRATE_ITEM_FRAGMENT } from '../../../../components/CelebrateItem/queries';
import { GetCelebrateFeed_community_celebrationItems_nodes as CelebrateItem } from '../../../CelebrateFeed/__generated__/GetCelebrateFeed';

import EditStoryScreen from '..';

jest.mock('../../../../actions/navigation');
jest.mock('../../../../utils/hooks/useAnalytics');

const organization = { id: '123' };
const initialState = {
  auth: {
    person: {
      id: '1',
      organizational_permissions: [
        {
          id: '2',
          organization_id: organization.id,
          permission_id: ORG_PERMISSIONS.USER,
        },
      ],
    },
  },
};
const celebrationItem = mockFragment<CelebrateItem>(CELEBRATE_ITEM_FRAGMENT);

const newText = 'It was the worst of times...';

const onRefresh = jest.fn();
const navigateBackResult = { type: 'navigated back' };

beforeEach(() => {
  (navigateBack as jest.Mock).mockReturnValue(navigateBackResult);
});

it('renders correctly', () => {
  renderWithContext(<EditStoryScreen />, {
    initialState,
    navParams: {
      organization,
      celebrationItem,
      onRefresh,
    },
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith({
    screenName: ['story', 'edit'],
    screenContext: { [ANALYTICS_PERMISSION_TYPE]: 'member' },
  });
});

it('renders empty text correctly', () => {
  renderWithContext(<EditStoryScreen />, {
    initialState,
    navParams: {
      organization,
      celebrationItem: { ...celebrationItem, objectDescription: null },
      onRefresh,
    },
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith({
    screenName: ['story', 'edit'],
    screenContext: { [ANALYTICS_PERMISSION_TYPE]: 'member' },
  });
});

describe('saveStory', () => {
  it('should not call onComplete if the user has not typed anything', () => {
    const { getByTestId } = renderWithContext(<EditStoryScreen />, {
      initialState,
      navParams: {
        organization,
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
        initialState,
        navParams: {
          organization,
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
      initialState,
      navParams: {
        organization,
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
