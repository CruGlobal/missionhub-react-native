import { celebrationSelector } from '../celebration';
import { ACCEPTED_STEP } from '../../constants';
import { GetCelebrateFeed_community_celebrationItems_nodes } from '../../containers/CelebrateFeed/__generated__/GetCelebrateFeed';

const itemOne: GetCelebrateFeed_community_celebrationItems_nodes = {
  __typename: 'CommunityCelebrationItem',
  id: '1',
  adjectiveAttributeName: '',
  adjectiveAttributeValue: '2',
  celebrateableId: '1',
  celebrateableType: 'interaction',
  changedAttributeName: '',
  changedAttributeValue: '2018-01-01 00:00:00 UTC',
  commentsCount: 0,
  liked: false,
  likesCount: 0,
  objectDescription: null,
  subjectPerson: null,
  subjectPersonName: null,
};

const celebrateItems: GetCelebrateFeed_community_celebrationItems_nodes[] = [
  itemOne,
  {
    ...itemOne,
    id: '2',
    celebrateableType: 'interaction',
    adjectiveAttributeValue: '4',
    changedAttributeValue: '2017-01-01 00:00:00 UTC',
  },
  {
    ...itemOne,
    id: '3',
    celebrateableType: 'interaction',
    adjectiveAttributeValue: '11',
    changedAttributeValue: '2018-01-02 00:07:00 UTC',
  },
  {
    ...itemOne,
    id: '4',
    celebrateableType: ACCEPTED_STEP,
    adjectiveAttributeValue: '2',
    changedAttributeValue: '2018-01-07 00:00:00 UTC',
  },
  {
    ...itemOne,
    id: '5',
    celebrateableType: 'interaction',
    adjectiveAttributeValue: '9',
    changedAttributeValue: '2018-01-05 00:00:00 UTC',
  },
  {
    ...itemOne,
    id: '6',
    celebrateableType: 'interaction',
    adjectiveAttributeValue: '5',
    changedAttributeValue: '2018-01-02 00:23:00 UTC',
  },
  {
    ...itemOne,
    id: '7',
    celebrateableType: 'interaction',
    adjectiveAttributeValue: '3',
    changedAttributeValue: '2018-01-02 00:00:00 UTC',
  },
  {
    ...itemOne,
    id: '8',
    celebrateableType: 'accepted_community_challenge',
    changedAttributeName: 'accepted_at',
    changedAttributeValue: '2018-01-06 00:04:00 UTC',
  },
  {
    ...itemOne,
    id: '9',
    celebrateableType: 'accepted_community_challenge',
    changedAttributeName: 'completed_at',
    changedAttributeValue: '2018-01-06 00:05:00 UTC',
  },
  {
    ...itemOne,
    id: '10',
    celebrateableType: 'organization',
    changedAttributeName: 'created_at',
    changedAttributeValue: '2016-12-25 00:02:00 UTC',
  },
  {
    ...itemOne,
    id: '11',
    celebrateableType: 'organizational_permission',
    changedAttributeName: 'created_at',
    changedAttributeValue: '2016-12-25 00:09:00 UTC',
  },
  {
    ...itemOne,
    id: '12',
    celebrateableType: 'story',
    changedAttributeName: 'created_at',
    changedAttributeValue: '2016-12-25 00:09:00 UTC',
  },
];

const invalidItems: GetCelebrateFeed_community_celebrationItems_nodes[] = [
  {
    ...itemOne,
    id: '13',
    celebrateableType: 'interaction',
    adjectiveAttributeValue: '42',
    changedAttributeValue: '2018-01-01 00:00:00 UTC',
  },
  {
    ...itemOne,
    id: '14',
    celebrateableType: 'interaction',
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
