import { createStackNavigator, createAppContainer } from "react-navigation";
import Connexion from '../Pages/Connexion'
import Home from '../Pages/Home'

const AppStackNavigator = createStackNavigator({
    Connexion: {
        screen: Connexion,
        navigationOptions:{
            header: null,
        }
    },
    Home: {
        screen: Home
    }
});

export default createAppContainer(AppStackNavigator)