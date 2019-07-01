import React from "react";
import {Button, Keyboard, View, StyleSheet, TextInput} from "react-native";
import {login, addUser} from "../../API/Api";

export default class CustomForm extends React.Component {
    state = {
        email: '',
        password: '',
        confirmPassword: '',
        login: '',
        name: '',
        familyName: '',
    };

    _updateLogin = (text) => {
        this.setState({login: text})
    };

    _updatePassword = (text) => {
        this.setState({password: text})
    };

    _updateConfirmPassword = (text) => {
        this.setState({confirmPassword: text})
    };

    _updateName = (text) => {
        this.setState({name: text})
    };

    _updateFamilyName = (text) => {
        this.setState({familyName: text})
    };

    _updateEmail = (text) => {
        this.setState({email: text})
    };

    _submitAction = () => {

        const userName = this.state.login;
        const password = this.state.password;

        if (!(userName.length && password.length)) {
            console.log("error, empty field");
        }
        else {
            if (this.props.type === "Sign Up") {

                const name = this.state.name;
                const familyName = this.state.familyName;
                const email = this.state.email;
                const confirmPassword = this.state.confirmPassword;

                if (!(name.length && familyName.length && email.length && confirmPassword.length)) {
                    console.log("error, empty field");
                }
                else {
                    if (password !== confirmPassword) {
                        console.log("error, passwords don't match");
                    }
                    else {
                        addUser(userName, password, name, familyName, email);
                    }

                }

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
        let passwordConfirmInput = null;

        if (this.props.type === "Sign Up") {
            passwordConfirmInput = <TextInput
                onChangeText={this._updateConfirmPassword}
                underlineColorAndroid={"grey"}
                secureTextEntry={true}
                style={styles.inputBox}
                placeholder={"Confirm password"}/>;
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
                {passwordConfirmInput}
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
        paddingVertical: 20,
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