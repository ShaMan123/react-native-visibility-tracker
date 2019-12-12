package io.autodidact.visibilitytracker;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Dynamic;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.views.view.ReactViewGroup;
import com.facebook.react.views.view.ReactViewManager;

import java.util.Map;

public class VisibilityTrackerManager extends ReactViewManager {

    @Override
    public String getName() {
        return VisibilityTrackerModule.NAME;
    }

    @Override
    public ReactViewGroup createViewInstance(ThemedReactContext context) {
        return new VisibilityTracker(context);
    }

    @ReactProp(name = VisibilityEvent.VISIBILITY_EVENT_NAME)
    public void shouldDispatchEvent(VisibilityTracker view, @Nullable Dynamic callback) {
        view.setShouldDispatchEvent(callback != null);
    }

    @Override
    protected void addEventEmitters(@NonNull final ThemedReactContext reactContext, @NonNull final ReactViewGroup view) {
        final EventDispatcher eventDispatcher = reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
        ((VisibilityTracker) view).setVisibilityListener(new VisibilityTracker.VisibilityListener() {
            @Override
            public void onChange(boolean isVisible, boolean dispatchEvent) {
                if (dispatchEvent) {
                    VisibilityEvent e = VisibilityEvent.obtain(view.getId(), isVisible);
                    eventDispatcher.dispatchEvent(e);
                }
            }
        });
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put(VisibilityEvent.VISIBILITY_EVENT_NAME, MapBuilder.of("registrationName", VisibilityEvent.VISIBILITY_EVENT_NAME))
                .build();
    }
}
