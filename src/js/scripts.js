var mapEnabled = false;
var playing = false;
var record = false;
var sounds = [];
var names = [];
class Channel {
	constructor(sound, index){
		this.sound = sound;
		this.indexval = index;
		this.delay = null;
		this.delay2 = null;
		this.reverb = null;
		this.volume = null;
		this.mute = null;
	}
}

class Buffer {
	constructor(context, urls) {  
		this.context = context;
		this.urls = urls;
		this.buffer = [];
		this.loadedCount = 0;
	}

	loadSound(url, name, masterGain, delay, delay2, convolver, index) {
		let request = new XMLHttpRequest();
		request.open('get', url, true);
		request.responseType = 'arraybuffer';
		let thisBuffer = this;
		request.onload = function() {
			thisBuffer.context.decodeAudioData(request.response, function(buffer) {
				thisBuffer.buffer[index] = buffer;
				/*var wavesurfer = WaveSurfer.create({
				    container: '#waveform_'+index,
				    waveColor: '#d4d4d4',
				    progressColor: 'orange',
				    height: 64,
				    cursorColor: '#d4d4d4',
				    autoCenter: true,

				});	*/
				/*wavesurfer.on('ready', function(){
					wavesurfer.toggleMute();
					wavesurfer.zoom(20);
					loaded_wavesurfers++;
					if(loaded_wavesurfers == sounds.length-1){
						console.log('finished loading audio system...');
						jQuery('.close-modal').fadeIn();
						jQuery('.close_btn').fadeIn();
					}
				});
				wavesurfer.load(url);*/
				var wavesurfer = null;

				var sound = new Sound(context, masterGain, delay, delay2, convolver, buffer, name, wavesurfer);
				channels.push(new Channel(sound, index));			
				if(debug ==  true){ console.log('loaded track audio, track '+index+'...');	}
				thisBuffer.loadedCount++;
				updateProgress(thisBuffer.loadedCount);
				if(index == thisBuffer.urls.length-1) {
					thisBuffer.loaded();
				}
			});
		};
		request.send();
	};

	loadAll(masterGain, delay, delay2, convolver) {

		for(var i=0; i<this.urls.length;i++){
			this.loadSound(this.urls[i].url, this.urls[i].name, masterGain, delay, delay2, convolver, this.urls[i].indexval);
		}
		render_ui();
	}

	loaded() {
		// what happens when all the files are loaded
		jQuery('.loader').fadeOut(500, function(){
			jQuery(".interim-message").fadeIn();
			setTimeout(function(){ 
				mapMidi(channels); 
				jQuery(".interim-message").fadeOut(500, function(){
					jQuery('.alert-project-loaded').fadeIn();
					init_listeners();
					setTimeout(function(){
						jQuery('.alert-project-loaded').fadeOut();
						jQuery('.close-project').each(function(){
							jQuery(this).fadeIn();
						});
					}, 3000);
					jQuery('.load_mappings_li').fadeIn();
					jQuery('.map_midi_li').fadeIn();
					jQuery('.dark_mode_li').fadeIn();
					
				});
			}, 3000);
			if(debug==true){ console.log('finished loading audio system...'); }
			jQuery('.close-modal').fadeIn();
			jQuery('.close_btn').fadeIn();
		});	
	}

	getSoundByIndex(index) {
		return this.buffer[index];
	}
}

class Sound {
	constructor(context, masterGain, delay, delay2, convolver, buffer, name, wavesurfer) {
		this.context = context;
		this.buffer = buffer;
		this.delay = delay;
		this.delay2 = delay2;
		this.name = name;
		this.convolver = convolver;
		this.muted = false;
		this.delayed = false;
		this.prev_volume = 0;
		this.prev_delay = 0;
		this.prev_delay2 = 0;
		this.prev_reverb = 0;
		this.wavesurfer = wavesurfer;
		this.masterGain = masterGain;
	}

