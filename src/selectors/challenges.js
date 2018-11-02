import { createSelector } from 'reselect';
import moment from 'moment';

import i18n from '../i18n';

import { organizationSelector } from './organizations';

export const challengesSelector = createSelector(
  ({ challengeItems }) => challengeItems,
  challengeItems => {
    const { currentItems, pastItems } = challengeItems.reduce(
      ({ currentItems, pastItems }, item) => {
        const isPast = challengeIsPast(item);
        return {
          currentItems: [
            ...currentItems,
            ...(isPast ? [] : [{ ...item, isPast: false }]),
          ],
          pastItems: [
            ...pastItems,
            ...(isPast ? [{ ...item, isPast: true }] : []),
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
  (org, challengeId) => {
    const challenge = org.challengeItems.find(c => c.id === challengeId);
    return challenge && { ...challenge, isPast: challengeIsPast(challenge) };
  },
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

const challengeIsPast = challenge => {
  const today = moment().endOf('day');
  const endDate = moment(challenge.end_date).endOf('day');
  // Check if the end date is AFTER today (in the future)
  return endDate.diff(today, 'days') < 0;
};
