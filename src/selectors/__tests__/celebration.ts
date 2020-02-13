import { mockFragment } from '../../../testUtils/apolloMockClient';
import { celebrationSelector } from '../celebration';
import { GetCelebrateFeed_community_celebrationItems_nodes as CelebrateItem } from '../../containers/CelebrateFeed/__generated__/GetCelebrateFeed';
import { CELEBRATE_ITEM_FRAGMENT } from '../../components/CelebrateItem/queries';
import { CommunityCelebrationCelebrateableEnum } from '../../../__generated__/globalTypes';

const event = mockFragment<CelebrateItem>(CELEBRATE_ITEM_FRAGMENT);
const itemOne = { ...event, changedAttributeValue: '2018-01-01 00:00:00 UTC' };

const celebrateItems: CelebrateItem[] = [
  itemOne,
  {
    ...itemOne,
    id: '2',
    celebrateableType:
      CommunityCelebrationCelebrateableEnum.completed_interaction,
    adjectiveAttributeValue: '4',
    changedAttributeValue: '2017-01-01 00:00:00 UTC',
  },
  {
    ...itemOne,
    id: '3',
    celebrateableType:
      CommunityCelebrationCelebrateableEnum.completed_interaction,
    adjectiveAttributeValue: '11',
    changedAttributeValue: '2018-01-02 00:07:00 UTC',
  },
  {
    ...itemOne,
    id: '4',
    celebrateableType: CommunityCelebrationCelebrateableEnum.completed_step,
    adjectiveAttributeValue: '2',
    changedAttributeValue: '2018-01-07 00:00:00 UTC',
  },
  {
    ...itemOne,
    id: '5',
    celebrateableType:
      CommunityCelebrationCelebrateableEnum.completed_interaction,
    adjectiveAttributeValue: '9',
    changedAttributeValue: '2018-01-05 00:00:00 UTC',
  },
  {
    ...itemOne,
    id: '6',
    celebrateableType:
      CommunityCelebrationCelebrateableEnum.completed_interaction,
    adjectiveAttributeValue: '5',
    changedAttributeValue: '2018-01-02 00:23:00 UTC',
  },
  {
    ...itemOne,
    id: '7',
    celebrateableType:
      CommunityCelebrationCelebrateableEnum.completed_interaction,
    adjectiveAttributeValue: '3',
    changedAttributeValue: '2018-01-02 00:00:00 UTC',
  },
  {
    ...itemOne,
    id: '8',
    celebrateableType:
      CommunityCelebrationCelebrateableEnum.community_challenge,
    changedAttributeName: 'accepted_at',
    changedAttributeValue: '2018-01-06 00:04:00 UTC',
  },
  {
    ...itemOne,
    id: '9',
    celebrateableType:
      CommunityCelebrationCelebrateableEnum.community_challenge,
    changedAttributeName: 'completed_at',
    changedAttributeValue: '2018-01-06 00:05:00 UTC',
  },
  {
    ...itemOne,
    id: '10',
    celebrateableType: CommunityCelebrationCelebrateableEnum.created_community,
    changedAttributeName: 'created_at',
    changedAttributeValue: '2016-12-25 00:02:00 UTC',
  },
  {
    ...itemOne,
    id: '11',
    celebrateableType: CommunityCelebrationCelebrateableEnum.joined_community,
    changedAttributeName: 'created_at',
    changedAttributeValue: '2016-12-25 00:09:00 UTC',
  },
  {
    ...itemOne,
    id: '12',
    celebrateableType: CommunityCelebrationCelebrateableEnum.story,
    changedAttributeName: 'created_at',
    changedAttributeValue: '2016-12-25 00:09:00 UTC',
  },
];

const invalidItems: CelebrateItem[] = [
  {
    ...itemOne,
    id: '13',
    celebrateableType:
      CommunityCelebrationCelebrateableEnum.completed_interaction,
    adjectiveAttributeValue: '42',
    changedAttributeValue: '2018-01-01 00:00:00 UTC',
  },
  {
    ...itemOne,
    id: '14',
    celebrateableType:
      CommunityCelebrationCelebrateableEnum.completed_interaction,
    adjectiveAttributeValue: '1',
    changedAttributeValue: '2017-01-01 00:00:00 UTC',
  },
  {
    ...itemOne,
    id: '15',
    celebrateableType: 'type not in enum' as CommunityCelebrationCelebrateableEnum,
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
