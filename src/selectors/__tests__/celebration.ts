import { mockFragment } from '../../../testUtils/apolloMockClient';
import { celebrationSelector } from '../celebration';
import { ACCEPTED_STEP, CELEBRATEABLE_TYPES } from '../../constants';
import { GetCelebrateFeed_community_celebrationItems_nodes as CelebrateItem } from '../../containers/CelebrateFeed/__generated__/GetCelebrateFeed';
import { CELEBRATE_ITEM_FRAGMENT } from '../../components/CelebrateItem/queries';

const event = mockFragment<CelebrateItem>(CELEBRATE_ITEM_FRAGMENT);
const itemOne = { ...event, changedAttributeValue: '2018-01-01 00:00:00 UTC' };

const celebrateItems: CelebrateItem[] = [
  itemOne,
  {
    ...itemOne,
    id: '2',
    celebrateableType: CELEBRATEABLE_TYPES.completedInteraction,
    adjectiveAttributeValue: '4',
    changedAttributeValue: '2017-01-01 00:00:00 UTC',
  },
  {
    ...itemOne,
    id: '3',
    celebrateableType: CELEBRATEABLE_TYPES.completedInteraction,
    adjectiveAttributeValue: '11',
    changedAttributeValue: '2018-01-02 00:07:00 UTC',
  },
  {
    ...itemOne,
    id: '4',
    celebrateableType: CELEBRATEABLE_TYPES.completedStep,
    adjectiveAttributeValue: '2',
    changedAttributeValue: '2018-01-07 00:00:00 UTC',
  },
  {
    ...itemOne,
    id: '5',
    celebrateableType: CELEBRATEABLE_TYPES.completedInteraction,
    adjectiveAttributeValue: '9',
    changedAttributeValue: '2018-01-05 00:00:00 UTC',
  },
  {
    ...itemOne,
    id: '6',
    celebrateableType: CELEBRATEABLE_TYPES.completedInteraction,
    adjectiveAttributeValue: '5',
    changedAttributeValue: '2018-01-02 00:23:00 UTC',
  },
  {
    ...itemOne,
    id: '7',
    celebrateableType: CELEBRATEABLE_TYPES.completedInteraction,
    adjectiveAttributeValue: '3',
    changedAttributeValue: '2018-01-02 00:00:00 UTC',
  },
  {
    ...itemOne,
    id: '8',
    celebrateableType: CELEBRATEABLE_TYPES.acceptedCommunityChallenge,
    changedAttributeName: 'accepted_at',
    changedAttributeValue: '2018-01-06 00:04:00 UTC',
  },
  {
    ...itemOne,
    id: '9',
    celebrateableType: CELEBRATEABLE_TYPES.acceptedCommunityChallenge,
    changedAttributeName: 'completed_at',
    changedAttributeValue: '2018-01-06 00:05:00 UTC',
  },
  {
    ...itemOne,
    id: '10',
    celebrateableType: CELEBRATEABLE_TYPES.createdCommunity,
    changedAttributeName: 'created_at',
    changedAttributeValue: '2016-12-25 00:02:00 UTC',
  },
  {
    ...itemOne,
    id: '11',
    celebrateableType: CELEBRATEABLE_TYPES.joinedCommunity,
    changedAttributeName: 'created_at',
    changedAttributeValue: '2016-12-25 00:09:00 UTC',
  },
  {
    ...itemOne,
    id: '12',
    celebrateableType: CELEBRATEABLE_TYPES.story,
    changedAttributeName: 'created_at',
    changedAttributeValue: '2016-12-25 00:09:00 UTC',
  },
];

const invalidItems: CelebrateItem[] = [
  {
    ...itemOne,
    id: '13',
    celebrateableType: CELEBRATEABLE_TYPES.completedInteraction,
    adjectiveAttributeValue: '42',
    changedAttributeValue: '2018-01-01 00:00:00 UTC',
  },
  {
    ...itemOne,
    id: '14',
    celebrateableType: CELEBRATEABLE_TYPES.completedInteraction,
    adjectiveAttributeValue: '1',
    changedAttributeValue: '2017-01-01 00:00:00 UTC',
  },
  {
    ...itemOne,
    id: '15',
    celebrateableType: 'roge',
    adjectiveAttributeValue: '11',
    changedAttributeValue: '2018-01-02 00:07:00 UTC',
  },
];

describe('celebrationSelector', () => {
  it('sorts items into sections by date', () => {
    expect(celebrationSelector({ celebrateItems })).toMatchSnapshot();
  });

  it('filters out celebrate items it cannot render', () => {
    const combinedItems = celebrateItems.concat(invalidItems);
    const selectedCelebrationItems = celebrationSelector({
      celebrateItems: combinedItems,
    });
    expect(selectedCelebrationItems).toMatchSnapshot();
  });
});
