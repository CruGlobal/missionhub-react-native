export default {
  common: {
    profileLabels: {
      firstName: 'First Name',
      firstNameRequired: '$t(profileLabels.firstName) (Required)',
      firstNameNickname: '$t(profileLabels.firstName) or Nickname',
      lastName: 'Last Name',
      lastNameOptional: '$t(profileLabels.lastName) (if you want)',
      email: 'Email',
      emailRequired: '$t(profileLabels.email) (Required)',
      phone: 'Phone',
      call: 'Call',
      message: 'Message',
      stage: 'Stage',
      status: 'Status',
      gender: 'Gender',
      permissions: 'Permissions',
      contact: 'Contact',
      member: 'Member',
      user: 'User',
      admin: 'Admin',
      owner: 'Owner',
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
        followup:
          "We're glad you're still here, {{name}}. We hope the following steps will help you on your spiritual journey.",
      },
      curious: {
        label: 'Curious',
        description:
          'Open to spiritual conversations or seeking to know who Jesus is.',
        followup:
          "{{name}}, we're glad to be part of your journey. We hope the following steps will help you know more about Jesus.",
      },
      forgiven: {
        label: 'Forgiven',
        description:
          'Believes in Jesus as Savior, but not growing spiritually.',
        followup:
          "We're so glad you're here, {{name}}. We'd like to offer some steps to help you grow spiritually.",
      },
      growing: {
        label: 'Growing',
        description: 'Learning to follow Jesus as a way of life.',
        followup:
          "We're so excited you're following Jesus, {{name}}! We'd like to offer some steps to help you grow closer to God and help others experience Him.",
      },
      guiding: {
        label: 'Guiding',
        description: 'Committed to helping others know and follow Jesus.',
        followup:
          'Awesome! We hope MissionHub helps you serve those God has placed in your life.',
      },
    },
    dates: {
      today: 'Today',
      yesterday: 'Yesterday',
    },
    steps: {},
    yes: 'Yes',
    no: 'No',
    copy: 'Copy',
    edit: 'Edit',
    done: 'Done',
    next: 'Next',
    skip: 'Skip',
    ok: 'Ok',
    logout: 'Logout',
    me: 'Me',
    loading: 'Loading',
    save: 'Save',
    delete: 'Delete',
    cancel: 'Cancel',
    continue: 'Continue',
    your: 'your',
    contactAssignment:
      '{{assignedContactName}} was assigned to {{assignedToName}}{{assignedByName}}',
    contactUnassignment:
      '{{assignedContactName}} was unassigned from {{assignedToName}}',
    assignToMe: 'Assign to me',
    copyMessage: 'Copied',
    terms: 'By creating your MissionHub account you agree to our',
    termsTrial: 'By creating your MissionHub trial account you agree to our',
    tos: 'Terms of Service',
    privacy: 'Privacy Policy',
    and: 'and',
    signIn: 'Sign In',
  },
  error: {
    error: 'Error',
    unexpectedErrorMessage: 'There was an unexpected error.',
    baseErrorMessage:
      'Please email support@missionhub.com if the issue persists.',
    ADD_NEW_PERSON: 'There was an error adding a new person.',
  },
  offline: {
    youreOffline: "You're currently offline",
    connectToInternet:
      'Connect to the internet and you can continue to use MissionHub.',
  },
  forcedLogout: {
    message:
      "It's been a while since you've signed in.\nPlease sign in so we know it's you.",
  },
  settingsMenu: {
    about: 'About',
    help: 'Help',
    review: 'Write a Review',
    signOut: 'Sign out',
    signUp: 'Sign Up',
  },
  login: {
    tagline1: 'Grow closer to God.',
    tagline2: 'Help others experience Him.',
    getStarted: 'Get Started',
    member: 'Already a Member?',
  },
  loginOptions: {
    facebookSignup: 'Sign up with Facebook',
    haveCode: 'I Have a Community Code',
    signUpLater: 'Sign up Later',
    emailSignUp: 'Sign up with Email',
    member: 'Already a Member?',
    createCommunityTitle: 'Create a Community',
    createCommunityDescription: 'Sign Up to create a MissionHub community.',
  },
  keyLogin: {
    invalidCredentialsMessage: 'Your Email or Password is Incorrect',
    verifyEmailMessage: 'Verify your account via Email',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    forgotPassword: 'Forgot Password?',
    login: 'LOGIN',
    errorDefault: 'There was a problem signing in.',
    errorIncorrect: 'Your Email or Password is Incorrect',
    errorVerify: 'Verify your account via Email',
    facebookLogin: 'Log In With Facebook',
  },
  mfaLogin: {
    mfaHeader: 'two-step verification',
    mfaDescription: 'Enter verification code from your authenticator app.',
    mfaLabel: 'Verification Code',
    mfaIncorrect: 'Incorrect verification code',
  },
  welcome: {
    getStarted: `Let's Get Started`,
    tryItNow: 'Try It Now',
    welcome: 'welcome!',
    welcomeDescription:
      'Growing closer to God involves helping others experience Him. MissionHub joins you in that journey by suggesting steps of faith to take with others.',
  },
  setup: {
    firstThing: '-first things first-',
    namePrompt: 'what is your name?',
  },
  addContact: {
    addSomeone: 'ADD SOMEONE',
    editPerson: 'Edit Person',
    addToOrg: 'ADD SOMEONE to {{orgName}}',
    message:
      'Growing closer to God involves helping others experience Him.\n\nTake a moment and pray. Who do you want to take steps of faith with?',
    alertBlankEmail: 'Email is blank',
    alertPermissionsMustHaveEmail:
      'Contact with User or Admin permissions must have email address and first name',
    alertSorry: 'Sorry',
    alertCannotEditFirstName:
      'You are not allowed to edit first names of other MissionHub users',
  },
  addStep: {
    header: 'My Step of Faith',
    createStep: 'Create Step',
    journeyHeader: 'What did you see God do?',
    editJourneyHeader: 'Edit your comment',
    addJourney: 'Add to Our Journey',
    editJourneyButton: 'Save',
    makeShorter:
      'Thanks for creating a step! But we need you to make it a little shorter so it can fit.',
  },
  selectStep: {
    meHeader: 'How do you want to move forward on your spiritual journey?',
    personHeader: 'What will you do to help {{name}} experience God?',
    addStep: 'ADD TO MY STEPS',
    createStep: 'Create your own step...',
    loadMoreSteps: 'SHOW MORE STEPS',
    stepsOfFaith: 'Add Steps of Faith',
  },
  selectStage: {
    meQuestion:
      '{{name}}, which stage best describes where you are on your journey?',
    personQuestion:
      'Which stage best describes where {{name}} is on their journey?',
    completed3Steps:
      'You completed 3 steps with {{name}}. Any changes spiritually?',
    completed3StepsMe:
      'You completed 3 of your steps. Any changes spiritually?',
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
    somethingCool: 'Something Cool Happened',
    ourJourney: 'Our Journey',
    journeyNull:
      'This is where MissionHub saves all of your completed steps and any notes you added along the way.',
  },
  journeyItem: {
    stepTitle: 'Completed{{stageName}}Step of Faith',
    stageTitle: '{{oldStage}} to {{newStage}}',
    stageText: '{{personName}} changed from {{oldStage}} to {{newStage}}',
    stageTextSelf: 'You changed from {{oldStage}} to {{newStage}}',
    stageStart: 'You added {{personName}} to MissionHub as {{newStage}}',
    stageStartSelf: 'You added yourself to MissionHub as {{newStage}}',
    interactionNote: 'Comment',
    interactionSomethingCoolHappened: '$t(contactJourney:somethingCool)',
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
    tagline:
      "While everyone's spiritual journey is unique, many people progress through a five stage journey toward God.\n\nLet's figure out where you are on your journey.",
    getStarted: "Let's get started",
  },
  history: {
    header: 'History',
  },
  impact: {
    header: 'Impact',
    stepsSentence:
      "In {{year}}, {{numInitiators}} {{initiator}} {{initiatorSuffix}} taken $t(steps, {'count': {{stepsCount}} }) of faith with $t(people, {'count': {{receiversCount}} }){{scope}}.",
    stepsSentence_empty:
      'Here you will see all the steps {{initiator}} {{initiatorSuffix}} taken.',
    stepsSentence_emptyGlobal:
      'You will see the steps other users have taken here shortly.',
    stageSentence:
      "$t(people, {'count': {{pathwayMovedCount}} }) reached a new stage on their spiritual journey.",
    stageSentence_empty: 'See what God has done through {{initiator}} below.',
    stageSentence_emptyGlobal:
      'You will see how others have moved on their spiritual journey here shortly.',
    steps: '{{count}} step',
    steps_plural: '{{count}} steps',
    people: '{{count}} person',
    people_plural: '{{count}} people',
    you: 'you',
    we: 'we',
    users: 'users',
    allOfUs: 'all of us',
    haveSuffix: 'have',
    hasSuffix: 'has',
    inTheirLife: ' in their life',
    atOrgName: ' at {{orgName}}',
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
    prompt:
      'Remember important details about {{personFirstName}}, like favorite food, hobbies they love or something interesting they said.',
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
    titleSurvey: 'Filter Survey',
    titleQuestions: 'Questions',
    titleAnswers: 'Answers',
    ministry: 'Ministry',
    label: 'Label',
    groups: 'Groups',
    surveys: 'Survey',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    time: 'Time Period',
    time7: 'Last 7 days',
    time30: 'Last 30 days',
    time60: 'Last 60 days',
    time90: 'Last 90 days',
    time180: 'Last 6 Months',
    time270: 'Last 9 Months',
    time365: 'Last 12 Months',
    surveyQuestions: 'Questions/Answers',
    uncontacted: 'Uncontacted',
    unassigned: 'Unassigned',
    archived: 'Include Archived Contacts',
    multiple: 'Multiple',
  },
  searchFilterRefine: {
    title: 'Refine',
    any: 'Any',
  },
  notificationPrimer: {
    onboardingDescription:
      'MissionHub will send you reminders to help you take your steps.',
    focusDescription:
      "We're excited you've focused a step! We'd like to send you handcrafted reminders so it doesn't get forgotten.",
    loginDescription:
      "We noticed you have accepted some steps. We'd like to send you handcrafted reminders so they don't get forgotten.",
    allow: 'Allow Notifications',
    notNow: 'Not Now',
  },
  notificationOff: {
    title: 'Notifications are off',
    description:
      'To receive reminders to take steps of faith, please turn notifications on.',
    allow: 'Allow Notifications',
    settings: 'Go To Settings',
    noReminders: "I Don't Want Reminders",
  },
  stepsTab: {
    nullHeader: 'STEPS OF FAITH',
    nullWithReminders: 'Choose a person in People view and add some new steps.',
    nullNoReminders:
      "You don't have any steps of faith.\nChoose a person in People view and add some new steps.",
    title: 'Steps of Faith',
    reminderTitle: 'Focus your week',
    reminderDescription:
      'Star up to three steps and get weekly handcrafted reminders.',
    holdDescription:
      'Do a long press (hold down) on a step to add up to 3 of them here and get handcrafted reminders.',
    reminderAddedToast: '✔ Reminder Added',
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
    assign: 'Assign',
    unassign: 'Unassign',
  },
  assignAlert: {
    question: 'Would you like to assign this person to yourself?',
    sentence: 'Selecting a stage will also assign this person to you.',
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
    groups: 'Communities',
  },
  groupTabs: {
    celebrate: 'Celebrate',
    challenges: 'Challenges',
    members: 'Members',
    impact: 'Impact',
    contacts: 'Contacts',
    surveys: 'Surveys',
  },
  personTabs: {
    celebrate: 'Celebrate',
    steps: 'My Steps',
    notes: 'My Notes',
    ourJourney: 'Our Journey',
    myJourney: 'My Journey',
    impact: 'Impact',
    myImpact: 'My Impact',
    assignedContacts: 'Contacts',
  },
  onboarding: {
    screen1: {
      name: 'Focus on the people in your life',
    },
    screen2: {
      name: 'Take steps to help them experience God',
    },
    screen3: {
      name: "See God work and know you're part of it",
    },
  },
  welcomeNotification: {
    title: 'Great job focusing a step!',
    message:
      "We'll send you notifications like this on Wednesdays and Sundays to help you keep these important steps in focus.",
  },
  groupsList: {
    header: 'Communities',
    groupsNull: 'Your communities will show up here.',
    joinCommunity: 'Join a Community',
    createCommunity: 'Create a Community',
  },
  celebrateFeeds: {
    title: '',
    placeholder: 'Share something to be celebrated...',
    emptyFeedTitle: 'Celebrate!',
    emptyFeedDescription:
      'You can celebrate {{firstName}} Steps of Faith here.',
    emptyFeedGroupNameValue: 'each other',
    stepOfFaith:
      '{{initiator}} completed a Step of Faith with a {{receiverStage}} person.',
    stepOfFaithUnknownStage:
      '{{initiator}} completed a Step of Faith with someone.',
    interaction: '{{initiator}} had a {{interactionName}}.',
    interactionDecision: '{{initiator}} saw someone make a Personal Decision.',
    addedContact: '{{initiator}} added a {{receiverStage}} person.',
    somethingCoolHappened:
      '{{initiator}} saw something cool happen with someone.',
    challengeAccepted: '{{initiator}} accepted a Challenge:',
    challengeCompleted: '{{initiator}} completed a Challenge:',
    communityCreated: '{{initiator}} created {{communityName}}!',
  },
  challengeFeeds: {
    past: 'Past Challenges',
    emptyFeedTitle: 'Challenges',
    emptyFeedDescription: 'You can view, accept, and complete challenges here.',
    edit: 'Edit',
    join: 'Join',
    complete: 'Complete',
    joined: 'Joined',
    completed: 'Completed',
    iDidIt: 'I Did It',
    endDate: 'End Date',
  },
  challengeStats: {
    days: 'Days',
    daysLeft: 'Days Left',
    joined: 'Joined',
    completed: 'Completed',
  },
  addChallenge: {
    editHeader: 'Edit Challenge',
    addHeader: 'New Challenge',
    add: 'Create Challenge',
    save: 'Save Changes',
    titlePlaceholder: 'Name Your Challenge',
    titleLabel: 'Challenge',
    datePlaceholder: 'End Date (Required)',
    dateLabel: 'End Date',
  },
  groupsChallenge: {
    create: 'Create Challenge',
  },
  groupOnboardingCard: {
    celebrateHeader: 'Celebrate One Another',
    celebrateDescription: `See and celebrate one another's Steps of Faith.`,
    challengesHeader: 'Challenge One Another',
    challengesDescription: `Create a community challenge everyone can join.`,
    membersHeader: 'Journey Together',
    membersDescription: `Take a Step of Faith with someone in your community.`,
    impactHeader: 'See God at Work',
    impactDescription: `See what God is doing as you take Steps of Faith together. `,
    contactsHeader: 'Journey Together',
    contactsDescription: `Stay engaged with contacts in your community.`,
    surveysHeader: 'Grow Together',
    surveysDescription: `Learn about one another through survey responses.`,
  },
  groupsMembers: {
    invite: 'Send Invite',
    sendInviteMessage: 'Join me on MissionHub. Click here to join: {{url}}',
    invited: `Anyone you've invited to {{orgName}} will show up here when they join.`,
  },
  groupMemberOptions: {
    ownerLeaveCommunityErrorMessage:
      'You must assign a new owner to {{orgName}} before you go',
    leaveCommunity: {
      optionTitle: 'Leave Community',
      modalTitle: 'Are you sure you want to leave {{communityName}}?',
      confirmButtonText: 'OK',
    },
    makeAdmin: {
      optionTitle: 'Make Admin',
      modalTitle: 'Want to make {{personName}} an admin?',
      modalDescription:
        'Admins can remove members, promote members to admins, and create challenges.',
      confirmButtonText: 'Yes',
    },
    removeAdmin: {
      optionTitle: 'Remove as Admin',
      modalTitle: 'Remove {{personName}} as admin?',
      confirmButtonText: 'Remove',
    },
    makeOwner: {
      optionTitle: 'Make Owner',
      modalTitle: 'Make {{personName}} the owner?',
      modalDescription:
        'You will lose ownership of this community but would still have admin privileges',
      confirmButtonText: 'Yes',
    },
    removeMember: {
      optionTitle: 'Remove Member',
      modalTitle: 'Remove {{personName}} from {{communityName}}?',
      confirmButtonText: 'Remove',
    },
  },
  groupsImpact: {
    title: '',
  },
  groupsContacts: {
    title: '',
    searchPlaceholder: 'Search Contacts',
  },
  memberContacts: {
    nullDescription: 'Anyone assigned to {{memberName}} will appear here.',
  },
  groupsSurveys: {
    title: '',
  },
  groupsSurveyContacts: {
    searchPlaceholder: 'Search Contacts',
  },
  datePicker: {
    date: 'Date',
  },
  groupsContactItem: {
    status: 'Status: {{status}}',
    stageChange: '{{personName}} changed from {{oldStage}} to {{newStage}}',
    stageStart: '{{personName}} has been to MissionHub as {{newStage}}',
    spiritualConversation:
      '{{initiator}} had a spiritual conversation with {{receiver}}',
    gospelPresentation: '{{initiator}} shared the gospel with {{receiver}}',
    personalDecision:
      '{{receiver}} made a personal decision with {{initiator}}',
    holySpiritConversation:
      '{{initiator}} had a Holy Spirit conversation with {{receiver}}',
    discipleshipConversation:
      '{{initiator}} had a discipleship conversation with {{receiver}}',
    somethingCoolHappened:
      '{{initiator}} saw something cool happen with {{receiver}}',
    note: '{{initiator}} added a note about {{receiver}}',
  },
  groupItem: {
    numContacts: '{{count}} Contact',
    numContacts_plural: '{{count}} Contacts',
    numAssigned: '{{count}} Assigned',
    numUnassigned: '{{count}} Unassigned',
    unassigned: 'Unassigned',
    numUncontacted: '{{count}} Uncontacted',
    numMembers: '{{count}} Member',
    numMembers_plural: '{{count}} Members',
    owner: '{{name}} (Owner)',
    join: 'Join',
    selectStage: 'Select Stage',
    privateGroup: 'Private Group',
  },
  groupsCreateGroup: {
    createCommunity: 'Create Community',
    name: 'Community Name',
  },
  groupsJoinGroup: {
    joinCommunity: 'Join a Community',
    enterCode: 'Enter your Community Code',
    search: 'Search',
    communityNotFound:
      "Sorry, we couldn't find your community.\nDouble check your code.",
  },
  shareSurveyMenu: {
    shareMessage: '{{name}} {{url}}',
    shareSurvey: 'Share Survey',
    takeSurvey: 'Take Survey',
  },
  groupsContactList: {
    nullHeader: 'Activity Feed',
    nullDescription: 'No activity to display.',
  },
  loadMore: {
    load: 'Load More',
  },
  commentBox: {
    placeholder: 'Comment',
  },
  statusSelect: {
    header: 'Status',
    cancel: 'Cancel',
    done: 'Done',
    uncontacted: 'Uncontacted',
    attempted_contact: 'Attempted Contact',
    contacted: 'Contacted',
    completed: 'Completed',
    do_not_contact: 'Do Not Contact',
  },
  statusComplete: {
    done: 'Done',
    continue: `Great job {{userName}}!\nWould you like to continue journeying with {{statusName}}?`,
    totally: 'Totally',
    nope: 'No Thanks',
  },
  statusReason: {
    done: 'Done',
    placeholder: 'Admin note',
    important: `Anything important the admins at {{organization}} should know?`,
  },
  imagePicker: {
    selectImage: 'Select Image',
    cancel: 'Cancel',
    takePhoto: 'Take Photo',
    chooseFromLibrary: 'Choose from Library...',
    deniedTitle: 'Permission Denied',
    deniedText:
      'To be able to take pictures with your camera and choose images from your library.',
    reTryTitle: 'Re-Try',
    okTitle: `I'm sure`,
    errorHeader: 'Error',
    errorBody:
      'There was an error processing your request. Please try again later.',
  },
  groupProfile: {
    created: 'Created',
    members: 'Members',
    code: 'Community Code',
    link: 'Community Link',
    newCode: 'New Code',
    newLink: 'New Link',
    info: 'Anyone who has this code or link will be able to join your group.',
    deleteCommunity: 'Delete Community?',
    createNewCode: 'Are you sure you want to create a new Community Code?',
    createNewLink: 'Are you sure you want to create a new Community Link?',
    cannotBeUndone: 'This cannot be undone',
  },
  landing: {
    tryItNow: 'Try It Now',
    haveCode: 'I have a Community Code',
    member: 'Already a Member?',
  },
};
