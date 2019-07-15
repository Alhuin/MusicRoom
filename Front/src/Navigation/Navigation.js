import { createStackNavigator, createAppContainer } from 'react-navigation';
import Connexion from '../Pages/Connexion';
import Home from '../Pages/Home';
import SendTokens from '../Pages/SendTokens';
import UpdatePass from '../Pages/UpdatePass';

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
  UpdatePass: {
    screen: UpdatePass,
    header: null,
  },
});

export default createAppContainer(AppStackNavigator);
