import React from 'react';
// import PropTypes from 'prop-types';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import {Languages, Constants} from '../../common';

class AttributesView extends React.PureComponent {
  render() {
    if (this.props.attributes.length > 0) {
      var attributes = [];
      for (var i = 0; i < this.props.attributes.length; i++) {
        attributes.push(
          <View
            key={i}
            style={[
              styles.row,
              Constants.RTL && {flexDirection: 'row-reverse'},
            ]}>
            <View style={styles.lbContainer}>
              <Text style={styles.label}>{this.props.attributes[i].name}</Text>
            </View>

            <View style={styles.lbValue}>
              <Text style={styles.value}>
                {this.props.attributes[i].options.toString()}
              </Text>
            </View>
          </View>,
        );
      }
      return <View style={styles.container}>{attributes}</View>;
    } else {
      return (
        <View style={styles.emptyAttributes}>
          <Text>{Languages.EmptyProductAttribute}</Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
  },
  row: {
    flexDirection: 'row',
    minHeight: 50,
  },
  lbContainer: {
    flex: 0.25,
    justifyContent: 'center',
    borderRightWidth: 0.5,
    borderRightColor: '#CED7DD',
    backgroundColor: 'rgba(255,255,255,1)',
  },
  lbValue: {
    flex: 0.75,
    justifyContent: 'center',
  },
  label: {
    margin: 5,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
    fontFamily: Constants.fontFamily,
  },
  value: {
    margin: 5,
    fontFamily: Constants.fontFamily,
    marginLeft: 10,
    color: '#5B5B5B',
    fontSize: 13,
    backgroundColor: 'rgba(255,255,255,1)',
  },
  emptyAttributes: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(255,255,255,1)',
  },
});

export default AttributesView;
