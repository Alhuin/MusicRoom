import { createStackNavigator, createAppContainer } from "react-navigation";
import Connexion from '../Pages/Connexion'
import Home from '../Pages/Home'
import ForgotPassW from '../Pages/ForgotPassW'

const AppStackNavigator = createStackNavigator({
    Connexion: {
        screen: Connexion,
        navigationOptions:{
            header: null,
        }
    },
    Home: {
        screen: Home
    },
    ForgotPassW: {
        screen: ForgotPassW
    }
});

export default createAppContainer(AppStackNavigator)