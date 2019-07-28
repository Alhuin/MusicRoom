import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Connexion from '../Pages/Connexion';
import Home from '../Pages/Home';
import SendTokens from '../Pages/SendTokens';
import UpdatePass from '../Pages/UpdatePass';
import Inscription from '../Pages/Inscription';

const AppStackNavigator = createStackNavigator({
  Inscription: {
    screen: Inscription,
    navigationOptions: {
      header: null,
    },
    path: 'Inscription',
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
    path: 'Connexion',
  },
  Connexion_noTransition: {
    screen: Connexion,
    navigationOptions: {
      header: null,
    },
  },
  Home: {
    screen: Home,
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
    path: 'UpdatePass/:userId',
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

const prefix = 'musicroom://music/';

const App = createAppContainer(AppStackNavigator);

const MainApp = () => <App uriPrefix={prefix} />;

export default MainApp;
