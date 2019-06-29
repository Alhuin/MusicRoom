import React from 'react'
import {Image, StyleSheet, View, Button, KeyboardAvoidingView, Keyboard} from "react-native";
import SocialButton from "rtg-rn-social-buttons";
import {Container, Header, Content, Form, Item as FormItem, Input, Text, Label} from 'native-base';
import {API_login} from '../API/Api'


class Inscription extends React.Component {
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

    _login = () => {
        alert('email: ' + this.state.email + ' password: ' + this.state.password)
    };

    render() {
        return (
            <Container>
                <Header
                    style={{display:"none"}}
                    androidStatusBarColor="black">
                </Header>
                <Content padder contentContainerStyle={{
                    height: "100%",
                    justifyContent: "space-around",
                    paddingBottom: "0%"}}>
                    <KeyboardAvoidingView behavior="padding" enabled>
                        <View style={{
                            alignItems: "center",
                            padding: 30,
                            marginBottom:"5%"
                        }}>
                            <Image
                                style={styles.mainIcon}
                                source={require('../assets/deezer-png-300.png')}
                            />
                            <Text style={styles.title}>MusicRoom</Text>
                        </View>
                        <Text style={{
                            width: "100%",
                            textAlign: "center"}}>
                            Veuillez vous inscrire.
                        </Text>
                        <View style={{marginBottom: "15%"}}>
                            <Form style={{marginBottom:"5%"}}>
                                <FormItem floatingLabel>
                                    <Label>Email</Label>
                                    <Input
                                        onChangeText={this._updateEmail}
                                        autoCorrect={false}
                                        autoCapitalize={'none'}
                                        keyboard-type={"email-address"}
                                        underlineColorAndroid={"transparent"}/>
                                </FormItem>
                                <FormItem floatingLabel last>
                                    <Label>Password</Label>
                                    <Input
                                        onChangeText={this._updatePassword}
                                        secureTextEntry={true}/>
                                </FormItem>
                            </Form>
                            <Button
                                title='Sign Up'
                                onPress={() => {
                                    Keyboard.dismiss();
                                    API_login();
                                    // this.props.navigation.navigate("Home")
                                }}
                                style={{marginTop:"200%"}}
                            />
                        </View>
                        <View style={{flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                            <SocialButton type='facebook' text='Sign Up With Facebook' opacity={0.5} height={40}
                                          width={220} action={() => {
                                alert("facebook login")
                            }}/>
                            <SocialButton type='google' text='Sign Up With Google' opacity={0.5} height={40}
                                          width={220} action={() => {
                                alert("google login")
                            }}/>
                        </View>
                    </KeyboardAvoidingView>
                </Content>
            </Container>
        )
    }
}

const styles = StyleSheet.create({

    title: {
        fontSize: 20,
        fontWeight: "bold"
    },
    mainIcon: {
        width: 100,
        height: 100,
    }
});

export default Inscription