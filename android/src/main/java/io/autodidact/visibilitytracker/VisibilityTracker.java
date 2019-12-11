package io.autodidact.visibilitytracker;

import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.views.view.ReactViewGroup;

public class VisibilityTracker extends ReactViewGroup {

    interface VisibilityListener {
        void onChange(boolean isVisible, boolean emitEvent);
    }

    private boolean mIsVisible = false;
    private boolean mDidAttach = false;
    private @Nullable VisibilityListener mListener;
    private boolean mShouldDispatchEvent = false;

    public VisibilityTracker(ReactContext context) {
        super(context);
    }

    public void setShouldDispatchEvent(boolean dispatchEvent) {
        mShouldDispatchEvent = dispatchEvent;
        if (mShouldDispatchEvent) {
            dispatchIfNeeded();
        }
    }

    void setVisibilityListener(VisibilityListener listener) {
        mListener = listener;
    }

    private void dispatchIfNeeded() {
        dispatchIfNeeded(isShown());
    }

    private void dispatchIfNeeded(int visibility) {
        dispatchIfNeeded(visibility == VISIBLE);
    }

    private void dispatchIfNeeded(boolean isVisible) {
        if (!mDidAttach || isVisible != mIsVisible) {
            mDidAttach = true;
            mIsVisible = isVisible;
            if (mListener != null) {
                mListener.onChange(mIsVisible, mShouldDispatchEvent);
            }
        }
    }



    /*
    visibility Methods:
        isAttachedToWindow();
        getVisibility();
        isShown();
        getGlobalVisibleRect();
        getVisibility();
        getLocalVisibleRect();
        getWindowVisibleDisplayFrame();
        getLocationOnScreen();
        getLocationInWindow();

     */

    @Override
    protected void onVisibilityChanged(@NonNull View changedView, int visibility) {
        super.onVisibilityChanged(changedView, visibility);
        dispatchIfNeeded(visibility);
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        dispatchIfNeeded();
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        dispatchIfNeeded(false);
    }

    @Override
    public void onVisibilityAggregated(boolean isVisible) {
        super.onVisibilityAggregated(isVisible);
        dispatchIfNeeded(isVisible);
    }

    @Override
    protected void onWindowVisibilityChanged(int visibility) {
        super.onWindowVisibilityChanged(visibility);
        dispatchIfNeeded(visibility);
    }
}
