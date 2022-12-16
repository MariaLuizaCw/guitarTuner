import React, { Component } from "react";
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
import {
  View,
  Button,
  Picker,
  Text,
  StatusBar,
  StyleSheet,
  PermissionsAndroid,
  TouchableOpacity
} from "react-native";
import Tuner from "./tuner";
import Note from "./note";
import Meter from "./meter";
import Notebtn from './noteBtn'

export default class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      note: {
        name: "A",
        octave: 4,
        frequency: 440,
      },
      selectedNote: {
        name: "A",
        octave: 4,
        frequency: 440
      }
    }
    this.map = {
      'C': [16.351,
        32.703,
        65.406,
        130.813,
        261.626,
        523.251,
        1046.502,
        2093.005,
        4186.009,
        8372.018],
      'C#': [17.324,
        34.648,
        69.296,
        138.591,
        277.183,
        554.365,
        1108.731,
        2217.461,
        4434.922,
        8869.844],
      'D': [18.354,
        36.708,
        73.416,
        146.832,
        293.665,
        587.33,
        1174.659,
        2349.318,
        4698.636,
        9397.272],
      'D#': [19.445,
        38.891,
        77.782,
        155.563,
        311.127,
        622.254,
        1244.508,
        2489.016,
        4978.032,
        9956.064],
      'E': [20.601,
        41.203,
        82.407,
        164.814,
        329.628,
        659.255,
        1318.51,
        2637.021,
        5274.042,
        10548.084],
      'F': [21.827,
        43.654,
        87.307,
        174.614,
        349.228,
        698.456,
        1396.913,
        2793.826,
        5587.652,
        11175.304],
      'F#': [23.124,
        46.249,
        92.499,
        184.997,
        369.994,
        739.989,
        1479.978,
        2959.955,
        5919.91,
        11839.82],
      'G': [24.499,
        48.999,
        97.999,
        195.998,
        391.995,
        783.991,
        1567.982,
        3135.964,
        6271.928,
        12543.856],
      'G#': [25.956,
        51.913,
        103.826,
        207.652,
        415.305,
        830.609,
        1661.219,
        3322.438,
        6644.876,
        13289.752],
      'A': [27.5,
        55.0,
        110.0,
        220.0,
        440.0,
        880.0,
        1760.0,
        3520.0,
        7040.0,
        14080.0],
      'A#': [29.135,
        58.27,
        116.541,
        233.082,
        466.164,
        932.328,
        1864.655,
        3729.31,
        7458.62,
        14917.24],
      'B': [30.868,
        61.735,
        123.471,
        246.942,
        493.883,
        987.767,
        1975.533,
        3951.066,
        7902.132,
        15804.264]
    }
  };
  _generatePicker(){

  }
  _generateBtns() {
    const noteStrings = [
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
      "A",
      "A#",
      "B",
    ];
    const btns = []

    for (let i = 0; i < noteStrings.length; i++) {

      btns.push(
        <TouchableOpacity key={i} style={[style.btn, this.state.selectedNote.name == noteStrings[i] ? { backgroundColor: "#6B7280" } : null]} onPress={() => this._setSelectedNote(noteStrings[i])}>
          <Text style={[style.btnText, this.state.selectedNote.name == noteStrings[i] ? { color: "white" } : null]}>{noteStrings[i]}</Text>
        </TouchableOpacity>
      )
    }
    return btns
  }
  _setSelectedNote(selection) {
    oct = this.state.selectedNote.octave
    
   
    this.setState({ ...this.state, selectedNote: {
      name:  selection,
      frequency: this.map[`${selection}`][oct],
      octave: oct
      }})
    
  }
  _update(note) {
    this.setState({ ...this.state, note });
    console.log(this.state.selectedNote.frequency)
    console.log(this.state.selectedNote.frequency - this.state.note.frequency)

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
  _encrementOctave(){
    oct = this.state.selectedNote.octave
    if (oct >= 8){
      return
    }


    this.setState({ ...this.state, selectedNote: {
      name:  this.state.selectedNote.name,
      frequency: this.map[`${this.state.selectedNote.name}`][oct+1],
      octave: oct+1
      }})
    
  
  }
  
  _dencrementOctave(){
    oct = this.state.selectedNote.octave
    if (oct <= 0){
      return
    }
    
    this.setState({ ...this.state, selectedNote: {
      name:  this.state.selectedNote.name,
      frequency: this.map[`${this.state.selectedNote.name}`][oct-1],
      octave: oct-1
    }})
     
  }
  _generateOctaves(){
    const btns = []

    for (let i = 0; i < 9; i++) {

      btns.push(
        <TouchableOpacity key={i} style={[style.btn, this.state.selectedNote.octave == i ? { backgroundColor: "#6B7280" } : null]} onPress={() => this._setSelectedNote(noteStrings[i])}>
          <Text style={[style.btnText, this.state.selectedNote.octave == i ? { color: "white" } : null]}>{i}</Text>
        </TouchableOpacity>
      )
    }
    return btns
  }
  render() {
    return (
      <View style={style.body}>
      
        <StatusBar backgroundColor="#000" translucent />
        <Meter cents={this.state.note.cents} />
        <Note {...this.state.note} />
        <Text style={style.frequency}>
          {this.state.note.frequency.toFixed(1)} Hz
        </Text>
        <View style={style.plusminus}>
          <TouchableOpacity style={[style.btnplusminus]} onPress={() => this._encrementOctave()}>
            <Text style={[style.btnTextplusminus]}>+</Text>
          </TouchableOpacity>
          <View>
          <Text style={[style.btnText]}>Octave: {this.state.selectedNote.octave}</Text>
          </View>
          
          <TouchableOpacity style={[style.btnplusminus]} onPress={() => this._dencrementOctave()}>
            <Text style={[style.btnTextplusminus]}>-</Text>
          </TouchableOpacity>
        </View>
        <View style={style.btnGroup}>
          {this._generateBtns()}
        </View>
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
  plusminus: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-around",
    height: '10%',
    width: '100%',

    marginTop: 50
  },
  btnGroup: {
    flexDirection: 'row',
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: '#6B7280',
    position: "absolute",
    bottom: 0,
    left: 0
  },
  btnTextplusminus:{
    color: 'white',
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: 14
  },  
  btnplusminus: {
    height: 40,
    width: 40,
    borderRadius: 10,
    backgroundColor: "#6B7280",
    color: 'white'
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
  },
  frequency: {
    fontSize: 28,
    color: "#37474f",
  },
});
