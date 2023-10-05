var context = null;
var buffer = null;
var sounds = [];
sounds.push('http://localhost/assets/preamp_sounds/peaceloveandunity.mp3');
var sound = null;
var filters = [];

class Buffer {
  constructor(context, urls, filters) {
    this.context = context;
    this.urls = urls;
    this.buffer = [];
    this.filters = filters;
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
    sound = new Sound(context, buffer.getSoundByIndex(0), this.filters);
  }

  getSoundByIndex(index) {
    return this.buffer[index];
  }
}

class Sound {
  constructor(context, buffer, filters) {
    this.context = context;
    this.buffer = buffer;
    this.filters = filters;
  }

  init() {
    this.gainNode = this.context.createGain();
    this.source = this.context.createBufferSource();
    this.source.buffer = this.buffer;
    this.source.connect(this.gainNode);

    // Connect filters in serie
    this.source.connect(this.filters[0]);
    for (var i = 0; i < this.filters.length - 1; i++) {
      this.filters[i].connect(this.filters[i + 1]);
    }

    // connect the last filter to the speakers
    this.filters[this.filters.length - 1].connect(this.gainNode);

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

function updateProgress() {}

function changeGain(sliderVal, nbFilter) {
  var value = parseFloat(sliderVal);
  filters[nbFilter].gain.value = value;

  // update output labels
  var output = document.querySelector('#gain' + nbFilter);
  output.value = value + ' dB';
}

jQuery(document).ready(function () {
  context = new (window.AudioContext || window.webkitAudioContext)();

  // Set filters
  [60, 170, 350, 1000, 3500, 10000].forEach(function (freq, i) {
    var eq = context.createBiquadFilter();
    eq.frequency.value = freq;
    eq.type = 'peaking';
    eq.gain.value = 0;
    filters.push(eq);
  });

  buffer = new Buffer(context, sounds, filters);
  buffer.loadAll();

  jQuery('body').on('click', '.play_all_samples', function (e) {
    sound.play();
    console.log('play');
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
});
