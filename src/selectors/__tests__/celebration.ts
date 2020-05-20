import { mockFragment } from '../../../testUtils/apolloMockClient';
import MockDate from 'mockdate';
import { celebrationSelector } from '../celebration';
import { CelebrateItem } from '../../components/CommunityFeedItem/__generated__/CelebrateItem';
import { CELEBRATE_ITEM_FRAGMENT } from '../../components/CommunityFeedItem/queries';
import { CommunityCelebrationCelebrateableEnum } from '../../../__generated__/globalTypes';

const mockDate = '2020-05-20 12:00:00 UTC';
MockDate.set(mockDate);
const event = mockFragment<CelebrateItem>(CELEBRATE_ITEM_FRAGMENT);
const itemOne = { ...event, changedAttributeValue: '2020-05-20 11:00:00 UTC' };

const celebrateItems: CelebrateItem[] = [
  itemOne,
  {
    ...itemOne,
    id: '2',
    celebrateableType:
      CommunityCelebrationCelebrateableEnum.COMPLETED_INTERACTION,
    adjectiveAttributeValue: '4',
    changedAttributeValue: '2017-01-01 00:00:00 UTC',
  },
  {
    ...itemOne,
    id: '3',
    celebrateableType:
      CommunityCelebrationCelebrateableEnum.COMPLETED_INTERACTION,
    adjectiveAttributeValue: '11',
    changedAttributeValue: '2018-01-02 00:07:00 UTC',
  },
  {
    ...itemOne,
    id: '4',
    celebrateableType: CommunityCelebrationCelebrateableEnum.COMPLETED_STEP,
    adjectiveAttributeValue: '2',
    changedAttributeValue: '2018-01-07 00:00:00 UTC',
  },
  {
    ...itemOne,
    id: '5',
    celebrateableType:
      CommunityCelebrationCelebrateableEnum.COMPLETED_INTERACTION,
    adjectiveAttributeValue: '9',
    changedAttributeValue: '2018-01-05 00:00:00 UTC',
  },
  {
    ...itemOne,
    id: '6',
    celebrateableType:
      CommunityCelebrationCelebrateableEnum.COMPLETED_INTERACTION,
    adjectiveAttributeValue: '5',
    changedAttributeValue: '2018-01-02 00:23:00 UTC',
  },
  {
    ...itemOne,
    id: '7',
    celebrateableType:
      CommunityCelebrationCelebrateableEnum.COMPLETED_INTERACTION,
    adjectiveAttributeValue: '3',
    changedAttributeValue: '2018-01-02 00:00:00 UTC',
  },
  {
    ...itemOne,
    id: '8',
    celebrateableType:
      CommunityCelebrationCelebrateableEnum.COMMUNITY_CHALLENGE,
    changedAttributeName: 'accepted_at',
    changedAttributeValue: '2018-01-06 00:04:00 UTC',
  },
  {
    ...itemOne,
    id: '9',
    celebrateableType:
      CommunityCelebrationCelebrateableEnum.COMMUNITY_CHALLENGE,
    changedAttributeName: 'completed_at',
    changedAttributeValue: '2018-01-06 00:05:00 UTC',
  },
  {
    ...itemOne,
    id: '10',
    celebrateableType: CommunityCelebrationCelebrateableEnum.CREATED_COMMUNITY,
    changedAttributeName: 'created_at',
    changedAttributeValue: '2016-12-25 00:02:00 UTC',
  },
  {
    ...itemOne,
    id: '11',
    celebrateableType: CommunityCelebrationCelebrateableEnum.JOINED_COMMUNITY,
    changedAttributeName: 'created_at',
    changedAttributeValue: '2016-12-25 00:09:00 UTC',
  },
  {
    ...itemOne,
    id: '12',
    celebrateableType: CommunityCelebrationCelebrateableEnum.STORY,
    changedAttributeName: 'created_at',
    changedAttributeValue: '2016-12-25 00:09:00 UTC',
  },
];

const invalidItems: CelebrateItem[] = [
  {
    ...itemOne,
    id: '13',
    celebrateableType:
      CommunityCelebrationCelebrateableEnum.COMPLETED_INTERACTION,
    adjectiveAttributeValue: '42',
    changedAttributeValue: '2018-01-01 00:00:00 UTC',
  },
  {
    ...itemOne,
    id: '14',
    celebrateableType:
      CommunityCelebrationCelebrateableEnum.COMPLETED_INTERACTION,
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
