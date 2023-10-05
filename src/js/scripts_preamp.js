var context = null;
var buffer = null;
var preamp = null;
var sounds = [];
sounds.push('http://localhost/assets/preamp_sounds/peaceloveandunity.mp3');
var sound = null;
var WIDTH = 100;
var HEIGHT = 50;

class Preamp {
  constructor(context) {
    this.context = context;
    this.low = {
      lowpass: this.context.createBiquadFilter(),
      highpass: this.context.createBiquadFilter(),
      gainNode: this.context.createGain(),
      meter: createAudioMeter(this.context, 0.98, 0.95, 750),
      sweep: this.context.createBiquadFilter(),
      canvasContext: document.getElementById('meter_low').getContext('2d'),
    };
    this.low.gainNode.gain.value = 0.4;
    console.log(this.low);
    this.kick = {
      lowpass: this.context.createBiquadFilter(),
      highpass: this.context.createBiquadFilter(),
      gainNode: this.context.createGain(),
      meter: createAudioMeter(this.context, 0.98, 0.95, 750),
      canvasContext: document.getElementById('meter_kick').getContext('2d'),
    };

    this.mid = {
      lowpass: this.context.createBiquadFilter(),
      highpass: this.context.createBiquadFilter(),
      gainNode: this.context.createGain(),
      meter: createAudioMeter(this.context, 0.98, 0.95, 750),
      sweep: this.context.createBiquadFilter(),
      canvasContext: document.getElementById('meter_mid').getContext('2d'),
    };
    this.mid.gainNode.gain.value = 0.8;

    this.top = {
      lowpass: this.context.createBiquadFilter(),
      highpass: this.context.createBiquadFilter(),
      gainNode: this.context.createGain(),
      meter: createAudioMeter(this.context, 0.98, 0.95, 750),
      sweep: this.context.createBiquadFilter(),
      canvasContext: document.getElementById('meter_top').getContext('2d'),
    };

    this.low.lowpass.type = 'lowpass'; // In this case it's a lowshelf filter
    this.low.lowpass.frequency.value = 90;
    this.low.highpass.type = 'highpass'; // In this case it's a lowshelf filter
    this.low.highpass.frequency.value = 35;
    this.low.sweep.type = 'bandpass';
    this.low.sweep.frequency.value = 62.5;

    this.kick.lowpass.type = 'lowpass'; // In this case it's a lowshelf filter
    this.kick.lowpass.frequency.value = 80;
    this.kick.highpass.type = 'highpass'; // In this case it's a lowshelf filter
    this.kick.highpass.frequency.value = 230;

    this.mid.lowpass.type = 'lowpass'; // In this case it's a lowshelf filter
    this.mid.lowpass.frequency.value = 4500;
    this.mid.highpass.type = 'highpass'; // In this case it's a lowshelf filter
    this.mid.highpass.frequency.value = 220;
    this.mid.sweep.type = 'bandpass';
    this.mid.sweep.frequency.value = 2295;

    this.top.highpass.type = 'highpass'; // In this case it's a lowshelf filter
    this.top.highpass.frequency.value = 4200;
    this.top.sweep.type = 'bandpass';
    this.top.sweep.frequency.value = 7250;
  }
}

class Buffer {
  constructor(context, urls) {
    this.context = context;
    this.urls = urls;
    this.buffer = [];
  }

  loadSound(url, index) {
    let request = new XMLHttpRequest();
    request.open('get', url, true);
    request.responseType = 'arraybuffer';
    let thisBuffer = this;
    request.onload = function () {
      thisBuffer.context.decodeAudioData(request.response, function (buffer) {
        thisBuffer.buffer[index] = buffer;
        updateProgress(thisBuffer.urls.length);
        if (index == thisBuffer.urls.length - 1) {
          thisBuffer.loaded();
        }
      });
    };
    request.send();
  }

  loadAll() {
    this.urls.forEach((url, index) => {
      this.loadSound(url, index);
    });
  }

  loaded() {
    // what happens when all the files are loaded
    sound = new Sound(context, buffer.getSoundByIndex(0), preamp);
  }

  getSoundByIndex(index) {
    return this.buffer[index];
  }
}

class Sound {
  constructor(context, buffer, preamp) {
    this.context = context;
    this.buffer = buffer;
    this.preamp = preamp;
  }

