# react-native-visibility-tracker

## Getting started

`$ npm install react-native-visibility-tracker --save` **OR** `$ yarn add react-native-visibility-tracker`

## Usage
```ts
import VisibilityTracker from 'react-native-visibility-tracker';

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

```
