package com.missionhub;

import android.app.Application;

import android.support.multidex.MultiDex;
import android.content.Context;

import com.facebook.react.ReactApplication;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.imagepicker.ImagePickerPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.links.RNFirebaseLinksPackage;
import com.rollbar.RollbarReactNative;
import com.entria.views.RNViewOverflowPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.microsoft.codepush.react.CodePush;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.kevinresol.react_native_default_preference.RNDefaultPreferencePackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.moduleomniture.reactnativeomnitureapi.OmniturePackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import com.facebook.soloader.SoLoader;

import com.facebook.CallbackManager;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.FacebookSdk;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
      protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new AsyncStoragePackage(),
            new PickerPackage(),
            new RNGestureHandlerPackage(),
            new ImagePickerPackage(),
            new RNFirebasePackage(),
            new RNFirebaseLinksPackage(),
            RollbarReactNative.getPackage(),
            new RNViewOverflowPackage(),
            new RNDeviceInfo(),
            new CodePush("", getApplicationContext(), BuildConfig.DEBUG),
            new ReactNativeConfigPackage(),
            new RNDefaultPreferencePackage(),
            new FBSDKPackage(mCallbackManager),
            new OmniturePackage(),
            new ReactNativePushNotificationPackage(),
            new VectorIconsPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();

    FacebookSdk.sdkInitialize(this);

    AppEventsLogger.activateApp(this);

    SoLoader.init(this, /* native exopackage */ false);

    // TODO: figure out how to distinguish between the beta and production release tracks
    RollbarReactNative.init(this, BuildConfig.ROLLBAR_ACCESS_TOKEN, BuildConfig.DEBUG ? "development" : "production");
  }

  // Need to do this for Android versions <5.0
  @Override
  protected void attachBaseContext(Context base) {
    super.attachBaseContext(base);
    MultiDex.install(this);
  }
}
