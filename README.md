# MissionHub [![Build Status](https://travis-ci.com/CruGlobal/missionhub-react-native.svg?token=qw4zYh6vUTp6WkvVkWCb&branch=master)](https://travis-ci.com/CruGlobal/missionhub-react-native) [![codecov](https://codecov.io/gh/CruGlobal/missionhub-react-native/branch/master/graph/badge.svg?token=5Wgs4elevu)](https://codecov.io/gh/CruGlobal/missionhub-react-native)

MissionHub: See God at work and know you are part of it.


## Getting Started

To get started running and building the MissionHub application, you need to have a few things installed

- Node and Yarn
- Xcode (for iOS build)
- Android SDK
- react-native-cli (Run `yarn global add react-native-cli`)

Check out the [Getting Started](https://facebook.github.io/react-native/docs/getting-started.html) guides for iOS/Android based on your OS


## Development Environment

You'll need to make sure you have a few plugins in your IDE/Editor. Atom or VSCode are pretty common to be used with React-Native.

Plugins:
- `.editorconfig`
- `eslint`
- `react` (for javascript files with `jsx` syntax)

## Running the application

#### For iOS:

- Open the `ios/MissionHub.xcodeproj` file with Xcode
- Run the MissionHub scheme on a simulator or connected device

#### For Android:

- Make sure you have the Android build-tools installed from the sdk for version `26.0.1` along with all the other steps from the react-native documentation.
- Connect your android device or emulator and make sure it shows up in your terminal when you run `adb devices`
- Run `yarn run android`
- *Note: You can also use Android Studio to run the application instead of the terminal*



## Debugging

You must run the application in in Dev mode to see logs.

You can use the built in Chrome Debugger for a lot of things by shaking the device and selecting **Debug JS Remotely**.

You can also install the [React Native Debugger](https://github.com/jhen0409/react-native-debugger) to see a lot of detail remotely through that application. It will automatically find your device when you run the app.

You can enable **Hot Reloading** by shaking the device and enabling it from there.



## Building the application

For iOS, you can run change the scheme to a `Release` version and run the application in Xcode.

For Android, to build to a local device, check that there is a device connected by running `adb devices`, then you can run `yarn run android:build`. Make sure you've uninstalled any existing MissionHub application on the device first. This will create the apk at this location: `/android/app/build/outputs/apk/app-release.apk`


## Deploying to Crashlytics

For iOS, use the Fabric application that you can download and follow the steps on there for deployments. Click into the `com.missionhub` iOS project, click the Tab for Archives. This is where you can manage all prior and current archives to distribute. In XCode, change your build target to either a plugged in device, or the "Generic iOS Device" target, increment the build number, then click on Product -> Archive. An archive will now build and you will get an alert from Fabric saying that a new build is ready to be released. Click "Distribute" in the Fabric popup and select who you want to send the release to.

For Android, after you have followed the steps above to create a build file, you do everything else through Android Studio. There is a Fabric plugin for Android Studio, login with your account that has access to release builds. Select the `com.missionhub` project, go to Crashlytics, hit "Next". You'll see a list of crashes/releases, go to the Share tab, in the bottom right there is a button to "Upload a file". Select this, then navigate to the release apk (`/android/app/build/outputs/apk/app-release.apk`)


## Notes

iOS builds can only be run on a Mac.

## About env files

This project has three `.env` files in two different locations. Their purpose is described here:

### Project root directory
These files 
- .env.production - this file has the Production API URL, Production authentication server (TheKey) URL, as well as Production keys for code push. This file is meant to be used with any Release build to the Play Store or App Store.
- .env.beta - this file has the Production API URL, Production authentication server (TheKey) URL as well as Staging keys for code push. This file is meant to be kept around for the scenarios when we need to release a Beta build against the Production APIs with CodePush changes that we want to test. This process will be manual, for now.
- .env - this file is ignored by Git, but developers should use this file to build and run the project locally. It is recommended to copy and paste one of the .env files listed above to this file name and modify as needed.

### iOS directory ({ROOT}/ios
- .env.default - this file has the variables necessary for FastLane to build iOS Archives and Android APK files. It is completely independent from the root level .env files. It is necessary because FastLane does not detect .env files in a location above the native iOS/Android project root directories, which are sub-root to the overall project root directory.

