import Recording from "react-native-recording";
import PitchFinder from "pitchfinder";
import HPS from './tuner_hps.js'
export default class Tuner {
  middleA = 440;
  semitone = 69;
  noteStrings = [
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

  constructor(sampleRate = 8000, bufferSize = 512) {
    this.sampleRate = sampleRate;
    this.bufferSize = bufferSize;
    
    this.pitchFinder = new PitchFinder.YIN({ sampleRate: this.sampleRate });
  }

  start() {
    // this.HPS = new HPS(SAMPLE_FREQ = this.sampleRate, WINDOW_SIZE = this.bufferSize, WINDOW_STEP = this.bufferSize/4, NUM_HPS=4)
    Recording.init({
      sampleRate: this.sampleRate,
      bufferSize: this.bufferSize,
    });
    Recording.addRecordingEventListener((data) => {
      let frequency = this.pitchFinder(data);
      // frequency = this.HPS.do_processing(data)
      const note = this.getNote(frequency);
      console.log(this.noteStrings[note % 12])
      if (frequency && this.onNoteDetected) {
        const note = this.getNote(frequency);
        this.onNoteDetected({
          name: this.noteStrings[note % 12],
          value: note,
          cents: this.getCents(frequency, note),
          octave: parseInt(note / 12) - 1,
          frequency: frequency,
        });
      }
    }
    );
    Recording.start();
    // Recording.addRecordingEventListener((data) => {
    //   const frequency = this.pitchFinder(data);
    //   if (frequency && this.onNoteDetected) {
    //     const note = this.getNote(frequency);
    //     this.onNoteDetected({
    //       name: this.noteStrings[note % 12],
    //       value: note,
    //       cents: this.getCents(frequency, note),
    //       octave: parseInt(note / 12) - 1,
    //       frequency: frequency,
    //     });
    //   }
    // });
  }

  stop() {
    console.log('finalizei')
    Recording.stop();
  }

  /**
   * get musical note from frequency
   *
   * @param {number} frequency
   * @returns {number}
   */
  getNote(frequency) {
    const note = 12 * (Math.log(frequency / this.middleA) / Math.log(2));
    return Math.round(note) + this.semitone;
  }

  /**
   * get the musical note's standard frequency
   *
   * @param note
   * @returns {number}
   */
  getStandardFrequency(note) {
    return this.middleA * Math.pow(2, (note - this.semitone) / 12);
  }

  /**
   * get cents difference between given frequency and musical note's standard frequency
   *
   * @param {float} frequency
   * @param {int} note
   * @returns {int}
   */
  getCents(frequency, note) {
    return Math.floor(
      (1200 * Math.log(frequency / this.getStandardFrequency(note))) /
      Math.log(2)
    );
  }
}