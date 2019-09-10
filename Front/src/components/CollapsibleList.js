import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import React from 'react';
import Collapsible from 'react-native-collapsible';

class CollapsibleList extends React.Component {
  state = {
    collapsed: true,
  };

  toggleExpanded = () => {
    const { collapsed } = this.state;
    this.setState({ collapsed: !collapsed });
  };

  render() {
    const { collapsed } = this.state;
    const { title, children } = this.props;
    const rendering = (
      <View>
        <TouchableOpacity onPress={this.toggleExpanded}>
          <View style={styles.header}>
            <Text style={styles.headerText}>{title}</Text>
          </View>
        </TouchableOpacity>
        <Collapsible
          collapsed={collapsed}
          align="center"
        >
          {children}
        </Collapsible>
      </View>
    );
    return (rendering);
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CollapsibleList;
