import React from 'react';
import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator,
  createSwitchNavigator,
  createDrawerNavigator,
  NavigationScreenProps,
} from 'react-navigation';
import { Platform, View } from 'react-native';
import { Icon } from 'native-base';
import { Colors, Typography } from '../styles';
import Connexion from '../containers/Connexion';
import Home from '../containers/Home';
import SendTokens from '../screens/SendTokens';
import UpdatePass from '../screens/UpdatePass';
import Inscription from '../containers/Inscription';
import UserProfile from '../containers/UserProfile';
import AppSettings from '../containers/AppSettings';
import PlaylistSettings from '../containers/PlaylistSettings';
import Loading from '../containers/Loading';
import SearchTrack from '../components/SearchTrack/SearchTrack';
import Playlist from '../containers/Playlist';
import Radios from '../containers/Radios';
import Partys from '../containers/Partys';
import CustomDrawer from '../containers/CustomDrawer';
import CustomTabNavigator from '../containers/CustomTabNavigator';

// Menu creation on Android

const createBurgerMenu = navigation => Platform.select({
  ios: null,
  android: (
    <Icon
      ios="ios-menu"
      android="md-menu"
      style={{ paddingLeft: 20, color: Colors.icon }}
      onPress={() => navigation.toggleDrawer()}
    />
  ),
});

// Auth Navigator Handles Authentication screens by stack

const AuthNavigator = createStackNavigator({
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
  Inscription: {
    screen: Inscription,
    navigationOptions: {
      header: null,
    },
    path: 'signUp/:DeezCode',
  },
  Inscription_noTransition: {
    screen: Inscription,
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
      headerStyle: { backgroundColor: Colors.screenHeader },
      headerTitleContainerStyle: { ...Typography.screenHeader, width: 'auto', flex: 8 },
      headerTitleStyle: { ...Typography.screenHeaderText },
      headerLeftContainerStyle: Typography.headerSidesContainerStyle,
      headerRightContainerStyle: Typography.headerSidesContainerStyle,
      headerRight: (<View />),
      headerLeft: createBurgerMenu(navigation),
    }),
  },
});

// Radios & Partys stack navigators

const PartysNavigator = createStackNavigator({
  PartysList: {
    screen: Partys,
    navigationOptions: ({ navigation }: NavigationScreenProps) => ({
      headerTitle: 'Parties',
      headerStyle: { backgroundColor: Colors.screenHeader },
      headerTitleContainerStyle: { ...Typography.screenHeader, width: 'auto', flex: 8 },
      headerTitleStyle: { ...Typography.screenHeaderText },
      headerLeftContainerStyle: Typography.headerSidesContainerStyle,
      headerRightContainerStyle: Typography.headerSidesContainerStyle,
      headerRight: (<View />),
      headerLeft: createBurgerMenu(navigation),
    }),
  },
  Playlist: {
    screen: Playlist,
    navigationOptions: {
      header: null,
    },
  },
  SearchTrack: {
    screen: SearchTrack,
    navigationOptions: {
      header: null,
    },
  },
  PlaylistSettings: {
    screen: PlaylistSettings,
    navigationOptions: {
      header: null,
    },
  },
  UserProfile: {
    screen: UserProfile,
    navigationOptions: {
      header: null,
    },
  },
});

const RadiosNavigator = createStackNavigator({
  RadiosList: {
    screen: Radios,
    navigationOptions: ({ navigation }: NavigationScreenProps) => ({
      headerTitle: 'Radios',
      headerStyle: { backgroundColor: Colors.screenHeader },
      headerTitleContainerStyle: { ...Typography.screenHeader, width: 'auto', flex: 8 },
      headerTitleStyle: { ...Typography.screenHeaderText },
      headerLeftContainerStyle: Typography.headerSidesContainerStyle,
      headerRightContainerStyle: Typography.headerSidesContainerStyle,
      headerRight: (<View />),
      headerLeft: createBurgerMenu(navigation),
    }),
  },
  Playlist: {
    screen: Playlist,
    navigationOptions: {
      header: null,
    },
  },
  SearchTrack: {
    screen: SearchTrack,
    navigationOptions: {
      header: null,
    },
  },
  PlaylistSettings: {
    screen: PlaylistSettings,
    navigationOptions: {
      header: null,
    },
  },
  UserProfile: {
    screen: UserProfile,
    navigationOptions: {
      header: null,
    },
  },
});

// Main Navigator Handles HomeNavigator + Settings by drawer or tab

const MainNavigator = Platform.select({
  ios: createBottomTabNavigator({
    Home: {
      screen: HomeNavigator,
      path: 'main',
    },
    Settings: {
      screen: AppSettings,
      navigationOptions: {
        title: 'Paramètres',
      },
      path: 'AppSettings/:DeezCode',
    },
    Parties: PartysNavigator,
    Radios: RadiosNavigator,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      // eslint-disable-next-line no-unused-vars
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = 'ios-home';
        } else if (routeName === 'Settings') {
          iconName = 'md-build';
        } else if (routeName === 'Parties') {
          iconName = 'musical-notes';
        } else if (routeName === 'Radios') {
          iconName = 'radio';
        }
        return (
          <Icon
            name={iconName}
            style={{
              color: tintColor, fontSize: Typography.iconFontSize,
            }}
          />
        );
      },
      tabBarOptions: {
        activeTintColor: Colors.lightGreen,
        inactiveTintColor: Colors.baseText,
      },
    }),
    tabBarComponent: props => (
      <CustomTabNavigator tabProps={props} navigation={props.navigation} />
    ),
  }),
  android: createDrawerNavigator({
    Home: {
      screen: HomeNavigator,
      path: 'main',
    },
    Settings: {
      screen: AppSettings,
      navigationOptions: {
        drawerLabel: 'Paramètres',
      },
      path: 'AppSettings/:DeezCode',
    },
    Parties: PartysNavigator,
    Radios: RadiosNavigator,
  },
  {
    contentComponent: props => <CustomDrawer drawerProps={props} navigation={props.navigation} />,
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    contentOptions: {
      activeTintColor: Colors.active,
      inactiveTintColor: Colors.baseText,
      activeBackgroundColor: Colors.darkestGrey,
    },
  }),
});

// RouteSwitch Handles Auth + Main Navigators by switch

const RootSwitch = createSwitchNavigator(
  {
    Loading: {
      screen: Loading,
    },
    auth: {
      screen: AuthNavigator,
      path: 'auth',
    },
    app: {
      screen: MainNavigator,
      path: 'home',
    },
  },
);

const prefix = 'musicroom://music/';

const App = createAppContainer(RootSwitch);

const MainApp = () => <App uriPrefix={prefix} />;

export default MainApp;
