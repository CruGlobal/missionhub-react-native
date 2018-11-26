import {
  SWIPE_REMINDER_STEPS_HOME,
  SWIPE_REMINDER_STEPS_CONTACT,
  SWIPE_REMINDER_STEPS_REMINDER,
  SWIPE_REMINDER_JOURNEY,
  GROUP_INVITE_INFO,
  GROUP_ONBOARDING_CARD,
} from '../constants';

export function removeSwipeStepsHome() {
  return { type: SWIPE_REMINDER_STEPS_HOME };
}
export function removeSwipeStepsContact() {
  return { type: SWIPE_REMINDER_STEPS_CONTACT };
}
export function removeSwipeStepsReminder() {
  return { type: SWIPE_REMINDER_STEPS_REMINDER };
}
export function removeSwipeJourney() {
  return { type: SWIPE_REMINDER_JOURNEY };
}
export function removeGroupOnboardingCard(target) {
  return { type: GROUP_ONBOARDING_CARD, target, value: false };
}
export function removeGroupInviteInfo() {
  return { type: GROUP_INVITE_INFO };
}
