import React from 'react'
import {Image, StyleSheet, View, Text, TextInput} from "react-native";

class Inscription extends React.Component {
    render(){
        return (
            <View style = {styles.mainContainer}>
            <Text>Veuillez créer un compte</Text>
        <Image
        style= {styles.mainIcon}
        source={require('../assets/deezer-png-300.png')}
        />
        <TextInput placeholder = "email"/>
            <TextInput placeholder = "password"  secureTextEntry={true}/>
        </View>
    )
    }
}

const styles = StyleSheet.create({

    mainContainer:{
        flex:1,
        alignItems: "center",
        justifyContent: "center"
    },
    mainIcon:{
        width: 150,
        height:150,
    }
});

export default Inscription