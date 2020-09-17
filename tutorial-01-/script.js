let audioCtx, analyser, visualiser = null;
let globalFreq;
let avgBpm;
let intervalMeter = new IntervalMeter(5, 200);
let ball0Radius = ballArray["ball0"]["radius"];
let ball1Radius = ballArray["ball1"]["radius"];
let ball2Radius = ballArray["ball2"]["radius"];

function analyse() {
  const bins = analyser.frequencyBinCount;

  // Get frequency and amplitude data
  const freq = new Float32Array(bins);
  const wave = new Float32Array(bins);
  analyser.getFloatFrequencyData(freq);
  analyser.getFloatTimeDomainData(wave);

  // In testing, with FFT size of 32, bucket #19 correspnds with metronome
  // ...but probably not your sound.
  const magicBucket = 32;

  // Determine pulse if frequency threshold is exceeded.
  // -60 was determined empirically, you'll need to find your own threshold
  let hit = (freq[magicBucket] > -60);

  // An alternative approach is to check for a peak, regardless of freq
  //let hit = thresholdPeak(wave, 0.3);


  if (hit) {
    // Use the IntevalMeter (provided by util.js)
    // to track the time between pulses.
    pulsed = intervalMeter.pulse();
    let avgMs = intervalMeter.calculate();
    avgBpm = 1.0 / (avgMs / 1000.0) * 60.0;
    console.log('level: ' + freq[magicBucket] + '\tms: ' + avgMs +'\tbpm: ' + avgBpm);
  }
//================================================================
//                Determine BPM via an average.
//================================================================

  /*if (pulsed) {
    // Debug
    let avgMs = intervalMeter.calculate();
    let avgBpm = 1.0 / (avgMs / 1000.0) * 60.0;
    console.log('level: ' + freq[magicBucket] + '\tms: ' + avgMs +'\tbpm: ' + avgBpm);
  }*/

//===============================================================
//             Behaviour of the three rolling balls
//===============================================================

globalFreq = freq; //hook for freq to be global DOESN'T WORK. WHY????
  
	// Test whether we hit a threshold between 0-80Hz (bass region)
	for(let i = 0; i <= Object.keys(ballArray).length -1; i++) {
		let ball = window["ball" + String(i)];
		let hit = thresholdFrequency(0, 95, freq, -70);

		if (hit) {
			//ball.velocity -=1;//document.getElementById('freqTarget').classList.add('hit');
			if (ball.velocity > 0) {
				ball.velocity += 0.1;
			} else {
				ball.velocity -= 0.1;
			}
		} else {
			if (ball.velocity > 0) {
				ball.velocity -= 0.1;
			} else {
				ball.velocity += 0.1;
				//console.log(ball.velocity);
			}
		}

		// Test whether we hit an peak threshold (this can be a short burst of sound)
		hit = thresholdPeak(wave, 0.3);
		if (hit) {
			// Behaviour(ball.behaviour, ball.intensity)
          //bigBallMod += 1/3;
			ball.y -=40;//document.getElementById('peakTarget').classList.add('hit');
		} else {
			//ball.colour = 'blue';
		}

		hit = thresholdSustained(wave, 0.3);
		if (hit) {
			ball.radius++;//document.getElementById('susTarget').classList.add('hit');
		} else if (ball.radius >= ball.size) {
      ball.radius--;
    }
	}

  // Run again
  window.requestAnimationFrame(analyse);
}

if (document.readyState != 'loading') {
  onDocumentReady();
} else {
  document.addEventListener('DOMContentLoaded', onDocumentReady);
}

// Main initialisation, called when document is loaded and ready.
function onDocumentReady() {
  window.addEventListener('resize', onResize);

  // 'Reset' button. Remove 'hit' class list on all elements.
  /*
  document.getElementById('reset').addEventListener('click', () => {
    document.querySelectorAll('.hit').forEach(elem => elem.classList.remove('hit'));
  });
  visualiser = new Visualiser(document.getElementById('visualiser'));
  visualiser.setExpanded(false); // Collapse at startup
*/
  // Initalise microphone
  navigator.getUserMedia(
    { audio: true },
    onMicSuccess, // Call this when microphone is ready
    error => { console.error('Could not init microphone', error); });
}
// Microphone successfully initalised, now have access to audio data
function onMicSuccess(stream) {
  audioCtx = new AudioContext();

  audioCtx.addEventListener('statechange', () => {
    console.log('Audio context state: ' + audioCtx.state);
  });

  analyser = audioCtx.createAnalyser();

  // fftSize must be a power of 2. Higher values slower, more detailed
  // Range is 32-32768
  analyser.fftSize = 1024;

  // smoothingTimeConstant ranges from 0.0 to 1.0
  // 0 = no averaging. Fast response, jittery
  // 1 = maximum averaging. Slow response, smooth
  analyser.smoothingTimeConstant = 0.9;

  // Microphone -> analyser
  const micSource = audioCtx.createMediaStreamSource(stream);
  micSource.connect(analyser);

  // Start loop
  window.requestAnimationFrame(analyse);
}

// Returns TRUE if the threshold value is hit between the given frequency range
// Note that FFT size & smoothing has an averaging effect
function thresholdFrequency(lowFreq, highFreq, freqData, threshold) {
  const samples = sampleData(lowFreq, highFreq, freqData);
  let max = Number.MIN_SAFE_INTEGER;
  for (var i = 0; i < samples.length; i++) {
    if (samples[i] > threshold) return true;
    max = Math.max(max, samples[i]);
  }

  // For debugging it can be useful to see maximum value within range
  //console.log('Freq max: ' + max);
  return false;
}

// Returns TRUE if the data hits a peak threshold at any point
// Higher FFT sizes are needed to detect shorter pulses.
function thresholdPeak(waveData, threshold) {
  let max = Number.MIN_SAFE_INTEGER;
  for (var i = 0; i < waveData.length; i++) {
    // Need to use Math.abs to swap negatives into positive
    if (Math.abs(waveData[i]) > threshold) return true;
    max = Math.max(max, Math.abs(waveData[i]));
  }
  // For debugging it can be useful to see maximum value within range
  // console.log('Peak max: ' + max);
  return false;
}

// Returns true if the average amplitude is above threshold across the whole snapshot
// Smaller FFT sizes will have a similar averaging effect
function thresholdSustained(waveData, threshold) {
  let total = 0;
  for (var i = 0; i < waveData.length; i++) {
    // Use Math.abs to swap negatives into positive
    total += Math.abs(waveData[i]);
  }
  const avg = total / waveData.length;

  // For debugging it can be useful to see computed average values
  // console.log('Sustained avg: ' + avg);
  return avg >= threshold;
}

function sampleData(lowFreq, highFreq, freqData) {
  // getIndexForFrequency is a function from util.js
  // it gives us the array index for a given freq
  const lowIndex = getIndexForFrequency(lowFreq, analyser);
  const highIndex = getIndexForFrequency(highFreq, analyser);

  // Grab a 'slice' of the array between these indexes
  const samples = freqData.slice(lowIndex, highIndex);
  return samples;
}
