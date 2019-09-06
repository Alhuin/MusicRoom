import {
  FlatList, RefreshControl, StyleSheet, Text,
} from 'react-native';
import React from 'react';

class AdminListInSettings extends React.Component {
  render() {
    const {
      admins,
      refreshing,
      onRefresh,
    } = this.props;
    return (
      <FlatList
        data={admins}
        keyExtractor={item => item._id.toString()}
        renderItem={
          ({ item }) => (
            <Text
              style={styles.title}
            >
              {item.name}
            </Text>
          )
        }
        refreshControl={(
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )
        }
        contentContainerStyle={{ paddingBottom: 80 }}
        style={styles.list}
      />
    );
  }
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: '#000000',
  },
  title: {
    backgroundColor: '#888888',
    padding: 10,
    margin: 5,
  },
});

export default AdminListInSettings;
