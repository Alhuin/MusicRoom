import { createStackNavigator, createAppContainer } from 'react-navigation';
import Connexion from '../Pages/Connexion';
import Home from '../Pages/Home';
import SendTokens from '../Pages/SendTokens';
import UpdatePassword from '../Pages/UpdatePass';

const AppStackNavigator = createStackNavigator({
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
  UpdatePassword: {
    screen: UpdatePassword,
    navigationOptions: {
      header: null,
    },
  },
});

export default createAppContainer(AppStackNavigator);
