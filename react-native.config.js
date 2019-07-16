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
  },
};
