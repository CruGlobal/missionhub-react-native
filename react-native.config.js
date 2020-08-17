module.exports = {
  dependencies: {
    // https://github.com/react-native-community/react-native-video/issues/1746#issuecomment-535310510
    'react-native-video': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-video/android-exoplayer',
        },
      },
    },
  },
};
