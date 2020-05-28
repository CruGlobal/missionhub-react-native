module.exports = {
  dependencies: {
    'react-native-code-push': {
      platforms: {
        android: {
          packageInstance:
            'new CodePush("", getApplicationContext(), BuildConfig.DEBUG)',
        },
      },
    },
    'react-native-video': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-video/android-exoplayer',
        },
      },
    },
  },
};
