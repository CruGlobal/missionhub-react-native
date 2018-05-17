import {
  SWIPE_REMINDER_STEPS_HOME,
  SWIPE_REMINDER_STEPS_CONTACT,
  SWIPE_REMINDER_STEPS_REMINDER,
  SWIPE_REMINDER_JOURNEY,
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
