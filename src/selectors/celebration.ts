import { createSelector } from 'reselect';

import { momentUtc } from '../utils/common';
import { CELEBRATEABLE_TYPES } from '../constants';
import { OrganizationsState } from '../reducers/organizations';
import { GetCelebrateFeed_community_celebrationItems_nodes } from '../containers/CelebrateFeed/__generated__/GetCelebrateFeed';

export interface CelebrateFeedSection {
  id: number;
  date: string;
  data: GetCelebrateFeed_community_celebrationItems_nodes[];
}

export const celebrationItemSelector = createSelector(
  ({ organizations }: { organizations: OrganizationsState }) =>
    organizations.all,
  (
    _: { organizations: OrganizationsState },
    { eventId }: { eventId: string; organizationId: string },
  ) => eventId,
  (
    _: { organizations: OrganizationsState },
    { organizationId }: { eventId: string; organizationId: string },
  ) => organizationId,
  (orgs, eventId, organizationId) => {
    const { celebrateItems } = orgs.find(({ id }) => id === organizationId);

    return (
      celebrateItems &&
      celebrateItems.find(({ id }: CelebrateItem) => id === eventId)
    );
  },
);

export const celebrationSelector = createSelector(
  ({
    celebrateItems,
  }: {
    celebrateItems: GetCelebrateFeed_community_celebrationItems_nodes[];
  }) => celebrateItems,
  celebrateItems => {
    const filteredCelebrateItems = filterCelebrationFeedItems(celebrateItems);
    const sortByDate = filteredCelebrateItems;
    sortByDate.sort(compare);

    const dateSections: CelebrateFeedSection[] = [];
    sortByDate.forEach(item => {
      const length = dateSections.length;
      const itemMoment = momentUtc(item.changedAttributeValue).local();

      if (
        length > 0 &&
        itemMoment.isSame(
          momentUtc(dateSections[length - 1].date).local(),
          'day',
        )
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

const compare = (
  a: GetCelebrateFeed_community_celebrationItems_nodes,
  b: GetCelebrateFeed_community_celebrationItems_nodes,
) => {
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

const filterCelebrationFeedItems = (
  items: GetCelebrateFeed_community_celebrationItems_nodes[],
) => {
  const {
    completedInteraction,
    completedStep,
    validInteractionTypes,
    acceptedCommunityChallenge,
    createdCommunity,
    joinedCommunity,
    story,
  } = CELEBRATEABLE_TYPES;

  return items.filter(item => {
    switch (item.celebrateableType) {
      case completedInteraction:
        return validInteractionTypes.includes(
          `${item.adjectiveAttributeValue}`,
        );
      case completedStep:
      case acceptedCommunityChallenge:
      case createdCommunity:
      case joinedCommunity:
      case story:
        return true;
      default:
        return false;
    }
  });
};
