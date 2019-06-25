import React from 'react'
import {Image, StyleSheet, View, Text, TextInput} from "react-native";
var FBLoginButton = require('./FBLoginButton');

class Inscription extends React.Component {
    render(){
        return (
            <View style = {styles.mainContainer}>
                <View style={styles.titleContainer}>
                    <Image
                    style= {styles.mainIcon}
                    source={require('../assets/deezer-png-300.png')}
                    />
                    <Text style = {styles.title}>MusicRoom</Text>
                </View>
                <View style={styles.loginContainer}>
                    <TextInput placeholder = "email"/>
                    <TextInput placeholder = "password"  secureTextEntry={true}/>
                </View>
                <View style={styles.oAuthContainer}>
                    <FBLoginButton/>
                </View>
            </View>
    )}
}

const styles = StyleSheet.create({

    mainContainer:{
        paddingTop:75,
        paddingBottom:200,
        flex:1,
        alignItems: "center",
        justifyContent: "space-around",
        borderWidth: 1,
        borderColor: "red",
        borderStyle: "solid"
    },
    titleContainer:{
        width: "100%",
        flexDirection:"row",
        justifyContent: "space-around",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "black",
        borderStyle: "solid"
    },
    title:{
        fontSize: 20,
        fontWeight: "bold"
    },
    mainIcon: {
        width: 100,
        height: 100,
    },
    loginContainer: {
        padding: 50,
        alignItems: "center",
        width: "100%",
        borderWidth: 1,
        borderColor: "blue",
        borderStyle: "solid"
    },
    oAuthContainer:{
        width: "100%",
        padding: 50,
        height: 100,
        borderWidth: 1,
        borderColor: "orange",
        borderStyle: "solid"
    }
});

export default Inscription