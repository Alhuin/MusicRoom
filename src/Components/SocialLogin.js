import {View, StyleSheet} from "react-native";
import SocialButton from "rtg-rn-social-buttons";
import React, {Component} from "react";

export default class SocialLogin extends Component {
    render() {
        return (
            <View style={styles.container}>
                <SocialButton type='facebook' text= {`${this.props.type} With Facebook`} opacity={0.5} height={40}
                              width={220} action={() => {
                    alert(`facebook ${this.props.type}`)
                }}/>
                <SocialButton type='google' text= {`${this.props.type} With Google`} opacity={0.5} height={40}
                              width={220} action={() => {
                    alert(`google ${this.props.type}`)
                }}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection:'column',
        justifyContent: 'center',
        alignItems:'center',
        // borderWidth:1,
        // borderColor:'orange',
    }
});