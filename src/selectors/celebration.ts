import { createSelector } from 'reselect';

import { momentUtc } from '../utils/common';
import { CELEBRATEABLE_TYPES } from '../constants';
import { OrganizationsState } from '../reducers/organizations';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CelebrateItem = any;

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
  ({ celebrateItems }: { celebrateItems: CelebrateItem[] }) => celebrateItems,
  celebrateItems => {
    const filteredCelebrateItems = filterCelebrationFeedItems(celebrateItems);
    const sortByDate = filteredCelebrateItems;
    sortByDate.sort(compare);

    const dateSections: {
      id: number;
      date: string;
      data: CelebrateItem[];
    }[] = [];
    sortByDate.forEach((item: CelebrateItem) => {
      const length = dateSections.length;
      const itemMoment = momentUtc(item.changed_attribute_value).local();

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
          date: item.changed_attribute_value,
          data: [item],
        });
      }
    });

    return dateSections;
  },
);

const compare = (a: CelebrateItem, b: CelebrateItem) => {
  const aValue = a.changed_attribute_value,
    bValue = b.changed_attribute_value;

  if (aValue < bValue) {
    return 1;
  }
  if (aValue > bValue) {
    return -1;
  }
  return 0;
};

const filterCelebrationFeedItems = (items: CelebrateItem[]) => {
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
    switch (item.celebrateable_type) {
      case completedInteraction:
        return validInteractionTypes.includes(
          `${item.adjective_attribute_value}`,
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
