//web midi
var midiMap = null;
var midiInputs = null;
var currentMapElement = null;
var currentChannel = null;
var currentType = null;
var pressCount = 0;


if (navigator.requestMIDIAccess) {
	if(debug === true){ console.log('Browser supports MIDI!'); }
    navigator.requestMIDIAccess().then(midiSuccess, midiFailure);
}
function midiSuccess (midi) {
    if(debug === true){ console.log('Got midi!', midi); }
    midiInputs = midi.inputs.values();
    for (var input = midiInputs.next();
	     input && !input.done;
	     input = midiInputs.next()) {
	    // each time there is a midi message call the onMIDIMessage function
	    input.value.onmidimessage = onMIDIMessage;
	}
}
 
function midiFailure () {
    console.error('No access to your midi devices.')
}

function onMIDIMessage (message) {
	if(mapEnabled == true){
		for(var i=0; i<midiMap.midiChannels.length; i++){
			if(midiMap.midiChannels[i].indexval == currentChannel){
				if(currentType == "channel_volume"){
					midiMap.midiChannels[i].volumeMidiNote = message.data[1];
					jQuery('.midi_cc_v_'+midiMap.midiChannels[i].indexval).html(message.data[1]);
				}
				if(currentType == "channel_delay"){
					midiMap.midiChannels[i].delayMidiNote = message.data[1];
					jQuery('.midi_cc_d_'+midiMap.midiChannels[i].indexval).html(message.data[1]);
				}
				if(currentType == "channel_delay2"){
					jQuery('.midi_cc_d2_'+midiMap.midiChannels[i].indexval).html(message.data[1]);
					midiMap.midiChannels[i].delay2MidiNote = message.data[1];
				}
				if(currentType == "channel_mute"){
					midiMap.midiChannels[i].muteMidiNote = message.data[1];
					jQuery('.midi_cc_m_'+midiMap.midiChannels[i].indexval).html(message.data[1]);
				}
				if(currentType == "channel_reverb"){
					midiMap.midiChannels[i].reverbMidiNote = message.data[1];
					jQuery('.midi_cc_r_'+midiMap.midiChannels[i].indexval).html(message.data[1]);
				}
			}
		}
		if(currentType == "delay_feedback" && currentChannel == null){
			midiMap.delayFeedbackMidiNote = message.data[1];
			jQuery('.midi_cc_dfb_'+midiMap.midiChannels[i].indexval).html(message.data[1]);
		}
		if(currentType == "delay_feedback2" && currentChannel == null){
			midiMap.delayFeedback2MidiNote = message.data[1];
			jQuery('.midi_cc_dfb2_'+midiMap.midiChannels[i].indexval).html(message.data[1]);
		}
		if(currentType == "delay_time2" && currentChannel == null){
			midiMap.delayTime2MidiNote = message.data[1];
			jQuery('.midi_cc_dt_'+midiMap.midiChannels[i].indexval).html(message.data[1]);
		}
	} else {
		for(var i=0; i<midiMap.midiChannels.length; i++){
			if(message.data[1] == midiMap.midiChannels[i].volumeMidiNote){
				value = (message.data[2] + 1) / 128;
				for(var c=0; c<channels.length;c++){
					if(channels[c].indexval == midiMap.midiChannels[i].indexval){
						if(playing == true){ channels[c].sound.change_volume(value); }
						jQuery('.channel_volume_'+midiMap.midiChannels[i].indexval).val(value);
					}
				}
			} else if(message.data[1] == midiMap.midiChannels[i].muteMidiNote){
				if(message.data[0] != 176){
					for(var c=0; c<channels.length;c++){
						if(channels[c].indexval == midiMap.midiChannels[i].indexval){
							if(pressCount == 1){
								if(channels[c].sound.muted == true){
									channels[c].sound.unmute();
									jQuery('.mute_button_'+midiMap.midiChannels[i].indexval).removeClass('active');
								} else {
									channels[c].sound.mute();
									jQuery('.mute_button_'+midiMap.midiChannels[i].indexval).addClass('active');
								}
								pressCount = 0;
							} else {
								pressCount++;
							}
						}
					}
				}
			} else if(message.data[1] == midiMap.midiChannels[i].delayMidiNote){
				if(message.data[0] == 176){
					value = (message.data[2] + 1) / 128;
					for(var c=0; c<channels.length;c++){
						if(channels[c].indexval == midiMap.midiChannels[i].indexval){
							if(playing == true){ 
								if(value != 0){
									val = value;
								} else {
									val = 0.001;
								}
								channels[c].sound.change_delay(value); 
							}
							jQuery('.delay_dial_'+midiMap.midiChannels[i].indexval).val(Math.round(value*100)).trigger('change');
						}
					}
				}
			} else if(message.data[1] == midiMap.midiChannels[i].delay2MidiNote){
				if(message.data[0] == 176){
					value = (message.data[2] + 1) / 128;
					for(var c=0; c<channels.length;c++){
						if(channels[c].indexval == midiMap.midiChannels[i].indexval){
							if(playing == true){ 
								if(value != 0){
									val = value;
								} else {
									val = 0.001;
								}
								channels[c].sound.change_delay2(value); 
							}
							jQuery('.delay2_dial_'+midiMap.midiChannels[i].indexval).val(Math.round(value*100)).trigger('change');
						}
					}
				}
			} else if(message.data[1] == midiMap.midiChannels[i].reverbMidiNote){
				value = (message.data[2] + 1) / 128;
				for(var c=0; c<channels.length;c++){
					if(channels[c].indexval == midiMap.midiChannels[i].indexval){
						if(playing == true){ 
							if(value != 0){
								val = value;
							} else {
								val = 0.001;
							}
							channels[c].sound.change_reverb(value); 
						}
						jQuery('.reverb_dial_'+midiMap.midiChannels[i].indexval).val(Math.round(value*100)).trigger('change');
					}
				}
			}
		}
		if(message.data[1] == midiMap.delayTime2MidiNote){
			val = ((message.data[2] + 1) / 128);
			jQuery('.delayTime2').val(val);
			delay2.delayTime.value = val;
		}
		if(message.data[1] == midiMap.delayFeedbackMidiNote){
			value = (message.data[2] + 1) / 128;
			if(value != 0){
				val = value;
			} else {
				val = 0.001;
			}
			jQuery('.delayFeedback').val(Math.round(value*100)).trigger('change');
			feedback.gain.value = val;
		}
		if(message.data[1] == midiMap.delayFeedback2MidiNote){
			value = (message.data[2] + 1) / 128;
			if(value != 0){
				val = value;
			} else {
				val = 0.001;
			}
			jQuery('.delayFeedback2').val(Math.round(value*100)).trigger('change');
			feedback2.gain.value = val;
		}
		if(message.data[1] == midiMap.delayFrequencyMidiNote){
			value = (message.data[2] + 1) / 128;
			value = value * 4000;
			jQuery('.delayCutoff').val(value).trigger('change');
			filter.frequency.value = val;
		}
	}    
}

