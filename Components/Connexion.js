import React from 'react'
import {Image, StyleSheet, View, Text} from "react-native";

class Connexion extends React.Component {
    render(){
        return (
            <View style = {styles.splashScreen}>
                <Text>Veuillez vous connecter</Text>
                <Image
                    style= {styles.mainIcon}
                    source={require('../assets/deezer-png-300.png')}
                />
                <Text>Pas encore de compte ?</Text><Text onPress = {() => {this.props.navigation.navigate("Inscription")}}> Inscrivez-vous !</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    splashScreen:{
        flex:1,
        alignItems: "center",
        justifyContent: "center"
    },
    mainIcon:{
        width: 150,
        height:150,
    }
});

export default Connexion