  init() {
    this.gainNode = this.context.createGain();
    this.source = this.context.createBufferSource();

    this.source.buffer = this.buffer;
    this.source.connect(this.preamp.low.lowpass);
    this.preamp.low.lowpass.connect(this.preamp.low.highpass);
    this.preamp.low.highpass.connect(this.preamp.low.gainNode);
    this.preamp.low.gainNode.connect(this.preamp.low.sweep);
    this.preamp.low.sweep.connect(this.gainNode);
    this.preamp.low.gainNode.connect(this.gainNode);
    this.preamp.low.gainNode.connect(this.preamp.low.meter);

    onLevelChangeLow(null, this.preamp.low);

    this.source.connect(this.preamp.kick.lowpass);
    this.preamp.kick.lowpass.connect(this.preamp.kick.highpass);
    this.preamp.kick.highpass.connect(this.preamp.kick.gainNode);
    this.preamp.kick.gainNode.connect(this.preamp.mid.sweep);
    this.preamp.kick.gainNode.connect(this.gainNode);
    this.preamp.kick.gainNode.connect(this.preamp.kick.meter);
    onLevelChangeKick(null, this.preamp.kick);

    this.source.connect(this.preamp.mid.lowpass);
    this.preamp.mid.lowpass.connect(this.preamp.mid.highpass);
    this.preamp.mid.highpass.connect(this.preamp.mid.gainNode);
    this.preamp.mid.gainNode.connect(this.preamp.mid.sweep);
    this.preamp.mid.sweep.connect(this.gainNode);
    this.preamp.mid.gainNode.connect(this.gainNode);
    this.preamp.mid.gainNode.connect(this.preamp.mid.meter);
    onLevelChangeMid(null, this.preamp.mid);

    this.source.connect(this.preamp.top.highpass);
    this.preamp.top.highpass.connect(this.preamp.top.gainNode);
    this.preamp.top.gainNode.connect(this.preamp.top.sweep);
    this.preamp.top.sweep.connect(this.gainNode);
    this.preamp.top.gainNode.connect(this.gainNode);
    this.preamp.top.gainNode.connect(this.preamp.top.meter);
    onLevelChangeTop(null, this.preamp.top);

    this.gainNode.connect(this.context.destination);
  }

  play() {
    this.init();
    this.source.start(this.context.currentTime);
  }

  stop() {
    this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.5);
    this.source.stop(this.context.currentTime + 0.5);
  }
}

function onLevelChangeLow(time) {
  // clear the background
  preamp.low.canvasContext.clearRect(0, 0, WIDTH, HEIGHT);

  // check if we're currently clipping
  if (preamp.low.meter.checkClipping()) preamp.low.canvasContext.fillStyle = 'red';
  else preamp.low.canvasContext.fillStyle = 'green';

  // draw a bar based on the current volume
  preamp.low.canvasContext.fillRect(0, 0, preamp.low.meter.volume * HEIGHT * 1.4, WIDTH);

  // set up the next visual callback
  rafID = window.requestAnimationFrame(onLevelChangeLow);
}
function onLevelChangeKick(time) {
  // clear the background
  preamp.kick.canvasContext.clearRect(0, 0, WIDTH, HEIGHT);

  // check if we're currently clipping
  if (preamp.kick.meter.checkClipping()) preamp.kick.canvasContext.fillStyle = 'red';
  else preamp.kick.canvasContext.fillStyle = 'green';

  // draw a bar based on the current volume
  preamp.kick.canvasContext.fillRect(0, 0, preamp.kick.meter.volume * HEIGHT * 1.4, WIDTH);

  // set up the next visual callback
  rafID = window.requestAnimationFrame(onLevelChangeKick);
}
function onLevelChangeMid(time) {
  // clear the background
  preamp.mid.canvasContext.clearRect(0, 0, WIDTH, HEIGHT);

  // check if we're currently clipping
  if (preamp.mid.meter.checkClipping()) preamp.mid.canvasContext.fillStyle = 'red';
  else preamp.mid.canvasContext.fillStyle = 'green';

  // draw a bar based on the current volume
  preamp.mid.canvasContext.fillRect(0, 0, preamp.mid.meter.volume * HEIGHT * 1.4, WIDTH);

  // set up the next visual callback
  rafID = window.requestAnimationFrame(onLevelChangeMid);
}
function onLevelChangeTop(time) {
  // clear the background
  preamp.top.canvasContext.clearRect(0, 0, WIDTH, HEIGHT);

  // check if we're currently clipping
  if (preamp.top.meter.checkClipping()) preamp.top.canvasContext.fillStyle = 'red';
  else preamp.top.canvasContext.fillStyle = 'green';

  // draw a bar based on the current volume
  preamp.top.canvasContext.fillRect(0, 0, preamp.top.meter.volume * HEIGHT * 1.4, WIDTH);

  // set up the next visual callback
  rafID = window.requestAnimationFrame(onLevelChangeTop);
}

function updateProgress() {}

