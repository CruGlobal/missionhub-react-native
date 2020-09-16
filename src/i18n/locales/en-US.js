/* eslint-disable max-lines */

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
      earlier: 'Earlier',
      new: 'New',
    },
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
    refresh: 'Refresh',
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
    missionhubCommunity: 'MissionHub Community',
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
  sideMenu: {
    about: 'About',
    feedBack: 'Feedback',
    version: 'Version',
    update: 'Update',
    blog: 'MissionHub Blog',
    website: 'MissionHub Website',
    help: 'Help',
    review: 'Enjoying our app? Rate it',
    shareStory: 'Share a God Story with us',
    suggestStep: 'Suggest a Step of Faith',
    signOut: 'Sign Out',
    cannotOpenUrl: 'Cannot open URL',
    pleaseVisit: 'Sorry, we could not open that URL. Please visit {{url}}',
    signIn: 'Sign In',
    createAccount: 'Create Account',
  },
  socialAuthButtons: {
    signInWithGoogle: 'Sign in with Google',
    signUpWithGoogle: 'Sign up with Google',
    signInWithFacebook: 'Sign in with Facebook',
    signUpWithFacebook: 'Sign up with Facebook',
    signInWithApple: 'Sign in with Apple',
    signUpWithApple: 'Sign up with Apple',
    signUpWithEmail: 'Sign up with Email',
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
    emailLabel: 'Email',
    passwordLabel: 'Password',
    forgotPassword: 'Forgot Password?',
    login: 'LOGIN',
    facebookLogin: 'Sign In With Facebook',
  },
  mfaLogin: {
    mfaHeader: 'two-step verification',
    mfaDescription: 'Enter verification code from your authenticator app.',
    mfaLabel: 'Verification Code',
  },
  authErrorNotice: {
    credentialsIncorrect: 'Your Email or Password is Incorrect',
    emailUnverified: 'Verify your account via Email',
    mfaIncorrect: 'Incorrect verification code',
    unknown: 'There was a problem signing in.',
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
  onboardingAddPhoto: {
    nullHeader: 'Add Profile Photo',
    imageHeader: 'Profile Photo Added',
    description:
      'This will help others to recognize you once you are in a community',
    changePhoto: 'Change Photo',
    nullButtonText: 'Add a Profile Photo',
    imageButtonText: 'Continue',
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
    editProfile: 'Edit Profile',
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
    stageNull: 'Choose a stage',
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
    part6:
      "Over time you see all the different ways you're helping others draw close to God.",
    gotIt: 'Got It!',
  },
  stepDetail: {
    openPost: 'Open Post',
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
  feedCommentBox: {
    placeholder: 'Add a comment...',
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
    header: 'People',
    personalMinistry: 'Personal Ministry',
    personal: 'personal',
    addStage: 'Add Stage',
    errorLoadingStepCounts: 'Error loading step counts for your people',
  },
  appRoutes: {
    steps: 'Steps of Faith',
    people: 'People',
    notifications: 'Notifications',
    communities: 'Communities',
  },
  communityTabs: {
    feed: 'Feed',
    challenges: 'Challenges',
    impact: 'Impact',
  },
  personTabs: {
    feed: 'Feed',
    steps: 'Steps',
    notes: 'Notes',
    journey: 'Journey',
    impact: 'Impact',
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
    globalCommunity: 'MissionHub',
    errorLoadingCommunities: 'Error loading communities',
  },
  shareAStoryScreen: {
    shareStory: 'Share Story',
    inputPlaceholder: 'Share a Story...',
  },
  editStoryScreen: {
    saveStory: 'Save Changes',
    inputPlaceholder: 'Share a Story...',
  },
  communityFeed: {
    errorLoadingCommunityFeed: 'Error loading community feed',
  },
  communityFeedItems: {
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
    addToMySteps: 'Add to My Steps',
    viewChallenge: 'View Challenge',
    challengeAcceptedHeader: 'Joined a Challenge!',
    challengeCompletedHeader: 'Completed a Challenge!',
    newMemberHeader: 'We have a new member!',
    newMemberMessage: 'Help welcome {{personFirstName}}.',
    stepOfFaith:
      '{{initiator}} completed a Step of Faith with a {{receiverStage}} person.',
    stepOfFaithUnknownStage:
      '{{initiator}} completed a Step of Faith with someone.',
    stepOfFaithNotSureStage: '{{initiator}} completed a Step of Faith.',
    missionHubUser: 'MissionHub user',
    aMissionHubUser: 'A MissionHub user',
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
    stepsHeader: 'Steps of Faith',
    stepsDescription: 'Choose a person in People view to add a new step',
  },
  groupsMembers: {
    invite: 'Invite Member',
    sendInviteMessage:
      'Join me on MissionHub. Our community code is {{code}}. Click here to join: {{url}}',
    invited:
      "Anyone you've invited to {{orgName}} will show up here when they join.",
    errorLoadingMembers: 'Error loading members',
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
    memberSince: 'Member since',
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
  loadMore: {
    load: 'Load More',
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
  communityProfile: {
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
    errorLoadingCommunityDetails: 'Error loading community details',
  },
  landing: {
    getStarted: 'Get Started',
    haveCode: 'I have a Community Code',
    member: 'Already a Member?',
  },
  commentsList: {
    editComment: 'Edit Comment',
    deleteComment: 'Delete Comment',
    reportComment: 'Report Comment',
    reportToOwner: 'Report to Owner',
    reportToOwnerHeader: 'Report to Owner?',
    reportAreYouSure:
      'Are you sure you want to report this comment to the community owner?',
    deleteCommentHeader: 'Delete Comment?',
    deleteAreYouSure:
      'This comment will be deleted and you won’t be able to find it anymore.',
  },
  commentItem: {
    edited: 'Edited',
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
    STORY: 'God Story',
    PRAYER_REQUEST: 'Prayer Request',
    QUESTION: 'Spiritual Question',
    HELP_REQUEST: 'Community Need',
    THOUGHT: "What's on Your Mind",
    ACCEPTED_COMMUNITY_CHALLENGE: 'Challenge',
    ANNOUNCEMENT: 'Announcement',
    STEP: 'Step of Faith',
    header: {
      STORY: 'God Stories',
      PRAYER_REQUEST: 'Prayer Requests',
      QUESTION: 'Spiritual Questions',
      HELP_REQUEST: 'Community Needs',
      ANNOUNCEMENT: 'Announcements',
      THOUGHT: 'Random Thoughts',
      STEP: 'Steps of Faith',
    },
    subheader: {
      STORY: 'Share and celebrate when God does something amazing.',
      PRAYER_REQUEST:
        'Invite others to join you in prayer and find ways to pray for them.',
      QUESTION:
        'Ask a question or join a conversation about life, God and the Bible.',
      HELP_REQUEST: 'Share and respond to needs in the community.',
      ANNOUNCEMENT: 'Get the latest community news.',
      THOUGHT:
        'Share a random thought, or pass on the meme that made you laugh until you cried.',
      STEP: 'Recognize your Community’s steps of faith.',
    },
    globalSubheader: {
      STORY: 'Celebrate what God is doing through the MissionHub Community',
      PRAYER_REQUEST: 'Join the MissionHub Community in prayer.',
      ANNOUNCEMENT: 'Get the latest MissionHub news.',
      STEP: "Recognize one anothers' steps of faith",
    },
    nullState: {
      STORY: 'Spur one another on toward love and good deeds.',
      PRAYER_REQUEST: 'Let your requests be known to God.',
      QUESTION: 'Teach and counsel each other with all the wisdom he gives.',
      HELP_REQUEST: "Share one another's burdens.",
      ANNOUNCEMENT: 'He who abides by announcements will be blessed.',
      THOUGHT:
        'Where two or three are gathered in my name, there am I among them.',
      STEP: 'Encourage one another and build each other up.',
    },
    nullStateReference: {
      STORY: 'Hebrews 10:24',
      PRAYER_REQUEST: 'Philippians 4:6',
      QUESTION: 'Colossians 3:16',
      HELP_REQUEST: 'Galatians 6:2',
      ANNOUNCEMENT: 'anonymous',
      THOUGHT: 'Matthew 18:20',
      STEP: '1 Thessalonians 5:11',
    },
    card: {
      STORY: 'God Stories',
      PRAYER_REQUEST: 'Prayer Requests',
      QUESTION: 'Spiritual Questions',
      HELP_REQUEST: 'Community Needs',
      ANNOUNCEMENT: 'Announcements',
      STEP: 'Steps of Faith',
    },
  },
  createPostScreen: {
    choosePostType: 'Choose a Post Type',
    inputPlaceholder: 'Post to community...',
    recordVideo: 'Record a 15-Second Video',
    postAsYou: 'Post as You',
    ownersAndAdmins: 'Post as Owner/Admin',
    addAPhoto: 'Add a Photo',
    createButtonPlaceholder: 'Post to community...',
    createPostButton: {
      STORY: 'Share a God Story',
      PRAYER_REQUEST: 'Ask for Prayer',
      QUESTION: 'Ask a Spiritual Question',
      HELP_REQUEST: 'Share a Need',
      ANNOUNCEMENT: 'Make an Announcement',
      THOUGHT: "What's on Your Mind",
    },
    placeholder: {
      story: 'Share an inspiring God story...',
      prayer_request: 'Share a prayer need...',
      question: 'Ask a spiritual question...',
      help_request: 'Share a need...',
      thought: "What's on your mind?",
      announcement: 'Make an announcement...',
    },
    errorCreatingPost: 'Error creating post',
    errorUpdatingPost: 'Error updating post',
  },
  stepTypes: {
    relate: 'Relate',
    pray: 'Pray',
    care: 'Care',
    share: 'Share',
    stepOfFaith: 'Step of Faith',
    step: 'Step',
  },
  communityHeader: {
    feed: 'Feed',
    challenges: 'Challenges',
    impact: 'Impact',
    memberCount: '{{count}} Member',
    memberCount_plural: '{{count}} Members',
    errorLoadingCommunityDetails: 'Error loading community details',
    globalCommunity: 'MissionHub',
  },
  personHeader: {
    editPerson: 'Edit Person',
    deletePerson: 'Delete Person',
    deletePersonQuestion: 'Delete {{name}}?',
    deletePersonSentence: 'Are you sure you want to delete this person?',
    errorLoadingPersonDetails: 'Error loading person details',
  },
  createPost: {
    godStory: {
      label: 'God Story',
      placeholder: 'Share an inspiring God story...',
    },
    prayerRequest: {
      label: 'Prayer Request',
      placeholder: 'Share a prayer need...',
    },
    spiritualQuestion: {
      label: 'Spiritual Question',
      placeholder: 'Ask a spiritual question...',
    },
    careRequest: {
      label: 'Community Need',
      placeholder: 'Ask for help...',
    },
    onYourMind: {
      label: "What's On Your Mind",
      placeholder: "What's on your mind?",
    },
    announcement: {
      label: 'Announcement',
      placeholder: 'Make an announcement...',
    },
    addAPhoto: 'Add a Photo',
    buttonPlaceholder: 'Post to community...',
  },
  notificationsCenter: {
    title: 'Notifications',
    nullTitle: 'No notifications yet',
    nullDescription:
      'Stay tuned! Notifications about your communities will show up here.',
    errorLoadingNotifications: 'Error loading notifications',
    reportedActivity: 'Reported Activity',
    reportedComment: {
      part1: 'A comment from',
      part2: 'has been reported.',
    },
    reportedPost: {
      part1: 'A post from',
      part2: 'has been reported.',
    },
    review: 'Please Review.',
  },
  addPostToStepsScreen: {
    addToSteps: 'Add to my steps',
    prayerStepMessage: "Pray for {{personName}}'s request.",
    shareStepMessage: "Answer {{personName}}'s question.",
    careStepMessage: "Help with {{personName}}'s request.",
    errorSavingStep: 'Error saving step',
  },
  feedItemDetail: {
    errorLoadingFeedItemDetails: 'Error loading feed item details',
  },
  communityReported: {
    reportedPost: 'Reported Post',
    reportedComment: 'Reported Comment',
    reportedBy: 'Reported By',
    openPost: 'Open Post',
    deletePost: {
      title: 'Delete Post?',
      message: 'Are you sure you want to delete this post?',
      buttonText: 'Delete Post',
    },
    deleteFeedItemComment: {
      title: 'Delete Comment?',
      message: 'Are you sure you want to delete this comment?',
      buttonText: 'Delete Comment',
    },
    hurray: 'Hurray',
    respondedFeedItemCommentMessage: {
      delete: 'You have successfully deleted the comment.',
      ignore: 'You have successfully ignored the comment.',
    },
    respondedPostMessage: {
      delete: 'You have successfully deleted the post.',
      ignore: 'You have successfully ignored the post.',
    },
  },
  recordVideo: {
    cameraPermissions: {
      title: 'Permission to use camera',
      message: 'We need your permission to use your camera',
      buttonPositive: 'Ok',
      buttonNegative: 'Cancel',
    },
    audioPermissions: {
      title: 'Permission to use audio recording',
      message: 'We need your permission to use your audio',
      buttonPositive: 'Ok',
      buttonNegative: 'Cancel',
    },
  },
  pendingPost: {
    posting: 'Posting...',
    failed: 'Failed to upload video.',
    tryAgain: 'Try again.',
  },
};
