// # General settings
const FFT = require('./FFT.js');


var SAMPLE_FREQ = 48000 // sample frequency in Hz
var WINDOW_SIZE = 32768 // window size of the DFT in samples
var WINDOW_STEP = 16384 // step size of window
var WINDOW_T_LEN = WINDOW_SIZE / SAMPLE_FREQ // length of the window in seconds
var SAMPLE_T_LENGTH = 1 / SAMPLE_FREQ // length between two samples in seconds
var NUM_HPS = 4 //max number of harmonic product spectrums
var DELTA_FREQ = (SAMPLE_FREQ/WINDOW_SIZE) // frequency step width of the interpolated DFT
var input_data = [];



var fft = new FFT(WINDOW_SIZE, SAMPLE_FREQ);
var max_freq=0;
var closest_note = "";
var closest_pitch = 440;
var spectrum = [];
var hpsSpec = [];
var hpsSpecOld = [];
var maxValHPS = 1;



function do_processing(e){
    //Processing part
    input_data = input_data.concat(e.data);
    if ( input_data.length >= WINDOW_SIZE ) {
      fft.forward(input_data.slice(0,WINDOW_SIZE));
      spectrum = fft.spectrum;

      //Calculate signal power
      var normFactor = spectrum.reduce((t, n) => t + n**2);
      if ( (normFactor / spectrum.length) < (3e-8) ) {
        input_data = input_data.slice(WINDOW_STEP, input_data.length);
        return;
      }

      //Interpolate spectrum
      var interFactor = 1/NUM_HPS
      var xVals = Array.from({ length: NUM_HPS*spectrum.length }, (_, i) => i*interFactor)
      var magSpecIpol = interp(spectrum, xVals)

      //Normalize it
      for (let j=0; j<newLength; j++) {
        magSpecIpol[j] /= normFactor
      }

      hpsSpec = R.clone(magSpecIpol);
      hpsSpecOld = R.clone(magSpecIpol);
      //console.log(spectrum)
      //console.log(magSpecIpol)
      var oldLength=magSpecIpol.length;
      //console.log(hpsSpec)
      for (i=0; i<NUM_HPS; i++) {
        var j;
        var newLength = parseInt( Math.ceil(magSpecIpol.length/(i+1)) )

        for (j=0; j<newLength; j++) {
          hpsSpec[j] = hpsSpec[j] * magSpecIpol[j*(i+1)];
        }
        for (j=newLength; j<oldLength; j++) {
          hpsSpec[j] = 0;
        }
        oldLength = newLength;
        if (!hpsSpec.some(x => x !== 0)) {
          break;
        }
        hpsSpecOld = R.clone(hpsSpec);
      }
      //console.log(hpsSpecOld)
      // maxInd = np.argmax(hpsSpec)
      // maxFreq = maxInd * (SAMPLE_FREQ/WINDOW_SIZE) / NUM_HPS

      // closestNote, closestPitch = find_closest_note(maxFreq)
      // maxFreq = round(maxFreq, 1)
      // closestPitch = round(closestPitch, 1)

      maxValHPS = Math.max(...hpsSpecOld);
      const indexOfMaxValue = hpsSpecOld.indexOf(maxValHPS);
      max_freq = indexOfMaxValue * (SAMPLE_FREQ/WINDOW_SIZE/NUM_HPS);

    //   var a = find_closest_note(max_freq);
    //   closest_note = a[0];
    //   closest_pitch = a[1];
    //   doDraw() //Rendering part
      input_data = input_data.slice(WINDOW_STEP, input_data.length);
    }
  }

  
function interp(arr, xVals){
    let retArr = new Array(xVals.length)
    let v1, v2;
    for (let i=0; i<xVals.length; i++) {
        v1 = arr[parseInt(xVals[i])];
        v2 = arr[parseInt(xVals[i]+1)];
        v2 = isNaN(v2) ? v1 : v2;
        retArr[i] = (v2-v1)*(xVals[i]-parseInt(xVals[i])) + v1;
      }
    return retArr
  }
  
  