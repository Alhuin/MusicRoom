import { createStackNavigator, createAppContainer } from 'react-navigation';
import Connexion from '../Pages/Connexion';
import Home from '../Pages/Home';
import SendTokens from '../Pages/SendTokens';

const AppStackNavigator = createStackNavigator({
  Connexion: {
    screen: Connexion,
    navigationOptions: {
      header: null,
    },
  },
  Home: {
    screen: Home,
  },
  SendTokens: {
    screen: SendTokens,
    header: null,
  },
});

export default createAppContainer(AppStackNavigator);
