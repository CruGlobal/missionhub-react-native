package com.missionhub;

import android.app.Application;

import android.support.multidex.MultiDex;
import android.content.Context;

import com.crashlytics.android.Crashlytics;
import com.crashlytics.android.core.CrashlyticsCore;
import com.facebook.react.ReactApplication;
import io.invertase.firebase.RNFirebasePackage;
import com.entria.views.RNViewOverflowPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.microsoft.codepush.react.CodePush;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.reactlibrary.RNDefaultPreferencePackage;
import com.smixx.fabric.FabricPackage;
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

import io.fabric.sdk.android.Fabric;
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
            new RNFirebasePackage(),
            new RNFirebaseLinksPackage(),
            new RNViewOverflowPackage(),
            new RNDeviceInfo(),
            new CodePush("", getApplicationContext(), BuildConfig.DEBUG),
            new ReactNativeConfigPackage(),
            new RNDefaultPreferencePackage(),
            new FabricPackage(),
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

    if (BuildConfig.DEBUG) {
      Fabric.with(this, new Crashlytics.Builder().core(new CrashlyticsCore.Builder().disabled(BuildConfig.DEBUG).build()).build());
    } else {
      Fabric.with(this, new Crashlytics());
    }

    FacebookSdk.sdkInitialize(this);

    AppEventsLogger.activateApp(this);

    SoLoader.init(this, /* native exopackage */ false);
  }

  // Need to do this for Android versions <5.0
  @Override
  protected void attachBaseContext(Context base) {
    super.attachBaseContext(base);
    MultiDex.install(this);
  }
}
