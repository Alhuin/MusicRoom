import React from 'react'
import {Image, StyleSheet, View, Text, TextInput, TouchableOpacity} from "react-native";
import SocialButton from "rtg-rn-social-buttons";

class Inscription extends React.Component {
    state = {
        email: '',
        password: ''
    };

    _updateEmail = (text) => {
        this.setState({ email: text })
    };

    _updatePassword = (text) => {
        this.setState({ password: text })
    };

    _login = () => {
        alert('email: ' + this.state.email + ' password: ' + this.state.password)
    };

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
                    <Text>Sign in with email</Text>
                    <TextInput style={styles.input}
                               placeholder = "email"
                               underlineColorAndroid = "transparent"
                               placeholderTextColor = "#9a73ef"
                               autoCapitalize = "none"
                               onChangeText = {this._updateEmail} />
                    <TextInput style={styles.input}
                               placeholder = "password"
                               secureTextEntry={true}
                               underlineColorAndroid = "transparent"
                               placeholderTextColor = "#9a73ef"
                               autoCapitalize = "none"
                               onChangeText = {this._updatePassword}/>
                    <TouchableOpacity
                        style = {styles.submitButton}
                        onPress = {() => this._login()}>
                        <Text style = {styles.submitButtonText}> Submit </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.oAuthContainer}>
                    <Text>or</Text>
                    <SocialButton type='facebook' text='Sign In With Facebook' opacity={0.5} height={40} width={220} action={()=>{alert("facebook login")}}/>
                    <SocialButton type='google' text='Sign In With Google' opacity={0.5} height={40} width={220} action={()=>{alert("google login")}}/>
                </View>
            </View>
    )}
}

const styles = StyleSheet.create({

    mainContainer:{
        paddingTop:150,
        paddingBottom:200,
        flex:1,
        alignItems: "center",
        justifyContent: "space-around",
        // borderWidth: 1,
        // borderColor: "red",
        // borderStyle: "solid"
    },
    titleContainer:{
        marginBottom: "10%",
        width: "100%",
        flexDirection:"row",
        justifyContent: "space-around",
        alignItems: "center",
        // borderWidth: 1,
        // borderColor: "black",
        // borderStyle: "solid"
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
        marginTop: "50%",
        alignItems: "center",
        width: "100%",
        // borderWidth: 1,
        // borderColor: "blue",
        // borderStyle: "solid"
    },
    input: {
        paddingLeft:"10%",
        margin: 15,
        height: 40,
        borderColor: 'grey',
        borderWidth: 1,
        width:"80%"
    },
    oAuthContainer:{
        marginTop: "50%",
        // justifyContent: "center",
        alignItems: "center",
        width: "100%",
        // borderWidth: 1,
        // borderColor: "orange",
        // borderStyle: "solid"
    },
    submitButton: {
        backgroundColor: '#7a42f4',
        padding: 10,
        margin: 15,
        height: 40,
    },
    submitButtonText:{
        color: 'white'
    }
});

export default Inscription