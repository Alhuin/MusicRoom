import React from 'react';
import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator,
  createSwitchNavigator,
  createDrawerNavigator,
  NavigationScreenProps,
  DrawerItems,
} from 'react-navigation';
import {
  Platform,
  Button,
  SafeAreaView,
  View,
} from 'react-native';
import { Icon } from 'native-base';
import { onSignOut } from '../auth';
import Connexion from '../screens/Connexion';
import Home from '../screens/Home';
import SendTokens from '../screens/SendTokens';
import UpdatePass from '../screens/UpdatePass';
import Inscription from '../screens/Inscription';
import UserSettings from '../screens/UserSettings';
import AppSettings from '../screens/AppSettings';
import Loading from '../screens/Loading';
import SearchTrack from '../screens/SearchTrack';

// Auth Navigator Handles Authentication screens by stack

const AuthNavigator = createStackNavigator({
  Inscription: {
    screen: Inscription,
    navigationOptions: {
      header: null,
    },
    path: 'signUp',
  },
  Inscription_noTransition: {
    screen: Inscription,
    navigationOptions: {
      header: null,
    },
  },
  Connexion: {
    screen: Connexion,
    navigationOptions: {
      header: null,
    },
    path: 'signIn',
  },
  Connexion_noTransition: {
    screen: Connexion,
    navigationOptions: {
      header: null,
    },
  },
  SendTokens: {
    screen: SendTokens,
    navigationOptions: {
      header: null,
    },
  },
  UpdatePass: {
    screen: UpdatePass,
    navigationOptions: {
      header: null,
    },
    path: 'updatePass/:userId',
  },
}, {
  transitionConfig: () => ({
    screenInterpolator: (sceneProps) => {
      if (sceneProps.scene.route.routeName.endsWith('_noTransition')) {
        return 0;
      }
      return 260;
    },
  }),
});

// HomeNavigator Handles Home screens by stack

const HomeNavigator = createStackNavigator({
  HomePage: {
    screen: Home,
    navigationOptions: ({ navigation }: NavigationScreenProps) => ({
      headerTitle: 'Home',
      headerTitleStyle: { paddingLeft: 50, fontFamily: 'Roboto' },
      headerLeft: Platform.select({
        ios: null,
        android: (
          <Icon
            ios="ios-menu"
            android="md-menu"
            style={{ paddingLeft: 20 }}
            onPress={() => navigation.toggleDrawer()}
          />
        ),
      }),
    }),
  },
  UserSettings: {
    screen: UserSettings,
    navigationOptions: {
      header: null,
    },
  },
  // Content ( Radios, Playlists, Favoris ) ou sur Home direct ?
});

// Main Navigator Handles HomeNavigator + Settings by drawer or tab

const MainNavigator = Platform.select({
  ios: createBottomTabNavigator({
    Home: {
      screen: HomeNavigator,
      path: 'main',
    },
    Settings: AppSettings,
  }),
  android: createDrawerNavigator({
    Home: {
      screen: HomeNavigator,
      path: 'main',
    },
    Settings: AppSettings,
    SearchTrack: {
      screen: SearchTrack,
    },
  },
  {
    contentComponent: props => (
      <View style={{ flex: 1 }}>
        <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
          <DrawerItems {...props} />
          <Button
            title="Logout"
            onPress={() => {
              const { navigation } = props;
              onSignOut();
              navigation.navigate('auth');
            }}
          />
        </SafeAreaView>
      </View>
    ),
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
  }),
});

// RouteSwitch Handles Auth + Main Navigators by switch

const RootSwitch = createSwitchNavigator(
  {
    Loading: {
      screen: Loading,
    },
    app: {
      screen: MainNavigator,
      path: 'home',
    },
    auth: {
      screen: AuthNavigator,
      path: 'auth',
    },
  },
  // { initialRouteName: 'auth' },
);

const prefix = 'musicroom://music/';

const App = createAppContainer(RootSwitch);

const MainApp = () => <App uriPrefix={prefix} />;

export default MainApp;
