import { createStackNavigator, createAppContainer } from 'react-navigation';
import Connexion from '../Pages/Connexion';
import Home from '../Pages/Home';
import SendTokens from '../Pages/SendTokens';
import UpdatePass from '../Pages/UpdatePass';
import Entry from '../Pages/Entry';

const AppStackNavigator = createStackNavigator({
  Entry: {
    screen: Entry,
    navigationOptions: {
      header: null,
    },
  },
  Connexion: {
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
  },
});

export default createAppContainer(AppStackNavigator);