	init() {
		this.gainNode = this.context.createGain();
		this.delayGainNode = this.context.createGain();
		this.delay2GainNode = this.context.createGain();
		this.convolverGainNode = this.context.createGain();
		this.source = this.context.createBufferSource();
		this.source.buffer = this.buffer;
		this.source.connect(this.gainNode);
		this.gainNode.connect(this.masterGain);
		this.gainNode.connect(this.delayGainNode);
		this.delayGainNode.connect(this.delay);
		this.delayGainNode.gain.value = 0.001;
		this.gainNode.connect(this.delay2GainNode);
		this.delay2GainNode.connect(this.delay2);
		this.delay2GainNode.gain.value = 0.001;
		this.gainNode.connect(this.convolverGainNode);
		this.convolverGainNode.connect(this.convolver);
		this.convolverGainNode.gain.value = 0.001;
	}

	play() {
		this.init();
		this.source.start(this.context.currentTime);
		//this.wavesurfer.play();
	}  

	stop() {
		this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.5);
		this.source.stop(this.context.currentTime + 0.5);
		//this.wavesurfer.stop();
	}
	mute() {
		this.muted = true;
		this.prev_delay = this.delayGainNode.gain.value;
		this.prev_delay2 = this.delay2GainNode.gain.value;
		this.prev_reverb = this.convolverGainNode.gain.value;
		this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.01);
		this.delayGainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.01);
		this.delay2GainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.01);
		this.convolverGainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.1);
		return true;
	}
	unmute() {
		this.muted = false;
		this.gainNode.gain.exponentialRampToValueAtTime(1.000, this.context.currentTime + 0.01);
		this.delayGainNode.gain.exponentialRampToValueAtTime(this.prev_delay, this.context.currentTime + 0.01);
		this.delay2GainNode.gain.exponentialRampToValueAtTime(this.prev_delay2, this.context.currentTime + 0.01);
		this.convolverGainNode.gain.exponentialRampToValueAtTime(this.prev_reverb, this.context.currentTime + 0.1);
		return true;
	}

	change_delay(val) {
		if(val == 0){ val = 0.001; }
		this.prev_delay = val;
		this.delayGainNode.gain.exponentialRampToValueAtTime(val, this.context.currentTime + 0.1);
	}

	change_delay2(val) {
		if(val == 0){ val = 0.001; }
		this.prev_delay2 = val;
		this.delay2GainNode.gain.exponentialRampToValueAtTime(val, this.context.currentTime + 0.1);
	}

	change_reverb(val) {
		if(val == 0){ val = 0.001; }
		this.prev_reverb = val;
		this.convolverGainNode.gain.exponentialRampToValueAtTime(val, this.context.currentTime + 0.1);
	}

	change_volume(val) {
		if(val == 0){ val = 0.001; }
		this.gainNode.gain.exponentialRampToValueAtTime(val, this.context.currentTime + 0.1);
	}
}

class Reverb {
	constructor(context, opts) {
		this.context = context;
		this.convolverGain = context.createGain();
		this.convolver = context.createConvolver();
		this.convolverGain.connect(this.convolver);
		this.opts = opts || {};
		this.seconds   = this.opts.seconds;
		this.decay     = this.opts.decay;
		this.reverse   = this.opts.reverse;
		
        this.convolver.buffer = this.buildImpulse();
        this.convolver.loop = true;
		this.convolver.normalize = true;
        this.convolverGain.gain.setTargetAtTime(0.001, context.currentTime, 10);
	}
	buildImpulse(){
		var rate = this.context.sampleRate
		, length = rate * this.seconds
		, decay = this.decay
		, impulse = this.context.createBuffer(2, length, rate)
		, impulseL = impulse.getChannelData(0)
		, impulseR = impulse.getChannelData(1)
		, n, i;

		for (i = 0; i < length; i++) {
			n = this.reverse ? length - i : i;
			impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
			impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
		}

		this.convolver.buffer = impulse;
	}
	updateOpts(opts){
		this.opts = opts;
		this.seconds   = this.opts.seconds;
		this.decay     = this.opts.decay;
		this.reverse   = this.opts.reverse;
	}
}

var context = new (window.AudioContext || window.webkitAudioContext)();
var siren = new Siren(context);
var masterGain = context.createGain();
var rec = new Recorder(masterGain);
masterGain.connect(context.destination);
if(debug==true){ console.log('loaded audio system...'); }
var loaded_wavesurfers = 0;

