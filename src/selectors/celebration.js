import { createSelector } from 'reselect';

import { momentUtc } from '../utils/common';
import { CELEBRATEABLE_TYPES } from '../constants';

import { organizationSelector } from './organizations';

export const celebrationSelector = createSelector(
  ({ organizations }, { orgId }) =>
    organizationSelector({ organizations }, { orgId }),
  ({ celebration }) => celebration.allById,
  (org, celebrations) => celebrations[org.celebrationId] || {},
);

export const celebrationByDateSelector = createSelector(
  ({ celebrateItems }) => celebrateItems,
  celebrateItems => {
    const filteredCelebrateItems = filterCelebrationFeedItems(celebrateItems);
    let sortByDate = filteredCelebrateItems;
    sortByDate.sort(compare);

    let dateSections = [];
    sortByDate.forEach(item => {
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

const compare = (a, b) => {
  let aValue = a.changed_attribute_value,
    bValue = b.changed_attribute_value;

  if (aValue < bValue) {
    return 1;
  }
  if (aValue > bValue) {
    return -1;
  }
  return 0;
};

const filterCelebrationFeedItems = items => {
  const {
    completedInteraction,
    completedStep,
    validInteractionTypes,
  } = CELEBRATEABLE_TYPES;

  return items.filter(item => {
    switch (item.celebrateable_type) {
      case completedInteraction:
        return validInteractionTypes.includes(
          parseInt(item.adjective_attribute_value),
        );
      case completedStep:
        return true;
      default:
        return false;
    }
  });
};
