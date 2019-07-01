import React from 'react'
import {StyleSheet, KeyboardAvoidingView} from "react-native";

import Components from '../Components'

class Connexion extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            type: "Sign Up",
        }
    }

    changePage = () => {
        if (this.state.type === 'Sign Up') {
            this.setState({type: 'Sign In'});
        } else {
            this.setState({type: 'Sign Up'});
        }
    };

    render() {

        const type = this.state.type;

        return (
            <KeyboardAvoidingView style={styles.container} behavior="height">

                <Components.Logo/>

                <Components.CustomForm type={type}/>

                <Components.SocialLogin type={type}/>

                <Components.LoginContext type={type} changePage={this.changePage}/>

            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:"center",
        justifyContent: "center",
        // borderWidth:1,
        // borderColor:'red',

    }
});

export default Connexion