function mapMidi()
{
	if(debug === true){ console.log('Mapping midi...'); }
	midiMap = new Map(channels);
	if(debug === true){ console.log('finished mapping midi...'); }
}

function loadMapData(data)
{
	for(var i=0; i<midiMap.midiChannels.length; i++){
		if(midiMap.midiChannels[i].indexval == 0){
			for(var d=0;d<data.midiChannels.length;d++){
				if(data.midiChannels[d].indexval == 0){
					//first_channel
					midiMap.midiChannels[i].volumeMidiNote = data.midiChannels[d].volumeMidiNote;
					jQuery('.midi_cc_v_0').html(data.midiChannels[d].volumeMidiNote);
					midiMap.midiChannels[i].muteMidiNote = data.midiChannels[d].muteMidiNote;
					jQuery('.midi_cc_m_0').html(data.midiChannels[d].muteMidiNote);
					midiMap.midiChannels[i].delayMidiNote = null;
					midiMap.midiChannels[i].delay2MidiNote = null;
					midiMap.midiChannels[i].reverbMidiNote = null;
				}
			}
		}
		if(midiMap.midiChannels[i].indexval == 1){
			for(var d=0;d<data.midiChannels.length;d++){
				if(data.midiChannels[d].indexval == 1){
					//second
					midiMap.midiChannels[i].volumeMidiNote = data.midiChannels[d].volumeMidiNote;
					jQuery('.midi_cc_v_1').html(data.midiChannels[d].volumeMidiNote);
					midiMap.midiChannels[i].muteMidiNote = data.midiChannels[d].muteMidiNote;
					jQuery('.midi_cc_m_1').html(data.midiChannels[d].muteMidiNote);
					midiMap.midiChannels[i].delayMidiNote = data.midiChannels[d].delayMidiNote;
					jQuery('.midi_cc_d_1').html(data.midiChannels[d].delayMidiNote);
					midiMap.midiChannels[i].delay2MidiNote = data.midiChannels[d].delay2MidiNote;
					jQuery('.midi_cc_d2_1').html(data.midiChannels[d].delay2MidiNote);
					midiMap.midiChannels[i].reverbMidiNote = data.midiChannels[d].reverbMidiNote;
					jQuery('.midi_cc_r_1').html(data.midiChannels[d].reverbMidiNote);
				}
			}
		}
		if(midiMap.midiChannels[i].indexval == 4){
			for(var d=0;d<data.midiChannels.length;d++){
				if(data.midiChannels[d].indexval == 4){
					//fifth channel
					midiMap.midiChannels[i].volumeMidiNote = data.midiChannels[d].volumeMidiNote;
					jQuery('.midi_cc_v_4').html(data.midiChannels[d].volumeMidiNote);
					midiMap.midiChannels[i].muteMidiNote = data.midiChannels[d].muteMidiNote;
					jQuery('.midi_cc_m_4').html(data.midiChannels[d].muteMidiNote);
					midiMap.midiChannels[i].delayMidiNote = data.midiChannels[d].delayMidiNote;
					jQuery('.midi_cc_d_4').html(data.midiChannels[d].delayMidiNote);
					midiMap.midiChannels[i].delay2MidiNote = data.midiChannels[d].delay2MidiNote;
					jQuery('.midi_cc_d2_4').html(data.midiChannels[d].delay2MidiNote);
					midiMap.midiChannels[i].reverbMidiNote = data.midiChannels[d].reverbMidiNote;
					jQuery('.midi_cc_r_4').html(data.midiChannels[d].reverbMidiNote);
				}
			}
		}
		if(midiMap.midiChannels[i].indexval == 5){
			for(var d=0;d<data.midiChannels.length;d++){
				if(data.midiChannels[d].indexval == 5){
					//sixth
					midiMap.midiChannels[i].volumeMidiNote = data.midiChannels[d].volumeMidiNote;
					jQuery('.midi_cc_v_5').html(data.midiChannels[d].volumeMidiNote);
					midiMap.midiChannels[i].muteMidiNote = data.midiChannels[d].muteMidiNote;
					jQuery('.midi_cc_m_5').html(data.midiChannels[d].muteMidiNote);
					midiMap.midiChannels[i].delayMidiNote = data.midiChannels[d].delayMidiNote;
					jQuery('.midi_cc_d_5').html(data.midiChannels[d].delayMidiNote);
					midiMap.midiChannels[i].delay2MidiNote = data.midiChannels[d].delay2MidiNote;
					jQuery('.midi_cc_d2_5').html(data.midiChannels[d].delay2MidiNote);
					midiMap.midiChannels[i].reverbMidiNote = data.midiChannels[d].reverbMidiNote;
					jQuery('.midi_cc_r_5').html(data.midiChannels[d].reverbMidiNote);
				}
			}
		}
		if(midiMap.midiChannels[i].indexval == 6){
			for(var d=0;d<data.midiChannels.length;d++){
				if(data.midiChannels[d].indexval == 6){
					//seventh
					midiMap.midiChannels[i].volumeMidiNote = data.midiChannels[d].volumeMidiNote;
					jQuery('.midi_cc_v_6').html(data.midiChannels[d].volumeMidiNote);
					midiMap.midiChannels[i].muteMidiNote = data.midiChannels[d].muteMidiNote;
					jQuery('.midi_cc_m_6').html(data.midiChannels[d].muteMidiNote);
					midiMap.midiChannels[i].delayMidiNote = data.midiChannels[d].delayMidiNote;
					jQuery('.midi_cc_d_6').html(data.midiChannels[d].delayMidiNote);
					midiMap.midiChannels[i].delay2MidiNote = data.midiChannels[d].delay2MidiNote;
					jQuery('.midi_cc_d2_6').html(data.midiChannels[d].delay2MidiNote);
					midiMap.midiChannels[i].reverbMidiNote = data.midiChannels[d].reverbMidiNote;
					jQuery('.midi_cc_r_6').html(data.midiChannels[d].reverbMidiNote);
				}
			}
		}
		if(midiMap.midiChannels[i].indexval == 7){
			for(var d=0;d<data.midiChannels.length;d++){
				if(data.midiChannels[d].indexval == 7){
					//eighth
					midiMap.midiChannels[i].volumeMidiNote = data.midiChannels[d].volumeMidiNote;
					jQuery('.midi_cc_v_7').html(data.midiChannels[d].volumeMidiNote);
					midiMap.midiChannels[i].muteMidiNote = data.midiChannels[d].muteMidiNote;
					jQuery('.midi_cc_m_7').html(data.midiChannels[d].muteMidiNote);
					midiMap.midiChannels[i].delayMidiNote = data.midiChannels[d].delayMidiNote;
					jQuery('.midi_cc_d_7').html(data.midiChannels[d].delayMidiNote);
					midiMap.midiChannels[i].delay2MidiNote = data.midiChannels[d].delay2MidiNote;
					jQuery('.midi_cc_d2_7').html(data.midiChannels[d].delay2MidiNote);
					midiMap.midiChannels[i].reverbMidiNote = data.midiChannels[d].reverbMidiNote;
					jQuery('.midi_cc_r_7').html(data.midiChannels[d].reverbMidiNote);
				}
			}
		}
		if(midiMap.midiChannels[i].indexval == 8){
			for(var d=0;d<data.midiChannels.length;d++){
				if(data.midiChannels[d].indexval == 8){
					//ninth
					midiMap.midiChannels[i].volumeMidiNote = data.midiChannels[d].volumeMidiNote;
					jQuery('.midi_cc_v_8').html(data.midiChannels[d].volumeMidiNote);
					midiMap.midiChannels[i].muteMidiNote = data.midiChannels[d].muteMidiNote;
					jQuery('.midi_cc_m_8').html(data.midiChannels[d].muteMidiNote);
					midiMap.midiChannels[i].delayMidiNote = data.midiChannels[d].delayMidiNote;
					jQuery('.midi_cc_d_8').html(data.midiChannels[d].delayMidiNote);
					midiMap.midiChannels[i].delay2MidiNote = null;
					midiMap.midiChannels[i].reverbMidiNote = data.midiChannels[d].reverbMidiNote;
					jQuery('.midi_cc_r_8').html(data.midiChannels[d].reverbMidiNote);
				}
			}
		}
		if(midiMap.midiChannels[i].indexval == 9){
			for(var d=0;d<data.midiChannels.length;d++){
				if(data.midiChannels[d].indexval == 9){
					//ninth
					midiMap.midiChannels[i].volumeMidiNote = data.midiChannels[d].volumeMidiNote;
					jQuery('.midi_cc_v_9').html(data.midiChannels[d].volumeMidiNote);
				}
			}
		}
	}
	midiMap.delayTime2MidiNote = data.delayTime2MidiNote;
	jQuery('.midi_cc_dt').html(data.delayTime2MidiNote);
	midiMap.delayFeedbackMidiNote = data.delayFeedbackMidiNote;
	jQuery('.midi_cc_dfb').html(data.delayFeedbackMidiNote);
	midiMap.delayFeedback2MidiNote = data.delayFeedback2MidiNote;
	jQuery('.midi_cc_dfb2').html(data.delayFeedback2MidiNote);
	
	midiMap.delayFrequencyMidiNote = null;
	jQuery('.alert-mappings-loaded').fadeIn(500, function(){
		setTimeout(function(){ jQuery('.alert-mappings-loaded').fadeOut(); }, 3000);
	});
	return true;
}

