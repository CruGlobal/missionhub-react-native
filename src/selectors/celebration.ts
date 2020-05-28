import { createSelector } from 'reselect';

import { momentUtc, isLastTwentyFourHours } from '../utils/date';
import { CELEBRATEABLE_TYPES } from '../constants';
import { CelebrateItem } from '../components/CommunityFeedItem/__generated__/CelebrateItem';
import { CommunityCelebrationCelebrateableEnum } from '../../__generated__/globalTypes';

export interface CelebrateFeedSection {
  id: number;
  title: string;
  data: CelebrateItem[];
}

export const celebrationSelector = createSelector(
  ({ celebrateItems }: { celebrateItems: CelebrateItem[] }) => celebrateItems,
  celebrateItems => {
    const filteredCelebrateItems = filterCelebrationFeedItems(celebrateItems);
    const sortByDate = filteredCelebrateItems;
    sortByDate.sort(compare);

    const dateSections: CelebrateFeedSection[] = [
      { id: 1, title: 'dates.today', data: [] },
      { id: 2, title: 'dates.earlier', data: [] },
    ];
    sortByDate.forEach(item => {
      const itemMoment = momentUtc(item.changedAttributeValue);
      if (isLastTwentyFourHours(itemMoment)) {
        dateSections[0].data.push(item);
      } else {
        dateSections[1].data.push(item);
      }
    });
    // Filter out any sections with no data
    const filteredSections = dateSections.filter(
      section => section.data.length > 0,
    );

    return filteredSections;
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
