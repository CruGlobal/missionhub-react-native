import {
  SWIPE_REMINDER_JOURNEY,
  GROUP_INVITE_INFO,
  GROUP_ONBOARDING_CARD,
  GROUP_TAB_SCROLL_ON_MOUNT,
} from '../constants';

export function removeSwipeJourney() {
  return { type: SWIPE_REMINDER_JOURNEY };
}
// @ts-ignore
export function removeGroupOnboardingCard(target) {
  return { type: GROUP_ONBOARDING_CARD, target, value: false };
}
export function removeGroupInviteInfo() {
  return { type: GROUP_INVITE_INFO };
}
// @ts-ignore
export function setScrollGroups(orgId) {
  return { type: GROUP_TAB_SCROLL_ON_MOUNT, value: orgId };
}
export function resetScrollGroups() {
  return { type: GROUP_TAB_SCROLL_ON_MOUNT, value: null };
}
