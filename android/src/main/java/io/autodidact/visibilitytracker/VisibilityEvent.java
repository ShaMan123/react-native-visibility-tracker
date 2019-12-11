package io.autodidact.visibilitytracker;

import androidx.core.util.Pools;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class VisibilityEvent extends Event<VisibilityEvent> {

    private static final int TOUCH_EVENTS_POOL_SIZE = 7; // magic

    private static final Pools.SynchronizedPool<VisibilityEvent> EVENTS_POOL =
            new Pools.SynchronizedPool<>(TOUCH_EVENTS_POOL_SIZE);

    static final String VISIBILITY_EVENT_NAME = "onVisibilityChanged";

    public static VisibilityEvent obtain(int viewTag, boolean isVisible) {
        WritableNativeMap eventData = new WritableNativeMap();
        eventData.putBoolean("visible", isVisible);
        return obtain(viewTag, VISIBILITY_EVENT_NAME, eventData);
    }

    private static VisibilityEvent obtain(int viewTag, String eventName, WritableMap eventData) {
        VisibilityEvent event = EVENTS_POOL.acquire();
        if (event == null) {
            event = new VisibilityEvent();
        }
        event.init(viewTag, eventName, eventData);
        return event;
    }

    private WritableMap mExtraData;
    private String mEventName;

    private VisibilityEvent() {
    }

    protected void init(int viewTag, String eventName, WritableMap eventData) {
        super.init(viewTag);
        mEventName = eventName;
        mExtraData = eventData;
    }

    @Override
    public void onDispose() {
        mExtraData = null;
        EVENTS_POOL.release(this);
    }

    @Override
    public String getEventName() {
        return mEventName;
    }

    @Override
    public boolean canCoalesce() {
        // TODO: coalescing
        return false;
    }

    @Override
    public short getCoalescingKey() {
        // TODO: coalescing
        return 0;
    }

    @Override
    public void dispatch(RCTEventEmitter rctEventEmitter) {
        rctEventEmitter.receiveEvent(getViewTag(), mEventName, mExtraData);
    }
}
