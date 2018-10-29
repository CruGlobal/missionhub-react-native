import { createSelector } from 'reselect';
import moment from 'moment';

import i18n from '../i18n';

import { organizationSelector } from './organizations';

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

    const today = moment().endOf('day');
    challengeItems.forEach(item => {
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

export const communityChallengeSelector = createSelector(
  ({ organizations }, { orgId }) =>
    organizationSelector({ organizations }, { orgId }),
  (_, { challengeId }) => challengeId,
  (org, challengeId) => org.challengeItems.find(c => c.id === challengeId),
);

export const acceptedChallengesSelector = createSelector(
  ({ acceptedChallenges }) => acceptedChallenges,
  acceptedChallenges => {
    const sortedAcceptances = { joined: [], completed: [] };
    acceptedChallenges.forEach(a => {
      if (a.person._placeHolder) {
        return;
      }
      if (a.completed_at) {
        sortedAcceptances.completed.push(a);
      } else {
        sortedAcceptances.joined.push(a);
      }
    });
    return sortedAcceptances;
  },
);
