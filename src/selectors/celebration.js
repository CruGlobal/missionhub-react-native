import { createSelector } from 'reselect';

import { momentUtc } from '../utils/common';

export const celebrationSelector = createSelector(
  ({ celebrateItems }) => celebrateItems,
  celebrateItems => {
    let sortByDate = celebrateItems;
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
