import {Platform} from "react-native"
import { createStackNavigator, createAppContainer } from "react-navigation";
import Connexion from '../Components/Connexion'
import Inscription from '../Components/Inscription'
import Home from '../Components/Home'
import Test from '../Components/test'

const AppStackNavigator = createStackNavigator({
    Inscription: {
        screen: Inscription
    },
    Connexion: {
        screen: Connexion
    },
    Home: {
        screen: Home
    }
});

export default createAppContainer(AppStackNavigator)