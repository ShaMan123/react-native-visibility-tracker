'use strict';

import { NativeModules, requireNativeComponent, StyleSheet } from 'react-native';

const packageName = 'VisibilityTracker';
const VisibilityTracker = requireNativeComponent(packageName);
const VisibilityTrackerModule = NativeModules[packageName] || {};

const styles = StyleSheet.create({
    default: { flex: 1 }
});

export {
    VisibilityTracker as default,
    VisibilityTrackerModule as VisibilitySensorModule
};