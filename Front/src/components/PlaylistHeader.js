import React, { Dimensions, Animated, StyleSheet } from 'react-native';

export default class PlaylistHeader extends React.Component {
  constructor(props) {
    super(props);
    this.offset = 0;

    this.state = {
      scrollOffset: new Animated.Value(0),
      titleWidth: 0,
    };
  }

  render() {
    const screenWidth = Dimensions.get('window').width;
    const { scrollOffset, titleWidth } = this.state;

    return (
      <Animated.View
        style={[
          styles.header,
          {
            paddingHorizontal: screenWidth * 0.05,
            width: screenWidth,
            height: scrollOffset.interpolate({
              inputRange: [0, 200],
              outputRange: [120, 64],
              extrapolate: 'clamp',
            }),
          },
        ]}
      >
        <Animated.Text
          onLayout={(e) => {
            if (this.offset === 0 && titleWidth === 0) {
              const newTitleWidth = e.nativeEvent.layout.width;
              this.setState({ titleWidth: newTitleWidth });
            }
          }}
          style={{
            fontWeight: 'bold',
            fontSize: scrollOffset.interpolate({
              inputRange: [0, 200],
              outputRange: [26, 20],
              extrapolate: 'clamp',
            }),
          }}
        >
          Header Title Here
        </Animated.Text>
        <Animated.View
          style={{
            width: scrollOffset.interpolate({
              inputRange: [0, 200],
              outputRange: [screenWidth * 0.9 - titleWidth, 0],
              extrapolate: 'clamp',
            }),
          }}
        />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'whitesmoke',
    borderBottomWidth: 1,
    borderColor: 'gainsboro',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: 8,
  },
});
