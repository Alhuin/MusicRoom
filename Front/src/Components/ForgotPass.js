import React from 'react'
import {StyleSheet, View, TextInput, Button, Keyboard} from "react-native";
import {findUserByLoginOrEmail} from "../../API/Api";

export default class ForgotPass extends React.Component {
    state = {
        email: '',
        login: '',

    };

    _updateLogin = (text) => {
        this.setState({login: text})
    };


    _submitAction = () => {
        const userName = this.state.login;

        if (!userName.length) {
            alert("Please enter your email or login");
        }
        else
        {
            //Appel controlleur pour verfier login/email?
            //si on passe
            // /!\ Je ne suis pas sur de l'utilisation de l'API LOL la fonction si dessous a ete rajouter dans API front et est nomé pareil que
            //dans back user service
            findUserByLoginOrEmail(userName);
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    onChangeText={this._updateLogin}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    underlineColorAndroid={"grey"}
                    style={styles.inputBox}
                    placeholder={"Login or email"}
                />
                <View style={styles.submitButton}>
                    <Button
                        title={"Send email"}
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
    },
    inputBox: {
        width: 300,
    },
    submitButton: {
        width: 150,
    }
});
