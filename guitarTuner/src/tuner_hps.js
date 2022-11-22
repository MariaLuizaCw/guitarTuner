// # General settings
import {FFT} from './FFT.js'
const R = require('ramda');
export default class HPS {
  constructor(SAMPLE_FREQ, WINDOW_SIZE, WINDOW_STEP, NUM_HPS) {
    this.SAMPLE_FREQ = SAMPLE_FREQ
    this.WINDOW_SIZE = WINDOW_SIZE
    this.WINDOW_STEP = WINDOW_STEP
    this.NUM_HPS = NUM_HPS
    this.fft = new FFT(WINDOW_SIZE, SAMPLE_FREQ);
  }
  interp(arr, xVals) {
    let retArr = new Array(xVals.length)
    let v1, v2;
    for (let i = 0; i < xVals.length; i++) {
      v1 = arr[parseInt(xVals[i])];
      v2 = arr[parseInt(xVals[i] + 1)];
      v2 = isNaN(v2) ? v1 : v2;
      retArr[i] = (v2 - v1) * (xVals[i] - parseInt(xVals[i])) + v1;
    }
    return retArr
  }


  do_processing(e) {
    var input_data = [];
    var spectrum = [];
    var hpsSpec = [];
    var hpsSpecOld = [];
    var maxValHPS = 1;

    //Processing part
    input_data = input_data.concat(e);
    if (input_data.length >= this.WINDOW_SIZE) {
      this.fft.forward(input_data.slice(0, this.WINDOW_SIZE));
      spectrum = this.fft.spectrum;
      //Calculate signal power
      var normFactor = spectrum.reduce((t, n) => t + n ** 2);
      if ((normFactor / spectrum.length) < (3e-8)) {
        input_data = input_data.slice(this.WINDOW_STEP, input_data.length);
        return;
      }
      //this.interpolate spectrum
      var interFactor = 1 / this.NUM_HPS
      var xVals = Array.from({ length: this.NUM_HPS * spectrum.length }, (_, i) => i * interFactor)
      var magSpecIpol = this.interp(spectrum, xVals)

      //Normalize it
      for (let j = 0; j < newLength; j++) {
        magSpecIpol[j] /= normFactor
      }

      hpsSpec = R.clone(magSpecIpol);
      hpsSpecOld = R.clone(magSpecIpol);
      var oldLength = magSpecIpol.length;
      //console.log(hpsSpec)
      for (i = 0; i < this.NUM_HPS; i++) {
        var j;
        var newLength = parseInt(Math.ceil(magSpecIpol.length / (i + 1)))

        for (j = 0; j < newLength; j++) {
          hpsSpec[j] = hpsSpec[j] * magSpecIpol[j * (i + 1)];
        }
        for (j = newLength; j < oldLength; j++) {
          hpsSpec[j] = 0;
        }
        oldLength = newLength;
        if (!hpsSpec.some(x => x !== 0)) {
          break;
        }
        hpsSpecOld = R.clone(hpsSpec);
      }

      maxValHPS = Math.max(...hpsSpecOld);
      const indexOfMaxValue = hpsSpecOld.indexOf(maxValHPS);
      max_freq = indexOfMaxValue * (this.SAMPLE_FREQ / this.WINDOW_SIZE / this.NUM_HPS);

      input_data = input_data.slice(this.WINDOW_STEP, input_data.length);
      return max_freq
    }
  }


}
// var SAMPLE_FREQ = 48000 // sample frequency in Hz
// var WINDOW_SIZE = 32768 // window size of the DFT in samples
// var WINDOW_STEP = 16384 // step size of window
// var NUM_HPS = 4 //max number of harmonic product spectrums





