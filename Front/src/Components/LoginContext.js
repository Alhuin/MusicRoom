import {TouchableOpacity, View, StyleSheet} from "react-native";
import {Text} from "native-base";
import React, {Component} from "react";


export default class LoginContext extends Component {

    render() {

        let contextText;
        let other;

        if (this.props.type === "Sign Up") {
            contextText = <Text style={styles.contextText}>Already have an account ?</Text>;
            other = "Sign In";
        } else {
            contextText = <Text style={styles.contextText}>Don't have an account yet ?</Text>;
            other = "Sign Up";
        }

        return (
            <View style={styles.container}>
                {contextText}
                <TouchableOpacity onPress={this.props.changePage}>
                    <Text style={styles.contextLink}> {other} !</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingVertical: 10,
        // borderWidth:1,
        // borderColor:'purple',
    },
    contextText: {},
    contextLink: {
        fontWeight: 'bold',
    }
});
