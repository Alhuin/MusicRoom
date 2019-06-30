import React from 'react'
import {StyleSheet, View, TouchableOpacity, KeyboardAvoidingView} from "react-native";
import {Text} from "native-base";

import CustomForm from '../Components/CustomForm'
import Logo from '../Components/Logo'
import SocialLogin from '../Components/SocialLogin'

class Connexion extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            type: "Sign Up",
        }
    }

    _changePage = () => {
        if (this.state.type === 'Sign Up') {
            this.setState({type: 'Sign In'});
        } else {
            this.setState({type: 'Sign Up'});
        }
    };

    render() {

        const type = this.state.type;
        let text;
        let other;

        if (type === "Sign Up"){
            text = <Text style={styles.contextText}>Already have an account ?</Text>;
            other = "Sign In";
        } else {
            text = <Text style={styles.contextText}>Don't have an account yet ?</Text>;
            other = "Sign Up";
        }

        return (
            <KeyboardAvoidingView style={styles.container} behavior={"height"}>

                <Logo/>

                <CustomForm type={type}/>

                <SocialLogin type={type}/>

                <View style={styles.context}>
                    {text}
                    <TouchableOpacity onPress={this._changePage}>
                        <Text style={styles.contextLink}> {other} !</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:"center",
        justifyContent: "center",
    },
    context:{
        flexGrow:1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingVertical: 16,
        flexDirection: 'row',
    },
    contextText: {

    },
    contextLink:{
        fontWeight: 'bold',
    }

});

export default Connexion