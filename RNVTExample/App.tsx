
import React, { useMemo, useEffect, useRef, useState } from 'react';
import { SectionListProps, FlatList, StyleSheet, processColor } from 'react-native';
import VisibilitySTracker, { VisibilityTrackerModule, VisibilityChangeEvent } from 'react-native-visibility-tracker';
import Animated, { Easing } from 'react-native-reanimated';

const {
    event,
    cond, eq, add, call, set, Value, debug, concat, timing, color, modulo, invoke, dispatch, diff, useCode, lessThan, greaterThan, or, Code, map, callback, round, neq, createAnimatedComponent, Text, View, ScrollView, and, proc, Clock, multiply, onChange, not, defined, clockRunning, block, startClock, stopClock, spring
} = Animated;

const AVisibilitySensor = createAnimatedComponent(VisibilitySTracker);

function VisiblityTrackerAnimatedItem(props: { index: number } = { index: 200 }) {
    const isVisible = useMemo(() => new Value(0), []);
    const opacity = useMemo(() => new Value(1), []);

    const clock = useMemo(() => new Clock(), []);

    useCode(() => debug(`${props.index} : `, isVisible), [props.index, isVisible]);

    useCode(() =>
        set(opacity, runTiming(clock, opacity, cond(isVisible, 1, 0.1))),
        [clock, opacity, isVisible]
    );

    return (
        <AVisibilitySensor
            collapsable={false}
            //style={styles.default}
            onVisibilityChanged={event<VisibilityChangeEvent>([{
                nativeEvent: { visible: isVisible }
            }])}
            onLayout={() => isVisible.setValue(1)}
        >
            <View
                collapsable={false}
                style={[{
                    backgroundColor: cond(isVisible, processColor('blue'), processColor('red')),
                    opacity,
                    height: 100, margin: 5
                }]}
            >
                <Text>{props.index}</Text>
            </View>
        </AVisibilitySensor>
    )
}

function VisiblityTrackerItem(props: { index: number } = { index: 200 }) {
    const [isVisible, setVisible] = useState(false);
    return (
        <AVisibilitySensor
            onVisibilityChanged={e => setVisible(e.nativeEvent.visible)}
        >
            <View
                collapsable={false}
                style={[{
                    backgroundColor: isVisible ? 'blue' : 'red',
                    height: 100,
                    margin: 5
                }]}
            >
                <Text>{props.index}</Text>
            </View>
        </AVisibilitySensor>
    )
}

const useAnimated = false;
const Renderer = useAnimated ? VisiblityTrackerAnimatedItem : VisiblityTrackerItem;

export default function App() {
    const data = useMemo(() => new Array(200).fill(0).map((v, i) => i), []);
    const ref = useRef<FlatList>();

    return (
        <FlatList
            style={styles.default}
            data={data}
            renderItem={({ item }) => <Renderer index={item} />}
            keyExtractor={(item, index) => `WilliWoonka${index}`}
        //ref={ref => ref && setTimeout(() => ref.getScrollResponder().scrollResponderScrollTo({ x: 1, y: 20 }), 0)}
        />
    );
}

const styles = StyleSheet.create({
    default: {
        flex: 1,
    },

});

function runTiming(clock: Animated.Clock, value: Animated.Adaptable<number>, dest: Animated.Adaptable<number>, startStopClock = true) {
    const state = {
        finished: new Value(0),
        position: new Value(0),
        frameTime: new Value(0),
        time: new Value(0),
    };

    const config = {
        toValue: new Value(0),
        duration: 1000,
        easing: Easing.linear,
    };

    return [
        cond(clockRunning(clock), 0, [
            set(state.finished, 0),
            set(state.frameTime, 0),
            set(state.time, 0),
            set(state.position, value),
            set(config.toValue, dest),
            startStopClock && startClock(clock),
        ]),
        timing(clock, state, config),
        cond(state.finished, startStopClock && stopClock(clock)),
        state.position,
    ];
}