class MidiChannel {
	constructor(indexval){
		this.volumeMidiNote = null;
		this.muteMidiNote = null;
		this.delayMidiNote = null;
		this.delay2MidiNote = null;
		this.reverbMidiNote = null;
		this.indexval = indexval;
	}

	setVolumeNote(value) {
		this.volumeMidiNote = value;
	}

	setMuteNote(value) {
		this.muteMidiNote = value;
	}

	setDelayNote(value) {
		this.delayMidiNote = value;
	}

	setDelay2Note(value) {
		this.delay2MidiNote = value;
	}

	setReverbNote(value) {
		this.reverbMidiNote = value;
	}
}

class Map {
	constructor(channels){
		this.midiChannels = [];
		this.delayTimeMidiNote = null;
		this.delayTime2MidiNote = null;
		this.delayFeedbackMidiNote = null;
		this.delayFeedback2MidiNote = null;
		this.delayFrequencyMidiNote = null;
		for(var i=0; i<channels.length; i++){
			this.midiChannels.push(new MidiChannel(channels[i].indexval));
		}
	}
}

jQuery('body').on('click', '.map_midi', function(e){
	if(jQuery(this).hasClass('active')){
		mapEnabled = false;
		jQuery('.save_midi_li').fadeOut();
		if(debug === true){ console.log('midi mapping mode disabled'); }
		jQuery(this).removeClass("active");
		jQuery('.midi_cc').each(function(){
			jQuery(this).removeClass('active');
		});
		jQuery('.mixer-element').each(function(){
			jQuery(this).removeClass('greenbg');
		});

	} else {
		mapEnabled = true;
		if(debug === true){ console.log('midi mapping mode enabled'); }
		jQuery('.save_midi_li').fadeIn();
		jQuery(this).addClass("active");
		jQuery('.midi_cc').each(function(){
			jQuery(this).addClass('active');
		});
		jQuery('.mixer-element').each(function(){
			jQuery(this).addClass('greenbg');
		});
	}
});

