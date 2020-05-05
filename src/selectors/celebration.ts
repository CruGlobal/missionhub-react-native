import { createSelector } from 'reselect';

import { momentUtc } from '../utils/date';
import { CELEBRATEABLE_TYPES } from '../constants';
import { CelebrateItem } from '../components/CommunityFeedItem/__generated__/CelebrateItem';
import { CommunityCelebrationCelebrateableEnum } from '../../__generated__/globalTypes';

export interface CelebrateFeedSection {
  id: number;
  date: string;
  data: CelebrateItem[];
}

export const celebrationSelector = createSelector(
  ({ celebrateItems }: { celebrateItems: CelebrateItem[] }) => celebrateItems,
  celebrateItems => {
    const filteredCelebrateItems = filterCelebrationFeedItems(celebrateItems);
    const sortByDate = filteredCelebrateItems;
    sortByDate.sort(compare);

    const dateSections: CelebrateFeedSection[] = [];
    sortByDate.forEach(item => {
      const length = dateSections.length;
      const itemMoment = momentUtc(item.changedAttributeValue);

      if (
        length > 0 &&
        itemMoment.isSame(momentUtc(dateSections[length - 1].date), 'day')
      ) {
        dateSections[length - 1].data.push(item);
      } else {
        dateSections.push({
          id: dateSections.length,
          date: item.changedAttributeValue,
          data: [item],
        });
      }
    });

    return dateSections;
  },
);

const compare = (a: CelebrateItem, b: CelebrateItem) => {
  const aValue = a.changedAttributeValue,
    bValue = b.changedAttributeValue;

  if (aValue < bValue) {
    return 1;
  }
  if (aValue > bValue) {
    return -1;
  }
  return 0;
};

const filterCelebrationFeedItems = (items: CelebrateItem[]) => {
  const { validInteractionTypes } = CELEBRATEABLE_TYPES;

  return items.filter(item => {
    switch (item.celebrateableType) {
      case CommunityCelebrationCelebrateableEnum.COMPLETED_INTERACTION:
        return validInteractionTypes.includes(
          `${item.adjectiveAttributeValue}`,
        );
      case CommunityCelebrationCelebrateableEnum.COMPLETED_STEP:
      case CommunityCelebrationCelebrateableEnum.COMMUNITY_CHALLENGE:
      case CommunityCelebrationCelebrateableEnum.CREATED_COMMUNITY:
      case CommunityCelebrationCelebrateableEnum.JOINED_COMMUNITY:
      case CommunityCelebrationCelebrateableEnum.STORY:
        return true;
      default:
        return false;
    }
  });
};
