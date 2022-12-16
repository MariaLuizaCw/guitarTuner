
import React, { PureComponent } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

const Notebtn = () =>  {
    const [selection, setSelection] = React.useState('C');

    const noteStrings = [
      "C",
      "C♯",
      "D",
      "D♯",
      "E",
      "F",
      "F♯",
      "G",
      "G♯",
      "A",
      "A♯",
      "B",
    ];

  const btns = []

	for(let i = 0; i < noteStrings.length; i++){
		btns.push(
      <TouchableOpacity  key = {i} style={[styles.btn, selection === noteStrings[i] ? { backgroundColor: "#6B7280" } : null]} onPress={() => setSelection(noteStrings[i])}>
        <Text style={[styles.btnText, selection === noteStrings[i] ? { color: "white" } : null]}>{noteStrings[i]}</Text>
      </TouchableOpacity>
		)
	}
    return (
      <View>

        <View style={styles.btnGroup}>
          {btns}
        </View>
      </View>
    )
  }

const styles = StyleSheet.create({
  btnGroup: {
    flexDirection: 'row',
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: '#6B7280'
  },

  btn: {
      flex: 1,
      borderRightWidth: 0.25,
      borderLeftWidth: 0.25,
      borderColor: '#6B7280'
  },
  btnText: {
      textAlign: 'center',
      paddingVertical: 16,
      fontSize: 14
  }
});

export default Notebtn;
