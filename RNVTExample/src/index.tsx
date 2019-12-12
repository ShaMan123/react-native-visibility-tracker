import { createBrowserApp } from '@react-navigation/web';
import _ from 'lodash';
import React, { useCallback } from 'react';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import ListView from './ListView';

const SCREENS = {
  State: { screen: () => <ListView />, title: 'State Impl' },
  Animated: { screen: () => <ListView useAnimated />, title: 'Animated Impl' },
};

_.map(SCREENS, ({ screen, title }) => _.set(screen, 'navigationOptions.title', title));

function MainScreen(props: any) {
  const data = Object.keys(SCREENS).map(key => ({ key }));
  return (
    <FlatList
      style={styles.list}
      data={data}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={p => (
        <MainScreenItem
          {...p}
          onPressItem={({ key }) => props.navigation.navigate(key)}
        />
      )}
      renderScrollComponent={props => <ScrollView {...props} />}
    />
  );
}

MainScreen.navigationOptions = { title: 'React Native Visibility Tracker' };

const ItemSeparator = () => <View style={styles.separator} />;

function MainScreenItem(props: any) {
  const _onPress = useCallback(() => props.onPressItem(props.item), [props])
  const { key } = props.item;
  return (
    <RectButton style={styles.button} onPress={_onPress}>
      <Text style={styles.buttonText}>{SCREENS[key].title || key}</Text>
    </RectButton>
  );
}

const ExampleApp = createStackNavigator(
  {
    Main: { screen: MainScreen },
    ...SCREENS
  },
  {
    initialRouteName: 'Main',
    headerMode: 'screen',
  }
);

const styles = StyleSheet.create({
  list: {
    backgroundColor: '#EFEFF4',
  },
  separator: {
    height: 1,
    backgroundColor: '#DBDBE0',
  },
  buttonText: {
    backgroundColor: 'transparent',
  },
  button: {
    flex: 1,
    height: 60,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

const createApp = Platform.select({
  web: input => createBrowserApp(input, { history: 'hash' }),
  default: input => createAppContainer(input),
});

export default createApp(ExampleApp);
