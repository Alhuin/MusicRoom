import React from 'react';
import Platform from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Connexion from '../Pages/Connexion';
import Home from '../Pages/Home';
import SendTokens from '../Pages/SendTokens';
import UpdatePass from '../Pages/UpdatePass';
import Inscription from '../Pages/Inscription';

const AppStackNavigator = createStackNavigator({
  // Entry: {
  //   screen: Entry,
  //   navigationOptions: {
  //     header: null,
  //   },
  // },
  Inscription: {
    screen: Inscription,
    navigationOptions: {
      header: null,
    },
    path: 'Inscription',
  },
  Connexion: {
    screen: Connexion,
    navigationOptions: {
      header: null,
    },
    path: 'Connexion',
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
});

const prefix = 'musicroom://music/';

const App = createAppContainer(AppStackNavigator);

const MainApp = () => <App uriPrefix={prefix} />;

export default MainApp;
