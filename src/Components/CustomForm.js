import React from "react";
import {Button, Keyboard, View, StyleSheet, TextInput} from "react-native";
import {login} from "../../API/Api";

export default class CustomForm extends React.Component {
    state = {
        email: '',
        password: ''
    };

    _updateEmail = (text) => {
        this.setState({email: text})
    };

    _updatePassword = (text) => {
        this.setState({password: text})
    };

    _submitAction = () => {

        if (!this.state.email.length)
            console.log("error, empty email / login");
        else if (!this.state.password.length)
            console.log("error, empty password");
        else {
            if (this.props.type === "Sign Up"){
                alert("Sign Up TODO");
            }
            else if (this.props.type === "Sign In") {
                login(this.state.email, this.state.password);
            }
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    onChangeText={this._updateEmail}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    keyboard-type={"email-address"}
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