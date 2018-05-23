# MissionHub [![Build Status](https://travis-ci.com/CruGlobal/missionhub-react-native.svg?token=qw4zYh6vUTp6WkvVkWCb&branch=master)](https://travis-ci.com/CruGlobal/missionhub-react-native) [![codecov](https://codecov.io/gh/CruGlobal/missionhub-react-native/branch/master/graph/badge.svg?token=5Wgs4elevu)](https://codecov.io/gh/CruGlobal/missionhub-react-native)

MissionHub: See God at work and know you are part of it.

## Getting Started

To get started running and building the MissionHub application, you need to have a few things installed

* Node and Yarn
* Xcode (for iOS build)
* Android SDK
* react-native-cli (Run `yarn global add react-native-cli`)

Check out the [Getting Started](https://facebook.github.io/react-native/docs/getting-started.html) guides for iOS/Android based on your OS

## Development Environment

You'll need to make sure you have a few plugins in your IDE/Editor. Atom or VSCode are pretty common to be used with React-Native.

Plugins:

* `.editorconfig`
* `eslint`
* `react` (for javascript files with `jsx` syntax)

You'll also need to create a .env file in your project root directory. The easiest way to do this is to copy .env.production to .env and modify the contents of .env accordingly. This file is ignored by Git so no need to worry about accidentally commititing changes that will impact another developer.

## Running the application

#### For iOS:

* Open the `ios/MissionHub.xcodeproj` file with Xcode
* Run the MissionHub scheme on a simulator or connected device

#### For Android:

* Make sure you have the Android build-tools installed from the sdk for version `26.0.1` along with all the other steps from the react-native documentation.
* Connect your android device or emulator and make sure it shows up in your terminal when you run `adb devices`
* Run `yarn run android`
* _Note: You can also use Android Studio to run the application instead of the terminal_

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

* .env.production - this file has the Production API URL, Production authentication server (TheKey) URL, as well as Production keys for code push. This file is meant to be used with any Release build to the Play Store or App Store.
* .env.beta - this file has the Production API URL, Production authentication server (TheKey) URL as well as Staging keys for code push. This file is meant to be kept around for the scenarios when we need to release a Beta build against the Production APIs with CodePush changes that we want to test. This process will be manual, for now.
* .env - this file is ignored by Git, but developers should use this file to build and run the project locally. It is recommended to copy and paste one of the .env files listed above to this file name and modify as needed.

### iOS directory ({ROOT}/ios

* .env.default - this file has the variables necessary for FastLane to build iOS Archives and Android APK files. It is completely independent from the root level .env files. It is necessary because FastLane does not detect .env files in a location above the native iOS/Android project root directories, which are sub-root to the overall project root directory.

## Automated Deployments

MissionHub uses [Travis-CI](https://travis-ci.com) and [Fastlane](https://fastlane.tools) scripts to automate the build and deployment process. The master iOS and Android FastLane builds files are found [here](https://github.com/CruGlobal/cru-fastlane-files/blob/master/Fastfile) and [here](https://github.com/CruGlobal/cru-fastlane-files/blob/master/android/Fastfile) respectively.

The master build files are a common set of files that can be used to build most any project. Project specific configurations are stored in `.env.default` inside the ios/ and android/ directories of this project.

[TODO: define what each configuration parameter means/does]

iOS pre-releases are deployed through TestFlight to iTunesConnect users. This setup allows deployment without waiting for a Beta TestFlight review. If it is desired to deploy to external beta testers, then manual developer effort is required to do that through iTunesConnect. iOS releases are promoted to the App Store "release" by passing the parameter of the build number.

Android pre-releases are deployed to the Play Store internal-test track. This setup allows deployment to a controlled group of internal beta testers. If it is desired to deploy to external beta testers, then manual developer effort is required to promote or deploy builds to the alpha or beta track. Android releases are promoted to the Play Store "release" track by promoting the latest "internal" track build. _NOTE!_ The current automation will only promote builds from the "internal" test track to production and will not account for builds in the alpha/beta tracks. PRs welcomed.

Pre-release builds are completed and deployed to TestFlight and the Play Store "internal" track on any push to the `master` branch, following this process.

### iOS Pre-release

* [developer] push to `master`
* [travis] install yarn, fastlane and other dependencies, extract Facebook SDK (sigh).
* [travis] run `yarn install` to add node dependencies
* [travis] run `yarn oneskey` to fetch updated localizations from Onesky
* [travis] invoke [fastlane] `fastlane ios beta`
* [fastlane] set project build number to travis build number #important b/c the build number set here will be used later to promote the release build!
* [fastlane] use `match` to import and decrypt iOS distribution certificate and provisioning profile to keychain
* [fastlane] build and sign app archive
* [fastlane] upload signed app archive to TestFlight
  * NOTE: this step can take 5 minutes to nearly 2 hours to complete b/c of automated iTunesConnect checks that vary in length.
* [fastlane] commit and push the updated build number to GitHub remote with [skip ci] tag to prevent a travis-ci fork bomb
* [fastlane] notify the MissionHub - Engineering HipChat channel of release

### Android Pre-release

* [developer] push to `master`
* [travis] install yarn, fastlane and other dependencies
* [travis] run `yarn install` to add node dependencies
* [travis] run `yarn oneskey` to fetch updated localizations from Onesky
* [travis] invoke [fastlane] `fastlane android beta`
* [fastlane] set project build number to total number of git commits in master branch
* [fastlane] decrypt Play Store upload key for MH
* [fastlane] build and sign app APK
* [fastlane] upload signed app archive to Play Store "internal" test track
* [fastlane] notify the MissionHub - Engineering HipChat channel of release

Production releases for both apps use a standard semantic versioning scheme for version number/name (iOS/Android). [major].[minor].[patch] . In the examples below vx.y.z will refer to a version x.y.z using this scheme.

Travis will build production releases for both platform when it detects a commit in the `vx.y.z` format where x, y and z can be any number of digits.

### Production releases (both platforms)

* [developer/qa] verify that latest builds work as expected against production!
* [developer] checkout locally `master` commit to be deployed
  * NOTE: this should typically be a `[skip ci] Bump Build number commit`, but not always
* [developer] create branch releases/vx.y.z
  * NOTE: this the branch name is convention, but travis doesn't care what it is. only the format of the tag matters. the point of creating the branch is to get off `master` so that when pushing the tag it doesn't also trigger a beta build.
* [developer] if the most recent commit is a `[skip ci] Bump Build number commit`, then amend the commit message to drop `[skip ci]` and note that this is a release commit.
* [developer] add tag vx.y.z to this commit.
* [developer] push branch and tags to GH (e.g. `git push origin releases/v4.1.1 --tags`)
* [travis] install fastlane and other dependencies in iOS directory
* [travis] invoke [fastlane] `fastlane ios release`
* [fastlane] promote build to iTunesConnect release from TestFlight based on the build number set on the project at this commit.
  * NOTE: this may not be the latest build depending up where the tag and commit are in the Git history!
* [fastlane] increment patch version number and push to GitHub remote
  * NOTE | [TODO]: this step is skipped right now because the wrong branch is checked out and Travis w/ it's shallow clone won't be able to push back to the remote. PR welcomed.
* [fastlane] notify the MissionHub - Engineering HipChat channel of release
* [travis] install fastlane and other dependencies in android directory
* [travis] invoke [fastlane] `fastlane android release`
* [fastlane] promote build to Play Store release track from internal track.
  * NOTE: unlike iOS, this will ALWAYS be the latest APK uploaded to "internal" track. anything in the alpha or beta track is ignored
* [fastlane] notify the MissionHub - Engineering HipChat channel of release
* [developer] soon after, merge `master` down into `develop` (no PR required)
* [developer] set, commit and push to `develop` the android version name (and iOS version number while this automated step is not working) to next desired value x.y.z+1

### Production releases (specific platform) - untested!

It is possible, although untested, to release only one platform to only one platform by pushing a tag in the `vx.y.z` format and appending `-ios` or `-android` to build for only iOS or Android respectively. Again create a branch for this from master following the convention `releases/vx.y.z-android` to avoid needlessly building another pre-release from master when pushing the tag.
