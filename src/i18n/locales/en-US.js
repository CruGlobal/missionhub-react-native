/* eslint max-lines: 0 */

export default {
  common: {
    profileLabels: {
      firstName: 'First Name',
      firstNameRequired: '$t(profileLabels.firstName) (Required)',
      firstNameNickname: '$t(profileLabels.firstName) or Nickname',
      lastName: 'Last Name',
      lastNameOptional: '$t(profileLabels.lastName) (optional)',
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
      tomorrow: 'Tomorrow',
      everyDay: 'Every day',
      every: 'Every',
      onceAMonth: 'Once a month on the',
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
    ignore: 'Ignore',
    report: 'Report',
    cancel: 'Cancel',
    continue: 'Continue',
    your: 'your',
    you: 'You',
    by: 'by',
    view: 'View',
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
  mainTabs: {
    takeAStepWithSomeone: 'Take a Step With Someone',
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
  goBackAlert: {
    title: 'Go back?',
    description: 'You will lose any info you have entered and be logged out',
    action: 'Go Back',
  },
  settingsMenu: {
    about: 'About',
    help: 'Help',
    review: 'Write a Review',
    shareStory: 'Share a Story With Us',
    signOut: 'Sign out',
    cannotOpenUrl: 'Cannot open URL',
    pleaseVisit: 'Sorry, we could not open that URL. Please visit {{url}}',
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
    facebookLogin: 'Sign In With Facebook',
  },
  mfaLogin: {
    mfaHeader: 'two-step verification',
    mfaDescription: 'Enter verification code from your authenticator app.',
    mfaLabel: 'Verification Code',
    mfaIncorrect: 'Incorrect verification code',
  },
  welcome: {
    getStarted: "Let's Get Started",
    getStartedButton: 'Get Started',
    welcome: 'welcome!',
    welcomeDescription:
      'Growing closer to God involves helping others experience Him. MissionHub joins you in that journey by suggesting steps of faith to take with others.',
  },
  onboardingCreatePerson: {
    firstThing: '-first things first-',
    namePrompt: 'what is your name?',
    addPerson: 'Who would you like to take steps of faith with this week?',
    errorSavingPerson: 'Error saving your person. Please try again.',
  },
  categories: {
    onboardingPrompt:
      'Think of someone you want to help grow closer to God. Who are they?',
    addPersonPrompt: 'How do you know each other?',
    family: 'Family',
    friend: 'Friend',
    neighbor: 'Neighbor',
    coworker: 'Coworker',
    other: 'Other',
  },
  addContact: {
    addSomeone: 'ADD SOMEONE',
    editPerson: 'Edit Person',
    addToOrg: 'ADD SOMEONE to {{orgName}}',
    categoryPrompt: 'How do you know each other?',
    stage: 'Stage',
    categories: {
      family: 'Family',
      friend: 'Friend',
      neighbor: 'Neighbor',
      coworker: 'Coworker',
      other: 'Other',
    },
    categoryNull: 'Choose a category',
    message:
      'Growing closer to God involves helping others experience Him.\n\nTake a moment and pray. Who do you want to take steps of faith with?',
    alertBlankEmail: 'Email is blank',
    alertPermissionsMustHaveEmail:
      'Contact with User or Admin permissions must have email address and first name',
    alertSorry: 'Sorry',
    alertCannotEditFirstName:
      'You are not allowed to edit first names of other MissionHub users',
    prompt: 'Who would you like to take steps of faith with this week?',
    createError: 'Error creating your person. Please try again.',
    updateError: 'Error updating your person. Please try again.',
    loadingError: 'Error loading your person. Please try again.',
  },
  addStep: {
    header: 'Create your own step',
    journeyHeader: 'What did you see God do?',
    editJourneyHeader: 'Edit your comment',
    addJourneyPerson: 'Add to Our Journey',
    addJourneyMe: 'Add to my Journey',
    editJourneyButton: 'Save',
    makeShorter:
      'Thanks for creating a step! But we need you to make it a little shorter so it can fit.',
    errorSavingStep: 'Error saving step',
  },
  stepReminder: {
    setReminder: 'Set a Reminder',
    endDate: 'End Date',
    endDatePlaceholder: 'End Date (Required)',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
  },
  selectStep: {
    meHeader: 'Choose a step of faith to take on your journey this week...',
    personHeader: 'Choose a step to take with {{name}} this week...',
    them: 'them',
    addStep: 'ADD TO MY STEPS',
    createYourOwnStep: 'Create your own $t(stepTypes:{{type}}) Step',
    loadMoreSteps: 'SHOW MORE STEPS',
    stepsOfFaith: 'Add Steps of Faith',
    errorLoadingStepSuggestions: 'Error loading step suggestions',
  },
  selectStepExplainer: {
    part1: 'MissionHub suggests four ways to draw someone closer to God.',
    part2: 'Ideas to help you deepen this relationship and build trust.',
    part3: 'Ways to invite God into your relationship with this person.',
    part4: 'Ideas to help you demonstrate that you care about this person.',
    part5:
      'Talk about what this person believes and ways you can help them know the truth about God.',
  },
  suggestedStepDetail: {
    addStep: 'Add to My Steps',
    errorLoadingSuggestedStepDetails: 'Error loading suggested step details',
    errorSavingStep: 'Error saving step',
  },
  acceptedStepDetail: {
    removeStep: 'Remove Step',
    iDidIt: 'I Did It!',
    errorLoadingStepDetails: 'Error loading your step details',
  },
  completedStepDetail: {
    completedStep: 'Completed Step',
    completedOn: 'Completed {{date}}',
    errorLoadingStepDetails: 'Error loading your step details',
  },
  selectStage: {
    meQuestion:
      '{{name}}, which stage best describes where you are on your journey?',
    personQuestion:
      'Which stage best describes where {{name}} is on their journey?',
    completed3Steps:
      'You completed 3 steps with {{name}}. Any changes spiritually?',
    completed1Step:
      'You completed a step with {{name}}. Any changes spiritually?',
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
    stepSelfNull: 'Your Steps of Faith will appear here.',
    stepNull: 'Your Steps of Faith with {{name}} appear here.',
    showCompletedSteps: 'SHOW COMPLETED STEPS',
    hideCompletedSteps: 'HIDE COMPLETED STEPS',
    addStep: 'Add a step of faith',
    errorLoadingStepsForThisPerson: 'Error loading steps for this person',
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
      "{{beginningScope}}{{numInitiators}}{{initiator}} {{initiatorSuffix}} taken $t(steps, {'count': {{stepsCount}} }) of faith with $t(people, {'count': {{receiversCount}} }){{endingScope}}.",
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
    togetherWe: 'together we',
    users: 'users',
    allOfUs: 'all of us',
    haveSuffix: 'have',
    hasSuffix: 'has',
    inYear: 'in {{year}}',
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
    commentBoxPlaceholder: 'Share something to be remembered...',
  },
  celebrateCommentBox: {
    placeholder: 'Write a comment...',
  },
  notes: {
    header: 'MY NOTES',
    add: 'ADD PRIVATE NOTES',
    edit: 'EDIT PRIVATE NOTES',
    prompt:
      'Remember important details about {{personFirstName}}, like favorite food, hobbies they love or something interesting they said.',
    promptMe:
      'Remember important details about your life or spiritual journey, like important milestones, influential people, or things you are learning about God.',
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
    includeUsers: 'Include Users and Admins',
  },
  searchFilterRefine: {
    title: 'Refine',
    any: 'Any',
  },
  notificationPrimer: {
    onboarding:
      'MissionHub will send you reminders to help you take your steps.',
    stepsNotification: {
      part1: 'Allow notifications for',
      part2: 'reminders on steps of faith',
    },
    login:
      "We noticed you have accepted some steps. We'd like to send you handcrafted reminders so they don't get forgotten.",
    setReminder:
      'We want to help you take this Step of Faith! In order to set a reminder we need to be able to send you notifications.',
    joinCommunity:
      'MissionHub would like to notify you about activity happening within your community.',
    joinChallenge:
      'We are excited that you are participating in a challenge! MissionHub would like to send you updates about this challenge.',
    allow: 'Allow Notifications',
    notNow: 'Not Now',
  },
  notificationOff: {
    title: 'Notifications are off',
    defaultDescription:
      'To receive reminders to take steps of faith, please turn notifications on.',
    joinCommunity:
      'To receive updates from your MissionHub community, please turn notifications on.',
    joinChallenge:
      'To receive updates about community challenges, please turn notifications on.',
    settings: 'Go To Settings',
    notNow: 'Not Now',
    noReminders: "I Don't Want Reminders",
  },
  stepsTab: {
    nullHeader: 'STEPS OF FAITH',
    nullNoReminders: {
      part1: "You don't have any Steps of Faith.",
      part2: 'Choose a person and add some new steps.',
    },
    title: 'Steps of Faith',
    errorLoadingSteps: 'Error loading your steps',
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
    addStage: 'Add Stage',
    errorLoadingStepCounts: 'Error loading step counts for your people',
  },
  appRoutes: {
    steps: 'Steps',
    people: 'People',
    impact: 'Impact',
    group: 'Communities',
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
    globalCommunity: 'MissionHub Community',
    errorLoadingCommunities: 'Error loading communities',
  },
  createPostScreen: {
    choosePostType: 'Choose a Post Type',
    shareStory: 'Share Story',
    inputPlaceholder: 'Post to community...',
    prayerRequest: 'Ask for Prayer',
    spiritualQuestion: 'Ask a Spiritual Question',
    godStory: 'Share a God Story',
    careRequest: 'Ask for Help',
    announcement: 'Make an Announcement',
    everyone: 'Everyone',
    ownersAndAdmins: 'Owners and Admins',
  },
  shareAStoryScreen: {
    shareStory: 'Share Story',
    inputPlaceholder: 'Share a Story...',
  },
  editStoryScreen: {
    saveStory: 'Save Changes',
    inputPlaceholder: 'Share a Story...',
  },
  celebrateFeed: {
    errorLoadingCelebrateFeed: 'Error loading celebrate feed',
  },
  celebrateFeeds: {
    title: '',
    emptyFeedTitle: 'Celebrate!',
    emptyFeedDescription:
      'You can celebrate {{firstName}} Steps of Faith here.',
    emptyFeedGroupNameValue: 'each other',
    stepOfFaith:
      '{{initiator}} completed a Step of Faith with a {{receiverStage}} person.',
    stepOfFaithUnknownStage:
      '{{initiator}} completed a Step of Faith with someone.',
    stepOfFaithNotSureStage: '{{initiator}} completed a Step of Faith.',
    interaction: '{{initiator}} had a {{interactionName}}.',
    interactionDecision: '{{initiator}} saw someone make a Personal Decision.',
    addedContact: '{{initiator}} added a {{receiverStage}} person.',
    somethingCoolHappened:
      '{{initiator}} saw something cool happen with someone.',
    challengeAccepted: '{{initiator}} accepted a Challenge:',
    challengeCompleted: '{{initiator}} completed a Challenge:',
    communityCreated: '{{initiator}} created {{communityName}}!',
    joinedCommunity:
      '{{initiator}} joined {{communityName}}! Now you can see and celebrate the steps of faith they are taking.',
    missionHubUser: 'MissionHub user',
    aMissionHubUser: 'A MissionHub user',
  },
  celebrateItems: {
    edit: {
      buttonText: 'Edit Post',
    },
    delete: {
      buttonText: 'Delete Post',
      title: 'Delete Post?',
      message:
        "This post will be deleted and you won't be able to find it anymore.",
    },
    report: {
      buttonText: 'Report to Owner',
      title: 'Report to Owner?',
      message:
        'Are you sure you want to report this comment to the community owner?',
      confirmButtonText: 'Report Post',
    },
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
    endDate: 'Challenge Ends',
    details: 'Details',
    detailsPlaceholder: 'Add details to your Challenge (optional)',
    nullTitle: 'Our Challenges',
    nullMembers: 'Join each other in a challenge created for your community.',
    nullAdmins: 'Create a community challenge everyone can join.',
  },
  challengeStats: {
    days: 'Days',
    daysLeft: 'Days Left',
    joined: 'Joined',
    completed: 'Completed',
  },
  addChallenge: {
    titlePlaceholderEdit: 'Edit Challenge',
    titlePlaceholderAdd: 'New Challenge',
    add: 'Create Challenge',
    save: 'Save',
    datePlaceholder: 'End Date (Required)',
    dateLabel: 'Challenge Ends',
    detailsLabel: 'Details',
    detailPlaceholder: 'Add details to your Challenge (optional)',
  },
  challengeMembers: {
    joined: '{{count}} Member Joined',
    joined_plural: '{{count}} Members Joined',
  },
  groupsChallenge: {
    create: 'Create Challenge',
  },
  groupOnboardingCard: {
    celebrateHeader: 'Celebrate One Another',
    celebrateDescription: "See and celebrate one another's Steps of Faith.",
    challengesHeader: 'Our Challenges',
    challengesAdminDescription:
      'Create a community challenge everyone can join.',
    challengesMemberDescription:
      'Join each other in a challenge created for your community.',
    membersHeader: 'Journey Together',
    membersDescription: 'Take a Step of Faith with someone in your community.',
    impactHeader: 'See God at Work',
    impactDescription:
      'See what God is doing as you take Steps of Faith together. ',
    contactsHeader: 'Journey Together',
    contactsDescription: 'Stay engaged with contacts in your community.',
    surveysHeader: 'Grow Together',
    surveysDescription: 'Learn about one another through survey responses.',
    stepsHeader: 'Steps of Faith',
    stepsDescription: 'Choose a person in People view to add a new step',
  },
  groupsMembers: {
    invite: 'Send Invite',
    sendInviteMessage:
      'Join me on MissionHub. Our community code is {{code}}. Click here to join: {{url}}',
    invited:
      "Anyone you've invited to {{orgName}} will show up here when they join.",
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
    tryItNowAdminOwnerErrorMessage:
      'This Member has not yet created an account. ' +
      'Once they sign up, you can try this again.',
  },
  groupsImpact: {
    title: '',
  },
  groupsContacts: {
    title: '',
    searchPlaceholder: 'Search Contacts',
    movingToWeb: 'We are moving Contacts to the web!',
    findThemHere: 'Find them here',
  },
  memberContacts: {
    nullDescription: 'Anyone assigned to {{memberName}} will appear here.',
  },
  groupsSurveys: {
    title: '',
    movingToWeb: 'We are moving Surveys to the web!',
    findThemHere: 'Find them here',
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
    communityNotFoundLink:
      "Sorry, we couldn't find your community.\nDouble check your link.",
    findingCommunity: 'Finding your new community...',
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
    continue:
      'Great job {{userName}}!\nWould you like to continue journeying with {{statusName}}?',
    totally: 'Totally',
    nope: 'No Thanks',
  },
  statusReason: {
    done: 'Done',
    placeholder: 'Admin note',
    important: 'Anything important the admins at {{organization}} should know?',
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
    okTitle: "I'm sure",
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
    codeCopyText:
      'Take steps of faith with me in the MissionHub app. Use this community code to join: {{code}}',
  },
  landing: {
    getStarted: 'Get Started',
    haveCode: 'I have a Community Code',
    member: 'Already a Member?',
  },
  commentsList: {
    editPost: 'Edit Comment',
    deletePost: 'Delete Comment',
    reportPost: 'Report Comment',
    reportToOwner: 'Report to Owner',
    reportToOwnerHeader: 'Report to Owner?',
    reportAreYouSure:
      'Are you sure you want to report this comment to the community owner?',
    deletePostHeader: 'Delete Post?',
    deleteAreYouSure:
      'This post will be deleted and you won’t be able to find it anymore.',
  },
  celebrateFeedHeader: {
    reports: '{{count}} New Reported Item',
    reports_plural: '{{count}} New Reported Items',
    newComments: 'New Comment',
    newComments_plural: 'New Comments',
  },
  groupUnread: {
    title: '{{count}} New Comment',
    title_plural: '{{count}} New Comments',
    header: 'No Unread Comments',
    reportNull: 'No Unread comments.',
    clearAll: 'Clear All',
  },
  groupsReport: {
    title: 'Reported Items',
    header: 'No Reported Items',
    reportNull: 'No items have been reported.',
  },
  reportComment: {
    reportedBy: 'Reported By',
    commentBy: 'Comment By',
    storyBy: 'Story By',
    deleteTitle:
      'Deleting this comment removes it completely and it will no longer be found.',
  },
  errorNotice: {
    offline: 'Offline',
  },
  postTypes: {
    godStory: 'God Story',
    prayerRequest: 'Prayer Request',
    spiritualQuestion: 'Spiritual Question',
    careRequest: 'Care Request',
    onYourMind: "What's on Your Mind",
    challenge: 'Challenge',
    announcement: 'Announcement',
    stepOfFaith: 'Step of Faith',
    header: {
      godStory: 'Read a God Story',
      prayerRequest: 'Answer a Prayer Request',
      spiritualQuestion: 'Answer a Question',
      careRequest: 'Provide Help',
      announcement: 'Announcements',
      stepOfFaith: 'Celebrate Others',
    },
  },
  stepTypes: {
    relate: 'Relate',
    pray: 'Pray',
    care: 'Care',
    share: 'Share',
    stepOfFaith: 'Step of Faith',
    step: 'Step',
  },
};
