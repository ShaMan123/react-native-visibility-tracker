package io.autodidact.visibilitytracker;

import android.view.View;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.UIManagerModule;

public class VisibilityTrackerModule extends ReactContextBaseJavaModule {

    public static final String NAME = "VisibilityTracker";

    private final ReactApplicationContext reactContext;

    public VisibilityTrackerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void isViewVisible(final int tag, final Callback success, final Callback failure) {
        try {
            final ReactApplicationContext context = getReactApplicationContext();
            UIManagerModule uiManager = context.getNativeModule(UIManagerModule.class);
            uiManager.addUIBlock(new UIBlock() {
                public void execute(NativeViewHierarchyManager nvhm) {
                    View view = nvhm.resolveView(tag);
                    success.invoke(view.isShown());
                }
            });
        } catch (Throwable throwable) {
            failure.invoke(throwable);
        }
    }
}
