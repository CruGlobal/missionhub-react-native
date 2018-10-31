import { createSelector } from 'reselect';
import moment from 'moment';

import i18n from '../i18n';

import { organizationSelector } from './organizations';

export const challengesSelector = createSelector(
  ({ challengeItems }) => challengeItems,
  challengeItems => {
    const today = moment().endOf('day');

    const { currentItems, pastItems } = challengeItems.reduce(
      ({ currentItems, pastItems }, item) => {
        const endDate = moment(item.end_date).endOf('day');
        // Check if the end date is AFTER today (in the future)
        const isCurrent = endDate.diff(today, 'days') >= 0;

        return {
          currentItems: [
            ...currentItems,
            ...(isCurrent ? [{ ...item, isPast: false }] : []),
          ],
          pastItems: [
            ...pastItems,
            ...(isCurrent ? [] : [{ ...item, isPast: true }]),
          ],
        };
      },
      { currentItems: [], pastItems: [] },
    );

    return [
      {
        title: '',
        data: currentItems,
      },
      {
        title: i18n.t('challengeFeeds:past'),
        data: pastItems,
      },
    ];
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
    const sortedAcceptances = acceptedChallenges.reduce(
      ({ joined, completed }, item) => {
        const isPlaceHolder = item.person._placeHolder;
        const isCompleted = item.completed_at;

        return {
          joined: [
            ...joined,
            ...(!isPlaceHolder && !isCompleted ? [item] : []),
          ],
          completed: [
            ...completed,
            ...(!isPlaceHolder && isCompleted ? [item] : []),
          ],
        };
      },
      { joined: [], completed: [] },
    );

    return sortedAcceptances;
  },
);
