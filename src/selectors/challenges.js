import { createSelector } from 'reselect';

import i18n from '../i18n';

export const challengesSelector = createSelector(
  ({ challengeItems }) => challengeItems,
  challengeItems => {
    let sections = [
      {
        title: '',
        data: [],
      },
      {
        title: i18n.t('challengeFeeds:past'),
        data: [],
      },
    ];
    challengeItems.forEach(item => {
      if (item.days_remaining > 0) {
        sections[0].data.push({ ...item, isPast: false });
      } else {
        sections[1].data.push({ ...item, isPast: true });
      }
    });

    return sections;
  },
);
