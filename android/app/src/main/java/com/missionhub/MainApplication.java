package com.missionhub;

import android.app.Application;
import android.util.Log;

import androidx.multidex.MultiDex;
import android.content.Context;

import com.facebook.react.PackageList;
import com.facebook.hermes.reactexecutor.HermesExecutorFactory;
import com.facebook.react.bridge.JavaScriptExecutorFactory;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;

import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.links.RNFirebaseLinksPackage;
import com.rollbar.RollbarReactNative;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();
      // Packages that cannot be autolinked yet can be added manually here, for example:
      // packages.add(new MyReactNativePackage());

      packages.add(new RNFirebaseLinksPackage());

      return packages;
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
