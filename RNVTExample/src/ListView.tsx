
import React, { useMemo, useRef, useState } from 'react';
import { FlatList, processColor, StyleSheet, ListRenderItemInfo } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import VisibilityTracker, { VisibilityChangeEvent } from 'react-native-visibility-tracker';

const {
    event,
    cond, eq, add, call, set, Value, debug, concat, timing, color, modulo, invoke, dispatch, diff, useCode, lessThan, greaterThan, or, Code, map, callback, round, neq, createAnimatedComponent, Text, View, ScrollView, and, proc, Clock, multiply, onChange, not, defined, clockRunning, block, startClock, stopClock, spring
} = Animated;

const AVisibilityTracker = createAnimatedComponent(VisibilityTracker);

type pip = ListRenderItemInfo<{
    isVisible: Animated.Value<number>,
    opacity: Animated.Value<number>,
    clock: Animated.Clock
}>


function VisiblityTrackerAnimatedItem({ index, item: { clock, isVisible, opacity } }: pip) {
    //    useCode(() => debug(`${index} : `, isVisible), [index, isVisible]);
    const color = useMemo(() => cond(isVisible, processColor('blue'), processColor('red')), [isVisible]);
    const e = useMemo(() => event<VisibilityChangeEvent>([{
        nativeEvent: { visible: isVisible }
    }]), [isVisible]);

    useCode(() =>
        block([
            onChange(isVisible, stopClock(clock)),
            set(opacity, runTiming(clock, opacity, cond(isVisible, 1, 0.1)))
        ]),
        [clock, opacity, isVisible]
    );

    return (
        <AVisibilityTracker
            collapsable={false}
            onVisibilityChanged={e}
            onLayout={() => isVisible.setValue(1)}
        >
            <View
                collapsable={false}
                style={[{
                    backgroundColor: color,
                    opacity,
                    height: 100, margin: 5
                }]}
            >
                <Text>{index}</Text>
            </View>
        </AVisibilityTracker>
    );
}

function VisiblityTrackerItem(props: { index: number }) {
    const [isVisible, setVisible] = useState(false);
    return (
        <VisibilityTracker
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
        </VisibilityTracker>
    )
}

export default function ListView({ useAnimated }: { useAnimated?: boolean }) {
    const Renderer = useMemo(() => useAnimated ? VisiblityTrackerAnimatedItem : VisiblityTrackerItem, [useAnimated]);

    const data = useMemo(() =>
        new Array(200)
            .fill(0)
            .map((v, i) => {
                return useAnimated ?
                    {
                        isVisible: new Value(0),
                        opacity: new Value(0),
                        clock: new Clock()
                    } :
                    i
            }),
        [useAnimated]
    );

    //const ref = useRef<FlatList<pip>>();

    return (
        <FlatList
            style={styles.default}
            data={data}
            renderItem={(data) => <Renderer {...data} />}
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