function createAudioMeter(audioContext, clipLevel, averaging, clipLag) {
  var processor = audioContext.createScriptProcessor(512);
  processor.onaudioprocess = volumeAudioProcess;
  processor.clipping = false;
  processor.lastClip = 0;
  processor.volume = 0;
  processor.clipLevel = clipLevel || 0.98;
  processor.averaging = averaging || 0.95;
  processor.clipLag = clipLag || 750;

  // this will have no effect, since we don't copy the input to the output,
  // but works around a current Chrome bug.
  processor.connect(audioContext.destination);

  processor.checkClipping = function () {
    if (!this.clipping) return false;
    if (this.lastClip + this.clipLag < window.performance.now()) this.clipping = false;
    return this.clipping;
  };

  processor.shutdown = function () {
    this.disconnect();
    this.onaudioprocess = null;
  };

  return processor;
}

function volumeAudioProcess(event) {
  var buf = event.inputBuffer.getChannelData(0);
  var bufLength = buf.length;
  var sum = 0;
  var x;

  // Do a root-mean-square on the samples: sum up the squares...
  for (var i = 0; i < bufLength; i++) {
    x = buf[i];
    if (Math.abs(x) >= this.clipLevel) {
      this.clipping = true;
      this.lastClip = window.performance.now();
    }
    sum += x * x;
  }

  // ... then take the square root of the sum.
  var rms = Math.sqrt(sum / bufLength);

  // Now smooth this out with the averaging factor applied
  // to the previous sample - take the max here because we
  // want "fast attack, slow release."
  this.volume = Math.max(rms, this.volume * this.averaging);
}

jQuery(document).ready(function () {
  context = new (window.AudioContext || window.webkitAudioContext)();

  preamp = new Preamp(context);

  buffer = new Buffer(context, sounds);
  buffer.loadAll();

  jQuery('body').on('click', '.play_all_samples', function (e) {
    sound.play();
    jQuery(this).fadeOut(50, function () {
      jQuery('.stop_all_samples').fadeIn();
    });
    jQuery('.play_sample').each(function () {
      jQuery(this).fadeOut(50, function () {
        jQuery(this).parent().find('.stop_sample').fadeIn();
      });
    });
    playing = true;
  });

  jQuery('body').on('click', '.stop_all_samples', function (e) {
    sound.stop();

    jQuery(this).fadeOut(50, function () {
      jQuery('.play_all_samples').fadeIn();
    });
    jQuery('.stop_sample').each(function () {
      jQuery(this).fadeOut(50, function () {
        jQuery(this).parent().find('.play_sample').fadeIn();
      });
    });
    playing = false;
  });

  jQuery('body').on('click', '.kill_button', function (e) {
    var band = jQuery(this).data('band');
    if (jQuery(this).hasClass('active')) {
      if (band == 'low') {
        preamp.low.gainNode.gain.exponentialRampToValueAtTime(0.4, context.currentTime + 0.01);
      } else if (band == 'kick') {
        preamp.kick.gainNode.gain.exponentialRampToValueAtTime(1, context.currentTime + 0.01);
      } else if (band == 'mid') {
        preamp.mid.gainNode.gain.exponentialRampToValueAtTime(0.8, context.currentTime + 0.01);
      } else if (band == 'top') {
        preamp.top.gainNode.gain.exponentialRampToValueAtTime(1, context.currentTime + 0.01);
      }

      jQuery(this).removeClass('active');
    } else {
      if (band == 'low') {
        preamp.low.gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.01);
      } else if (band == 'kick') {
        preamp.kick.gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.01);
      } else if (band == 'mid') {
        preamp.mid.gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.01);
      } else if (band == 'top') {
        preamp.top.gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.01);
      }
      jQuery(this).addClass('active');
    }
  });

  jQuery('.low_sweep').knob({
    width: 40,
    height: 40,
    min: 35,
    max: 90,
    bgColor: '#d4d4d4',
    fgColor: '#ffa500',
    change: function (e) {
      var val = e;
      preamp.low.sweep.frequency.exponentialRampToValueAtTime(e, context.currentTime + 0.01);
    },
  });
  jQuery('.mid_sweep').knob({
    width: 40,
    height: 40,
    min: 90,
    max: 4500,
    bgColor: '#d4d4d4',
    fgColor: '#ffa500',
    change: function (e) {
      var val = e;
      var band = jQuery('.low_sweep').data('band');
      preamp.mid.sweep.frequency.exponentialRampToValueAtTime(e, context.currentTime + 0.01);
    },
  });
  jQuery('.top_sweep').knob({
    width: 40,
    height: 40,
    min: 4500,
    max: 10000,
    bgColor: '#d4d4d4',
    fgColor: '#ffa500',
    change: function (e) {
      var val = e;
      var band = jQuery('.low_sweep').data('band');
      preamp.top.sweep.frequency.exponentialRampToValueAtTime(e, context.currentTime + 0.01);
    },
  });
});
