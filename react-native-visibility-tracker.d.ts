import React from 'react';
import { NativeSyntheticEvent, ViewProperties } from 'react-native';

declare module 'react-native-visibility-tracker' {

    export type VisibilityChangeEventData = { visible: boolean };

    export type VisibilityChangeEvent = NativeSyntheticEvent<VisibilityChangeEventData>;

    export type VisibilityTrackerProps = {
        onVisibilityChanged?: (e: VisibilityChangeEvent) => (void | any)
    }

    export default class VisibilityTracker extends React.Component<VisibilityTrackerProps & ViewProperties> {

    }

    export class VisibilityTrackerModule {
        static isViewVisible(tag: number, onSuccess: (visible: boolean) => (void | any), onFail: (e: Error) => void): void
    }
}
