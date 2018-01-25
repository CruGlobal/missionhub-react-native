package com.missionhub;

import android.content.Intent;
import com.facebook.react.ReactActivity;
import com.adobe.mobile.Config;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "MissionHub";
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
       super.onActivityResult(requestCode, resultCode, data);
       MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
   }
    public void onResume() {
        super.onResume();
    }

    @Override
    public void onPause() {
        super.onPause();

        Config.pauseCollectingLifecycleData();
    }
}
