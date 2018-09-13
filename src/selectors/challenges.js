import { createSelector } from 'reselect';
import moment from 'moment';

import i18n from '../i18n';
import { momentUtc } from '../utils/common';

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
    const today = moment();
    challengeItems.forEach(item => {
      const endDate = momentUtc(item.end_date);
      // Check if the end date is AFTER today (in the future)
      if (endDate.diff(today, 'minutes') > 0) {
        sections[0].data.push({ ...item, isPast: false });
      } else {
        sections[1].data.push({ ...item, isPast: true });
      }
    });

    return sections;
  },
);
