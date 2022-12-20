import React, { PureComponent } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";

export default class Note extends PureComponent {
  render() {
    return (
      <View style={style.note}>
        <Text style={this.props.go == 'check' ? style.nameGreen : style.nameRed}>{this.props.name[0]}</Text>
        <Text style={this.props.go == 'check' ? style.octaveGreen : style.octaveRed}>{this.props.octave}</Text>
        <Text style={style.sharp}>{this.props.name[1]}</Text>
      </View>
    );
  }
}

const style = StyleSheet.create({
  note: {
    width: 110,
    height: 146,
    marginBottom: 10,
  },
  nameGreen: {
    fontSize: 128,
    fontWeight: "600",
    color: "#228B22",
    flexDirection: "row",
  },
  nameRed: {
    fontSize: 128,
    fontWeight: "600",
    color: "#c62828",
    flexDirection: "row",
  },
  sharp: {
    fontSize: 32,
    color: "#c62828",
    position: "absolute",
    right: 0,
    top: 32,
    ...Platform.select({
      ios: {
        top: 10,
        fontSize: 48,
      },
    }),
  },
  octaveRed: {
    fontSize: 32,
    color: "#c62828",
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  octaveGreen: {
    fontSize: 32,
    color: "#228B22",
    position: "absolute",
    right: 0,
    bottom: 0,
  },
});