var delay = context.createDelay();
delay.delayTime.setTargetAtTime(0.33, context.currentTime, 10);
var feedback = context.createGain();
feedback.gain.setTargetAtTime(0.6, context.currentTime, 10);
var filter = context.createBiquadFilter();
filter.frequency.setTargetAtTime(4000, context.currentTime, 10);

var delay2 = context.createDelay();
delay2.delayTime.setTargetAtTime(0.33, context.currentTime, 10);
var feedback2 = context.createGain();
feedback2.gain.setTargetAtTime(0.6, context.currentTime, 10);

delay.connect(feedback);
feedback.connect(filter);
filter.connect(delay);
delay.connect(masterGain);

delay2.connect(feedback2);
feedback2.connect(delay2);
delay2.connect(masterGain);

var reverbOptions = {
	seconds: "0.8",
	decay: "3",
	reverse: "",
}
var convolverObj = new Reverb(context, reverbOptions);
var convolver = convolverObj.convolver;
var convolverPre = context.createGain();
convolver.connect(convolverPre);
convolverPre.gain.setTargetAtTime(3.4, context.currentTime, 0.001);
convolverPre.connect(masterGain);

var channels = [];

var colors = [];
colors.push('antiquewhite');
colors.push('cadetblue');
colors.push('aquamarine');
colors.push('firebrick');
colors.push('khaki');
colors.push('lightgreen');
colors.push('lightslategray');
colors.push('thistle');
colors.push('lightskyblue');
colors.push('palegoldenrod');

function getImpulse(impulseUrl, convolver) {
  ajaxRequest = new XMLHttpRequest();
  ajaxRequest.open('GET', impulseUrl, true);
  ajaxRequest.responseType = 'arraybuffer';

  ajaxRequest.onload = function() {
    var impulseData = ajaxRequest.response;

    context.decodeAudioData(impulseData, function(buffer) {
        myImpulseBuffer = buffer;
        convolver.buffer = myImpulseBuffer;
        convolver.loop = true;
		convolver.normalize = true;
        convolverGain.gain.setTargetAtTime(0.001, context.currentTime, 10);
      },

      function(e){"Error with decoding audio data" + e.err});

  }

  ajaxRequest.send();
}

function updateProgress(buffer_length){
	var percent = (buffer_length / sounds.length) * 100+'%';
	jQuery('.progress-bar').css({"width": percent}, 100);
	jQuery('.progress-bar').html(percent);
}

function round2(x)
{
    return Math.ceil(x/2)*2;
}

