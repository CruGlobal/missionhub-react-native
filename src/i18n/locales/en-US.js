export default {
  common: {
    profileLabels: {
      firstName: 'First Name',
      firstNameRequired: '$t(profileLabels.firstName) (Required)',
      firstNameNickname: '$t(profileLabels.firstName) or Nickname',
      lastName: 'Last Name',
      lastNameOptional: '$t(profileLabels.lastName) (if you want)',
      email: 'Email',
      phone: 'Phone',
      gender: 'Gender',
    },
    gender: {
      male: 'Male',
      female: 'Female',
    },
    swipe: {
      remove: 'Remove',
      complete: 'Complete',
      edit: 'Edit',
    },
    followupStatus: {
      uncontacted: 'Uncontacted',
      contacted: 'Contacted',
      attempted_contact: 'Attempted Contact',
      do_not_contact: 'Do Not Contact',
      completed: 'Completed',
    },
    stages: {
      uninterested: {
        label: 'Uninterested',
        description: 'Content with beliefs and not interested in Jesus.',
        followup: 'We\'re glad you\'re still here, {{name}}. We hope the following steps will help you on your spiritual journey.',
      },
      curious: {
        label: 'Curious',
        description: 'Open to spiritual conversations or seeking to know who Jesus is.',
        followup: '{{name}}, we\'re glad to be part of your journey. We hope the following steps will help you know more about Jesus.',
      },
      forgiven: {
        label: 'Forgiven',
        description: 'Believes in Jesus as Savior, but not growing spiritually.',
        followup: 'We\'re so glad you\'re here, {{name}}. We\'d like to offer some steps to help you grow spiritually.',
      },
      growing: {
        label: 'Growing',
        description: 'Learning to follow Jesus as a way of life.',
        followup: 'We\'re so excited you\'re following Jesus, {{name}}! We\'d like to offer some steps to help you grow closer to God and help others experience Him.',
      },
      guiding: {
        label: 'Guiding',
        description: 'Committed to helping others know and follow Jesus.',
        followup: 'Awesome! We hope MissionHub helps you serve those God has placed in your life.',
      },
    },
    steps: {

    },
    done: 'DONE',
    next: 'Next',
    ok: 'Ok',
    logout: 'Logout',
    me: 'Me',
    loading: 'Loading',
    save: 'Save',
    delete: 'Delete',
    cancel: 'Cancel',
  },
  error: {
    error: 'Error',
    unexpectedErrorMessage: 'There was an unexpected error.',
    baseErrorMessage: 'Please email support@missionhub.com if the issue persists.',
    ADD_NEW_PERSON: 'There was an error adding a new person.',
  },
  settingsMenu: {
    about: 'About',
    help: 'Help',
    review: 'Write a Review',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    signOut: 'Sign out',
    signUp: 'Upgrade Account',
  },
  login: {
    tagline1: 'Grow closer to God.',
    tagline2: 'Help others experience Him.',
    signIn: 'Sign In',
    getStarted: 'Get Started',
    member: 'Already a Member?',
  },
  loginOptions: {
    facebookSignup: 'Sign up with Facebook',
    tryNow: 'Try it now',
    emailSignUp: 'Sign up with Email',
    signIn: 'Sign In',
    terms: 'By creating your MissionHub account you agree to our',
    member: 'Already a Member?',
    tos: 'Terms of Service',
    privacy: 'Privacy Policy',
    and: 'and',
  },
  keyLogin: {
    invalidCredentialsMessage: 'Your Email or Password is Incorrect',
    verifyEmailMessage: 'Verify your account via Email',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    login: 'LOGIN',
    errorDefault: 'There was a problem signing in.',
    errorIncorrect: 'Your Email or Password is Incorrect',
    errorVerify: 'Verify your account via Email',
    facebookLogin: 'Log In With Facebook',
  },
  welcome: {
    welcome: 'welcome!',
    welcomeDescription: 'Growing closer to God involves helping others experience Him. MissionHub joins you in that journey by suggesting steps of faith to take with others.',
  },
  setup: {
    firstThing: '-first things first-',
    namePrompt: 'what\'s your name?',
  },
  addContact: {
    addSomeone: 'ADD SOMEONE',
    editPerson: 'Edit Person',
    addToOrg: 'ADD SOMEONE to {{orgName}}',
    message: 'Growing closer to God involves helping others experience Him. Who do you want to take steps of faith with?',
  },
  addStep: {
    header: 'My Step of Faith',
    createStep: 'Create Step',
    skip: 'SKIP',
    journeyHeader: 'What did you see God do?',
    editJourneyHeader: 'Edit your comment',
    addJourney: 'Add to Our Journey',
    editJourneyButton: 'Save',
  },
  selectStep: {
    meHeader: 'How do you want to move forward on your spiritual journey?',
    personHeader: 'What will you do to help {{name}} experience God?',
    addStep: 'ADD TO MY STEPS',
    createStep: 'Create your own step...',
    stepsOfFaith: 'Steps of Faith',
  },
  selectStage: {
    meQuestion: '{{name}}, which stage best describes where you are on your journey?',
    personQuestion: 'Which stage best describes where {{name}} is on their journey?',
    completed3Steps: 'You completed 3 steps with {{name}}. Any changes spiritually?',
    completed3StepsMe: 'You completed 3 of your steps. Any changes spiritually?',
    iAmHere: 'I AM HERE',
    stillHere: 'STILL HERE',
    here: 'HERE',
  },
  stageSuccess: {
    backupMessage: 'We are glad you are here, <<user>>!',
    friend: 'Friend',
    chooseSteps: 'CHOOSE MY STEPS',
  },
  contactHeader: {
    mySteps: 'My Steps',
    ourJourney: 'Our Journey',
    myNotes: 'My Notes',
    myJourney: 'My Journey',
    myActions: 'My Actions',
    impact: 'Impact',
    selectStage: 'SELECT STAGE',
  },
  contactSteps: {
    header: 'STEPS OF FAITH',
    stepNull: 'Your Steps of Faith with {{name}} appear here.',
    addStep: 'Add a step of faith',
  },
  contactJourney: {
    loading: 'Loading Journey Items',
    addComment: 'Add a Comment',
    ourJourney: 'Our Journey',
    journeyNull: 'This is where MissionHub saves all of your completed steps and any notes you added along the way.',
  },
  journeyItem: {
    stepTitle: 'Growing Step of Faith',
    stageTitle: '{{oldStage}} to {{newStage}}',
    stageText: '{{name}} changed from {{oldStage}} to {{newStage}}',
    interactionNote: 'Comment',
    interactionSpiritualConversation: 'Spiritual Conversations',
    interactionGospel: 'Gospel Presentations',
    interactionDecision: 'Personal Decisions',
    interactionSpirit: 'Holy Spirit Presentations',
    interactionDiscipleshipConversation: 'Discipleship Conversations',
    interactionAssignedContacts: 'Assigned Contacts',
    interactionUncontacted: 'Uncontacted',
  },
  getStarted: {
    hi: 'hi {{name}}!',
    tagline: "While everyone's spiritual journey is unique, many people progress through a five stage journey toward God.\n\nLet's figure out where you are on your journey.",
    getStarted: "Let's get started",
  },
  history: {
    header: 'History',
  },
  impact: {
    header: 'Impact',
    impactSentence: 'In {{year}}, {{numInitiators}} {{initiator}} took {{stepsCount}} steps of faith with {{receiversCount}} people.\n\n{{pathwayMovedCount}} people reached a new stage on their spiritual journey.',
    you: 'you',
    users: 'users',
    interactionSpiritualConversation: 'Spiritual Conversations',
    interactionGospel: 'Gospel Presentations',
    interactionDecision: 'Personal Decisions',
    interactionSpirit: 'Holy Spirit Presentations',
    interactionDiscipleshipConversation: 'Discipleship Conversations',
    interactionAssignedContacts: 'Assigned Contacts',
    interactionUncontacted: 'Uncontacted',
  },
  actions: {
    interactionSpiritualConversation: 'Spiritual Conversation',
    interactionGospel: 'Gospel Presentation',
    interactionDecision: 'Personal Decision',
    interactionSpirit: 'Holy Spirit Presentation',
    interactionDiscipleshipConversation: 'Discipleship Conversation',
    interactionNote: 'Comment',
  },
  notes: {
    header: 'MY NOTES',
    add: 'ADD PRIVATE NOTES',
    edit: 'EDIT PRIVATE NOTES',
    prompt: 'Remember important details about {{personFirstName}}, like favorite food, hobbies they love or something interesting they said.',
  },
  search: {
    inputPlaceholder: 'Search',
    loading: 'Loading',
    noResults: 'No Results.',
    nullHeader: 'Search',
    nullDescription: 'Search results will appear here.',
  },
  searchFilter: {
    title: 'Filter',
    ministry: 'Ministry',
    labels: 'Labels',
    groups: 'Groups',
    surveys: 'Survey',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    unassigned: 'Unassigned',
    archived: 'Include Archived Contacts',
  },
  searchFilterRefine: {
    title: 'Refine',
    any: 'Any',
  },
  notificationPrimer: {
    description: 'MissionHub will send you reminders to help you take your steps.',
    allow: 'Allow Notifications',
    notNow: 'Not Now',
  },
  notificationOff: {
    title: 'Notifications are off',
    description: 'To receive reminders to take steps of faith, please turn notifications on.',
    allow: 'Allow Notifications',
    settings: 'Go To Settings',
    noReminders: 'I Don\'t Want Reminders',
  },
  stepsTab: {
    nullHeader: 'STEPS OF FAITH',
    nullWithReminders: 'Choose a person in People view and add some new steps.',
    nullNoReminders: 'You don\'t have any steps of faith.\nChoose a person in People view and add some new steps.',
    title: 'Steps of Faith',
    reminderTitle: 'Focus your week',
    reminderDescription: 'Star up to three steps and get weekly handcrafted reminders.',
    holdDescription: 'Do a long press (hold down) on a step to add up to 3 of them here and get handcrafted reminders.',
  },
  contactSideMenu: {
    edit: 'Edit',
    delete: 'Delete Person',
    unassignButton: 'Unassign Person',
    deleteQuestion: 'Delete {{name}}?',
    deleteSentence: 'Are you sure you want to delete this person?',
    unassignQuestion: 'Unassign {{name}}?',
    unassignSentence: 'Are you sure you want to unassign this person?',
    attemptedContact: 'Attempted Contact',
    completed: 'Completed',
    contacted: 'Contacted',
    doNotContact: 'Do Not Contact',
    uncontacted: 'Uncontacted',
    unassign: 'Unassign',
  },
  peopleScreen: {
    header: 'PEOPLE',
    personalMinistry: 'Personal Ministry',
    personal: 'personal',
  },
  appRoutes: {
    steps: 'Steps',
    people: 'People',
    impact: 'Impact',
  },
};