jQuery('body').click(function(e){
	if(mapEnabled == true){
		e.preventDefault();
		if(jQuery(e.target).hasClass("channel_volume")){
			currentMapElement = e.target;
			currentType = "channel_volume";
			currentChannel = jQuery(e.target).parent().data("channel_id");
		} else if(jQuery(e.target).hasClass("mute_button")){
			currentMapElement = e.target;
			currentType = "channel_mute";
			currentChannel = jQuery(e.target).parent().data("channel_id");
		} else if(jQuery(e.target).hasClass("time")){
			currentMapElement = e.target;
			currentChannel = null;
			currentType = "delay_time";
		} else {
			//console.dir(jQuery(e.target));	
		}
		if(jQuery(e.target).hasClass("delayTime2")){
			currentMapElement = e.target;
			currentChannel = null;
			currentType = "delay_time2";
		}
		if(e.target.tagName=="CANVAS"){
			//we know its a canvas but dont know which... look at the parent element
			if(jQuery(e.target).parent().parent().hasClass('delay_holder') || jQuery(e.target).parent().parent().hasClass('reverb_holder')){
				if(jQuery(e.target).parent().parent().hasClass('delay_holder')){
					currentType = "channel_delay";
					currentMapElement = e.target;
					currentChannel = jQuery(e.target).parent().parent().data("channel_id");
				} else {
					currentType = "channel_reverb";
					currentMapElement = e.target;
					currentChannel = jQuery(e.target).parent().parent().data("channel_id");
				}
			} else if(jQuery(e.target).parent().parent().hasClass('delay2_holder')){
				currentType = "channel_delay2";
				currentMapElement = e.target;
				currentChannel = jQuery(e.target).parent().parent().data("channel_id");
			} else if(jQuery(e.target).parent().parent().hasClass('feedback')){
				currentMapElement = e.target;
				currentChannel = null;
				currentType = "delay_feedback";
			}  else if(jQuery(e.target).parent().parent().hasClass('feedback2')){
				currentMapElement = e.target;
				currentChannel = null;
				currentType = "delay_feedback2";
			} 
		}
	}
});
jQuery('body').on('click', '.loadMapData', function(){
	loadMapData();
});