function render_ui(){
	var output = '<div class="row mainrow"><div class="record"><i class="fa fa-circle" aria-hidden="true"></i></div><div class="play_all"><i class="fa fa-play-circle play_all_samples" aria-hidden="true"></i><i class="fa fa-stop-circle stop_all_samples" aria-hidden="true"></i></div>';

	var totalcolumns = sounds.length-1;
	var colno = Math.floor(12/totalcolumns);

	for(var i=0;i<=totalcolumns;i++)
	{
		output += '<div class="col';
			//output += 'col-'+colno;
		output += '">';
			output += '<div class="channel mixer-element">';
				if(typeof(names[i])!=='undefined'){
					output += '<div class="sample" style="background-color: '+colors[i]+'"><i class="fa fa-play play_sample" data-sample_index="'+i+'" aria-hidden="true"></i><i class="fa fa-stop stop_sample" data-sample_index="'+i+'" aria-hidden="true"></i> '+names[i]+'</div>';
				} else {
					output += '<div class="sample"></div>';
				}
				output += '<div class="waveform_holder"><div id="waveform_'+i+'" class="waveform"></div></div>';
				output += '<div class="delay2_holder" data-channel_id="'+i+'"><p>Delay V</p><input type="text" value="0" class="delay2dial delay2_dial_'+i+'" data-sample_index="'+i+'"><div class="midi_cc midi_cc_d2_'+i+'"></div></div>';
				output += '<div class="reverb_holder" data-channel_id="'+i+'"><p>Reverb</p><input type="text" value="0" class="reverbdial reverb_dial_'+i+'" data-sample_index="'+i+'"><div class="midi_cc midi_cc_r_'+i+'"></div></div>';
				output += '<div class="delay_holder" data-channel_id="'+i+'"><p>Delay I</p><input type="text" value="0" class="delaydial delay_dial_'+i+'" data-sample_index="'+i+'"><div class="midi_cc midi_cc_d_'+i+'"></div></div>';
				output += '<div class="mute_holder" data-channel_id="'+i+'"><div class="mute_button mute_button_'+i+'" data-sample_index="'+i+'">'+(i+1)+'</div><div class="midi_cc midi_cc_m_'+i+'"></div></div>';
				output += '<div class="volume_holder" data-channel_id="'+i+'"><input type="range" name="channel_volume" class="channel_volume channel_volume_'+i+'" data-sample_index="'+i+'" min="0" max="1" value="1" step="0.05" orient="vertical"><div class="midi_cc midi_cc_v_'+i+'"></div></div>';
			output += '</div>';
		output += '</div>';
	}
	output += '</div>';

	jQuery('.project').html(output);

	jQuery(".delaydial").knob({
		'width': 40,
		'height': 40,
		'min':0,
		'max':100,
		'bgColor': '#d4d4d4',
		'fgColor': '#ffa500',
    	'change':function(e){
	        if(playing == true){
	            var val = e;
	            var sample_index = jQuery(this.i).data('sample_index');
	            for(var c=0;c<channels.length;c++){
					if(channels[c].indexval == sample_index){
						channels[c].sound.change_delay(val/100);
					}
				}
			}
        }
    });

    jQuery(".delay2dial").knob({
		'width': 40,
		'height': 40,
		'min':0,
		'max':100,
		'bgColor': '#d4d4d4',
		'fgColor': '#ffa500',
    	'change':function(e){
	        if(playing == true){
	            var val = e;
	            var sample_index = jQuery(this.i).data('sample_index');
	            for(var c=0;c<channels.length;c++){
					if(channels[c].indexval == sample_index){
						channels[c].sound.change_delay2(val/100);
					}
				}
			}
        }
    });
    jQuery(".reverbdial").knob({
		'width': 40,
		'height': 40,
		'min':0,
		'max':100,
		'bgColor': '#d4d4d4',
		'fgColor': '#ffa500',
    	'change':function(e){
    		if(playing == true){
	            var val = e;
	            var sample_index = jQuery(this.i).data('sample_index');
	            for(var c=0;c<channels.length;c++){
					if(channels[c].indexval == sample_index){
						channels[c].sound.change_reverb(val/100);
					}
				}
			}
        }
    });
}

function init_listeners(){
	var faders = jQuery('.volume_holder');

	faders.find("input[name='channel_volume']").on('input', function(){
		if(playing == true){
			for(var c=0;c<channels.length;c++){
				if(channels[c].indexval == jQuery(this).data('sample_index')){
					channels[c].sound.change_volume(jQuery(this).val());
				}
			}
		}
	});

	

    jQuery('body').on('click', '.record', function(e){
    	if(jQuery(this).hasClass('active')){
    		jQuery(this).removeClass('active');
    		record = false;
    	} else {
    		jQuery(this).addClass('active');
    		record = true;
    	}
    });
}

