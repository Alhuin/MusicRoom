import React from 'react'
import {StyleSheet, KeyboardAvoidingView, Platform, ScrollView, View} from "react-native";

import Components from '../Components'
import Connexion from "./Connexion";

class ForgotPass extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            type: "Forgot Pass",
        }
    }

    render() {

        const type = this.state.type;

        return (
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : null}
                keyboardVerticalOffset={100}>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow:1}}>
                    <View style={styles.content}>
                        <Components.Logo/>
                        <Components.Forgot type={type}/>
                    </View>
                </ScrollView>
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
        // borderColor:'blue',

    },
    scrollView:{
        width: '100%',
        // borderWidth:1,
        // borderColor:'red'
    },
    content:{
        flex:1,
        // flexDirection:'column',
        alignItems: 'center',
        justifyContent:'space-between',
        // borderWidth:1,
        // borderColor:'green'
    },
});

export default Connexion