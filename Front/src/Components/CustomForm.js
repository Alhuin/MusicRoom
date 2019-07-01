import React from "react";
import {Button, Keyboard, View, StyleSheet, TextInput} from "react-native";
import {login} from "../../API/Api";

export default class CustomForm extends React.Component {
    state = {
        email: '',
        password: '',
        login: '',
        name: '',
        familyName: '',
    };

    _updateEmail = (text) => {
        this.setState({email: text})
    };

    _updatePassword = (text) => {
        this.setState({password: text})
    };

    _updateName = (text) => {
        this.setState({name: text})
    };

    _updateFamilyName = (text) => {
        this.setState({familyName: text})
    };

    _updateLogin = (text) => {
        this.setState({login: text})
    };

    _submitAction = () => {

        if (!this.state.login.length)
            console.log("error, empty login");
        else if (!this.state.password.length)
            console.log("error, empty password");
        else {
            if (this.props.type === "Sign Up"){
                alert("Sign Up TODO");
            }
            else if (this.props.type === "Sign In") {
                login(this.state.login, this.state.password);
            }
        }
    };

    render() {

        let nameInput = null;
        let familyNameInput = null;
        let emailInput = null;

        if (this.props.type === "Sign Up"){
            nameInput = <TextInput
                onChangeText={this._updateName}
                autoCorrect={false}
                underlineColorAndroid={"grey"}
                style={styles.inputBox}
                placeholder={"Name"}/>;
            familyNameInput = <TextInput
                onChangeText={this._updateFamilyName}
                autoCorrect={false}
                underlineColorAndroid={"grey"}
                style={styles.inputBox}
                placeholder={"Family Name"}/>;
            emailInput = <TextInput
                onChangeText={this._updateEmail}
                autoCorrect={false}
                autoCapitalize={'none'}
                keyboard-type={"email-address"}
                underlineColorAndroid={"grey"}
                style={styles.inputBox}
                placeholder={"Email"}/>;
        }

        return (
            <View style={styles.container}>
                <TextInput
                    onChangeText={this._updateLogin}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    underlineColorAndroid={"grey"}
                    style={styles.inputBox}
                    placeholder={"Login"}
                />
                <TextInput
                    onChangeText={this._updatePassword}
                    underlineColorAndroid={"grey"}
                    style={styles.inputBox}
                    placeholder={"Password"}
                    secureTextEntry={true}
                />
                {nameInput}
                {familyNameInput}
                {emailInput}
                <View style={styles.submitButton}>
                    <Button
                        title={this.props.type}
                        onPress={() => {
                            Keyboard.dismiss();
                            this._submitAction();
                        }}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical:20,
            width: 300,
            // borderWidth:1,
            // borderColor:'yellow',
        },
        inputBox: {
            width: 300,
        },
        submitButton: {
            width: 150,
        }
    });