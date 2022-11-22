import React, { Component } from "react";
import {
  View,
  Button,
  Text,
  StatusBar,
  StyleSheet,
  PermissionsAndroid,
} from "react-native";
import Tuner from "./tuner";
import Note from "./note";
import Meter from "./meter";

export default class Main extends Component {

  constructor(props){
    super(props);
    this.state = {
      note: {
        name: "A",
        octave: 4,
        frequency: 440,
      },
    };
  } 


  _update(note) {
    this.setState({ note });
  }

  onPressStartTunning(){
   

    console.log('cliquei em start')
    this.state.tuner.start();
    // this.tuner.onNoteDetected = (note) => {
    //   if (this._lastNoteName === note.name) {
    //     this._update(note);
    //   } else {
    //     this._lastNoteName = note.name;
    //   }
    // };
  }
  onPressStopTunning(){
    this.state.tuner.stop();
  }

  async componentDidMount() {
    if (Platform.OS === "android") {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
    }
    
    const tuner = new Tuner();
    tuner.onNoteDetected = (note) => {
      if (this._lastNoteName === note.name) {
        this._update(note);
      } else {
        this._lastNoteName = note.name;
      }
    };
    tuner.start();
  }

  render() {
    return (
      <View style={style.body}>
        <Text>Teste</Text>
        <StatusBar backgroundColor="#000" translucent />
        <Meter cents={this.state.note.cents} />
        <Note {...this.state.note} />
        <Text style={style.frequency}>
          {this.state.note.frequency.toFixed(1)} Hz
        </Text>
        {/* <Button
          onPress={this.onPressStartTunning}
          title="Start"
          color="#841584"
        />
        <Button
          onPress={this.onPressStopTunning}
          title="Stop"
          color="#413444"
        /> */}
      </View>
    );
  }
}

const style = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  frequency: {
    fontSize: 28,
    color: "#37474f",
  },
});
