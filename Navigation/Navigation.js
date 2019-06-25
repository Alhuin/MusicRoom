import { createStackNavigator, createAppContainer } from "react-navigation";
import Connexion from '../Components/Connexion'
import Inscription from '../Components/Inscription'
import Home from '../Components/Home'

const AppStackNavigator = createStackNavigator({
    Inscription: {
        screen: Inscription,
        navigationOptions: {
            title: 'Inscription'
        }
    },
    Connection: {
        screen: Connexion,
        navigationOptions: {
            title: 'Connexion'
        }
    },
    Home: {
        screen: Home,
        navigationOptions: {
            title: 'Accueil'
        }
    }
});

export default createAppContainer(AppStackNavigator)