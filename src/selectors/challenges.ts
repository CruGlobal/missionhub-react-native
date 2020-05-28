import { createSelector } from 'reselect';
import moment from 'moment';
import i18n from 'i18next';

import { organizationSelector } from './organizations';

export const challengesSelector = createSelector(
  ({ challengeItems }) => challengeItems,
  challengeItems => {
    const { currentItems, pastItems } = challengeItems.reduce(
      // @ts-ignore
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
      ...(currentItems.length > 0
        ? [
            {
              title: '',
              data: currentItems,
            },
          ]
        : []),
      ...(pastItems.length > 0
        ? [
            {
              title: i18n.t('challengeFeeds:past'),
              data: pastItems,
            },
          ]
        : []),
    ];
  },
);

export const communityChallengeSelector = createSelector(
  // @ts-ignore
  ({ organizations }, { orgId }) =>
    organizationSelector({ organizations }, { orgId }),
  // @ts-ignore
  (_, { challengeId }) => challengeId,
  (org, challengeId) => {
    const challenge = (org.challengeItems || []).find(
      // @ts-ignore
      c => c.id === challengeId,
    );
    return (
      (challenge && { ...challenge, isPast: challengeIsPast(challenge) }) || {}
    );
  },
);

export const acceptedChallengesSelector = createSelector(
  ({ acceptedChallenges }) => acceptedChallenges,
  acceptedChallenges => {
    const sortedAcceptances = acceptedChallenges.reduce(
      // @ts-ignore
      ({ joined, completed }, item) => {
        const isPlaceHolder = item.person._placeHolder;
        const isCompleted = item.completed_at;

        return {
          joined: [...joined, ...(!isPlaceHolder ? [item] : [])],
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

// @ts-ignore
const challengeIsPast = challenge => {
  const today = moment().endOf('day');
  const endDate = moment(challenge.end_date).endOf('day');
  // Check if the end date is AFTER today (in the future)
  return endDate.diff(today, 'days') < 0;
};
