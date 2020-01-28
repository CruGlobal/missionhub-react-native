// import { GoogleAnalyticsTracker, GoogleAnalyticsSettings } from 'react-native-google-analytics-bridge';
// import CONSTANTS from '../constants';

// let tracker = null;

// function setup() {
//   // The tracker must be constructed, and you can have multiple:
//   tracker = new GoogleAnalyticsTracker(CONSTANTS.GA_TRACKER);

//   // Setting dryRun to true lets you test tracking without sending data to GA
//   if (__DEV__) {
//     GoogleAnalyticsSettings.setDryRun(true);
//   }

//   // The GoogleAnalyticsSettings is static, and settings are applied across all trackers:
//   GoogleAnalyticsSettings.setDispatchInterval(30);
// }

// function screen(screen) {
//   if (!screen || typeof screen !== 'string') {
//     LOG('Screen must be passed in as a string');
//     return;
//   }
//   tracker.trackScreenView(screen);
// }

// function event(category, action, label = '', value = -1) {

//   // Setup the optional values as an object of {label: String, value: Number}
//   let optionalValues = {};
//   if (typeof label !== 'string') {
//     label = '';
//   }
//   if (typeof value !== 'number') {
//     value = -1;
//   }
//   if (label) {
//     optionalValues.label = label;
//   }
//   if (value >= 0) {
//     optionalValues.value = value;
//   }

//   if (!category || typeof category !== 'string') {
//     LOG('Category must be passed in as a string');
//     return;
//   }
//   if (!action || typeof action !== 'string') {
//     LOG('Action must be passed in as a string');
//     return;
//   }
//   tracker.trackEvent(category, action, optionalValues);
// }

// function setUser(id = '') {
//   if (!id || typeof id !== 'string') {
//     LOG('Analytics: id must be a string in setUser', id);
//     return;
//   }
//   tracker.setUser(id);
// }

// export default {
//   setup,
//   event,
//   screen,
//   setUser,
// };