jQuery(document).ready(function(){
	jQuery('.loadMappingModalTrigger').click(function(e){
		jQuery.ajax({
		  method: "POST",
		  url: "list_maps.php",
		}).done(function( response ) {
			var devices = JSON.parse(response);
			var output = '<option value="" selected="selected">Please select a device</option>';
			for(var i=0; i<devices.length; i++){
				output += '<option value="'+devices[i].replace(".json", "")+'">'+devices[i].replace(".json", "")+'</option>';
			}
			jQuery('.midi-device').html(output);
			
		    jQuery('.modal-outer-load').fadeIn();
		});

		
	});
	jQuery('.loadProjectModalTrigger').click(function(e){
		jQuery('.close-project').each(function(){
			jQuery(this).fadeOut();
		});
		jQuery('.modal-outer-project').fadeIn();
	});
	jQuery('.save_midi').click(function(e){
		jQuery('.modal-outer-save').fadeIn();
	});
	jQuery('.device-load').click(function(e){
		var val = jQuery('.midi-device').val();
		jQuery.ajax({
		  method: "POST",
		  url: "get_device.php",
		  data: { file: val }
		}).done(function( response ) {
		    var midiMapObj = JSON.parse(response);
		    loadMapData(midiMapObj);
		});
	});
	jQuery('.device-save').click(function(e){
		var val = jQuery('.device_name').val();
		jQuery.ajax({
		  method: "POST",
		  url: "device_upload.php",
		  data: { file: val, midiMap: JSON.stringify(midiMap) }
		}).done(function( response ) {
		    if(response == 1){
		    	jQuery('.alert-mappings-saved').fadeIn(500, function(){
		    		setTimeout(function(){
		    			jQuery('.alert-mappings-saved').fadeOut();
		    		});
		    	});
		    }
		});
	});
	jQuery('.project-load').click(function(e){
		sounds = [];
		channels = [];
		names = [];
		jQuery('.progress-bar').css('width', '0%');
		var val = jQuery('.project-file').val();
		jQuery.ajax({
		  method: "POST",
		  url: "get_project.php",
		  data: { file: val }
		}).done(function( response ) {
			sounds = JSON.parse(response);
			jQuery.ajax({
			  method: "POST",
			  url: "get_project_names.php",
			  data: { file: val }
			}).done(function( nameobj ) {
				jQuery('.loader').fadeIn();
				names = JSON.parse(nameobj);
				jQuery.ajax({
				  method: "POST",
				  url: "get_project_info.php",
				  data: { file: val }
				}).done(function( info ) {
					var infoObj = JSON.parse(info);
					jQuery('.title_name').html(infoObj.title);
					let buffer = new Buffer(context, sounds);
					buffer.loadAll(masterGain, delay, delay2, convolver);
				});
			});
		});
	});

	
	jQuery('.close-modal').click(function(e){
		jQuery('.modal-outer').fadeOut();
		jQuery('.modal-outer-load').fadeOut();
		jQuery('.modal-outer-project').fadeOut();
		jQuery('.modal-outer-save').fadeOut();
	});
	jQuery('.close_btn').click(function(e){
		jQuery('.modal-outer').fadeOut();
		jQuery('.modal-outer-load').fadeOut();
		jQuery('.modal-outer-project').fadeOut();
		jQuery('.modal-outer-save').fadeOut();
	});
	jQuery('body').on('click', '.play_sample',function(e){
		playing = true;
		for(var c=0;c<channels.length;c++){
			if(channels[c].indexval == jQuery(this).data('sample_index')){
				channels[c].sound.play();
			}
		}

		jQuery(this).fadeOut(50, function(){
			jQuery(this).parent().find('.stop_sample').fadeIn();
		});
	});
	jQuery('body').on('click', '.stop_sample', function(e){
		for(var c=0;c<channels.length;c++){
			if(channels[c].indexval == jQuery(this).data('sample_index')){
				channels[c].sound.stop();
			}
		}
		jQuery(this).fadeOut(50, function(){
			jQuery(this).parent().find('.play_sample').fadeIn();
		});
		
	});
	jQuery('body').on('click', '.play_all_samples', function(e){
		if(record == true){
			rec.record();
		}
		for(var i=0; i<channels.length;i++){
			channels[i].sound.play();
		}
		jQuery(this).fadeOut(50, function(){
			jQuery('.stop_all_samples').fadeIn();
		});
		jQuery('.play_sample').each(function(){
			jQuery(this).fadeOut(50, function(){
				jQuery(this).parent().find('.stop_sample').fadeIn();
			});
		});
		playing = true;
	});

	jQuery('body').on('click', '.stop_all_samples', function(e){
		for(var i=0; i<channels.length;i++){
			channels[i].sound.stop();
		}
		jQuery(this).fadeOut(50, function(){
			jQuery('.play_all_samples').fadeIn();
		});
		jQuery('.stop_sample').each(function(){
			jQuery(this).fadeOut(50, function(){
				jQuery(this).parent().find('.play_sample').fadeIn();
			});
		});
		if(record == true){
			rec.stop();
			createDownloadLink();
		}
		playing = false;
	});

	jQuery('body').on('click', '.mute_button', function(e){
		if(playing == true){
			if(jQuery(this).hasClass('active')){
				for(var c=0;c<channels.length;c++){
					if(channels[c].indexval == jQuery(this).data('sample_index')){
						if(channels[c].sound.unmute() == true){
							jQuery(this).removeClass('active');
							jQuery(this).parent().parent().find('.delay_holder').find('.delay_temp_button').removeClass('active');
						}
					}
				}
			} else {
				for(var c=0;c<channels.length;c++){
					if(channels[c].indexval == jQuery(this).data('sample_index')){
						if(channels[c].sound.mute() == true){
							jQuery(this).addClass('active');
						}
					}
				}
			}
		}
	});

	var controls = jQuery(".controls");

  	controls.find("input[name='delayTime2']").on('input', function() {
  		if(playing == true){
	  		delay.delayTime.value = jQuery(this).val();
	  	}
	});

	controls.find("input[name='feedback']").on('input', function() {
		if(playing == true){
			feedback.gain.value = jQuery(this).val();
		}
	});

	jQuery(".delayFeedback").knob({
		'width': 40,
		'height': 40,
		'min':0,
		'max':120,
		'bgColor': '#d4d4d4',
		'fgColor': '#ffa500',
    	'change':function(e){
    		if(playing == true){
            	var val = e;
            	feedback.gain.value = ((val/100));
        	}
        }
    });

	jQuery(".delayFeedback2").knob({
		'width': 40,
		'height': 40,
		'min':0,
		'max':120,
		'bgColor': '#d4d4d4',
		'fgColor': '#ffa500',
    	'change':function(e){
    		if(playing == true){
            	var val = e;
            	feedback2.gain.value = ((val/100));
        	}
        }
    });	

    jQuery(".reverbSeconds").knob({
    	'width': 40,
		'height': 40,
		'min':0,
		'max':3,
		'bgColor': '#d4d4d4',
		'fgColor': '#ffa500',
    	'change':function(e){
    		reverbOptions.seconds = e;
    		convolverObj.updateOpts(reverbOptions);
    		convolverObj.buildImpulse();
        }
    });
    jQuery(".reverbDecay").knob({
    	'width': 40,
		'height': 40,
		'min':0,
		'max':10,
		'bgColor': '#d4d4d4',
		'fgColor': '#ffa500',
    	'change':function(e){
    		reverbOptions.decay = e;
    		convolverObj.updateOpts(reverbOptions);
    		convolverObj.buildImpulse();
        }
    });
    jQuery('.dark_mode_trigger').click(function(e){
    	if(jQuery(this).hasClass('active')){
			jQuery(this).html("Dark Mode");
    		jQuery('.mixer-element').each(function(){
    			jQuery(this).removeClass('dark_mode');
			});
			jQuery('.modal-inner').each(function(){
    			jQuery(this).removeClass('dark_mode');
			});
			jQuery('.sample').each(function(){
    			jQuery(this).removeClass('dark_mode');
			});
			jQuery('.record').removeClass('dark_mode');
			jQuery('.jumbotron').removeClass('dark_mode');
			jQuery('body').removeClass('dark_mode');
			jQuery(this).removeClass('active');
    	} else {
    		jQuery(this).html("Light Mode");
    		jQuery('.mixer-element').each(function(){
				jQuery(this).addClass('dark_mode');
			});
			jQuery('.modal-inner').each(function(){
    			jQuery(this).addClass('dark_mode');
			});
			jQuery('.sample').each(function(){
    			jQuery(this).addClass('dark_mode');
			});

			jQuery('.record').addClass('dark_mode');
			jQuery('.jumbotron').addClass('dark_mode');
			jQuery('body').addClass('dark_mode');
			jQuery(this).addClass('active');
    	}
    	
    });
});
	
dark_mode = false;


function createDownloadLink() {
    rec && rec.exportWAV(function(blob) {
      var url = URL.createObjectURL(blob);
      var li = document.createElement('li');
      var au = document.createElement('audio');
      var hf = document.createElement('a');
      
      au.controls = true;
      au.src = url;
      hf.href = url;
      hf.download = new Date().toISOString() + '.wav';
      hf.innerHTML = hf.download;
      li.appendChild(au);
      li.appendChild(hf);
      recordingslist.appendChild(li);
    });
}	
setTimeout(function(){ 
	jQuery('.loader').fadeOut();
	//setTimeout(function(){ mapMidi(channels); }, 3000);
	jQuery('.close-modal').fadeIn();
	jQuery('.close_btn').fadeIn();
}, 3000);