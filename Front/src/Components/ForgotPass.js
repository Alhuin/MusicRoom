import React from 'react'
import {StyleSheet, View, TextInput, Button} from "react-native";

export default class ForgotPass extends React.Component {
    state = {
        email: '',
        login: '',

    };

    _updateLogin = (text) => {
        this.setState({login: text})
    };


    _submitAction = () => {
        alert("coucou");
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
                    placeholder={"Login"}
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
