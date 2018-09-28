import { createSelector } from 'reselect';
import moment from 'moment';

import i18n from '../i18n';

export const challengesSelector = createSelector(
  ({ challengeItems }) => challengeItems,
  challengeItems => {
    const sections = [
      {
        title: '',
        data: [],
      },
      {
        title: i18n.t('challengeFeeds:past'),
        data: [],
      },
    ];

    const sortedItems = challengeItems.sort(compareCreatedDates);

    const today = moment().endOf('day');
    sortedItems.forEach(item => {
      // Make sure we get the end of the day from the given
      const endDate = moment(item.end_date).endOf('day');
      // Check if the end date is AFTER today (in the future)
      if (endDate.diff(today, 'days') >= 0) {
        sections[0].data.push({ ...item, isPast: false });
      } else {
        sections[1].data.push({ ...item, isPast: true });
      }
    });

    return sections;
  },
);

const compareCreatedDates = (a, b) => {
  const aValue = a.created_at,
    bValue = b.created_at;

  if (aValue < bValue) {
    return 1;
  }
  if (aValue > bValue) {
    return -1;
  }
  return 0;
};
