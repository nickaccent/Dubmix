class Siren {
    constructor(context){
        this.context = context;
        this.delaySiren = null;
        this.feedbackSiren = null;
        this.filterSiren = null;
        this.spacebar = 32;
        this.mainOscillator; 
        this.modulationOscillator;
        this.sirenPlaying = false;
        this.outputGain = this.context.createGain();
        this.modulationGain = this.context.createGain();
        this.mainFrequencySlider = 400;
        this.modulationFrequencySlider = 1;
        this.modulationAmplitudeSlider = document.querySelector("input.modulationAmplitude");
        this.outputGain.gain.setTargetAtTime(0.25, context.currentTime, 10);
        this.outputGain.connect(this.context.destination);
        this.delayFeedbackSlider = 0.4;
        this.delayTimeSlider = 0.5;
        this.delayCutoffFrequencySlider = 2000;
    }
    updateMainFrequency() {
        this.mainOscillator.frequency.setTargetAtTime(this.mainFrequencySlider, this.context.currentTime,0.0001);
    }
    updateModulationFrequency() {
        this.modulationOscillator.frequency.setTargetAtTime(this.modulationFrequencySlider, this.context.currentTime,0.0001);
    }
    updateModulationAmplitude() {y
        this.modulationGain.gain.setTargetAtTime(this.modulationAmplitudeSlider.value, this.context.currentTime,0.0001);
    }
    play() {

        if (this.sirenPlaying === true) {
          return;
        }
        this.sirenPlaying = true;

        this.mainOscillator = this.context.createOscillator();
        this.mainOscillator.type = jQuery(".mainOscillatorType:checked").val();
        this.mainOscillator.frequency.exponentialRampToValueAtTime(this.mainFrequencySlider, this.context.currentTime + 0.5);

        this.modulationOscillator = this.context.createOscillator();
        //this.modulationOscillator.type = document.querySelector("input[name=modulationOscillatorType]:checked").value;
        this.modulationOscillator.type = jQuery(".modulationOscillatorType:checked").val();
        this.modulationOscillator.frequency.setTargetAtTime(this.modulationFrequencySlider, this.context.currentTime,0.0001);
        this.modulationOscillator.connect(this.modulationGain);

        this.modulationGain.connect(this.mainOscillator.frequency);
        this.modulationGain.gain.setTargetAtTime(this.modulationAmplitudeSlider.value, this.context.currentTime,0.0001);
        this.modulationAmplitudeSlider.addEventListener("input", this.updateModulationAmplitude);
        this.mainOscillator.connect(this.outputGain);
        this.modulationOscillator.start();
        this.mainOscillator.start();
        this.createEcho(this.mainOscillator);
    }
    stop() {
        if (this.sirenPlaying === false) {
          return;
        }
        this.sirenPlaying = false;
        this.mainOscillator.disconnect(this.outputGain);
        this.modulationOscillator.disconnect(this.modulationGain);
        this.modulationGain.disconnect(this.mainOscillator.frequency);
        this.mainOscillator.stop();
        this.modulationOscillator.stop();
    }
    createEcho(source) {
        this.delaySiren = this.delaySiren || this.context.createDelay();
        this.delaySiren.delayTime.setTargetAtTime(this.delayTimeSlider, this.context.currentTime,0.0001);
        this.feedbackSiren = this.feedbackSiren || this.context.createGain();
        this.feedbackSiren.gain.setTargetAtTime(this.delayFeedbackSlider, this.context.currentTime,0.0001);
        this.filterSiren = this.filterSiren || this.context.createBiquadFilter();
        this.filterSiren.frequency.setTargetAtTime(this.delayCutoffFrequencySlider, this.context.currentTime,0.0001);
        this.filterSiren.frequency.linearRampToValueAtTime(this.delayCutoffFrequencySlider - 1000, this.context.currentTime + 2);

        source.connect(this.delaySiren);
        this.delaySiren.connect(this.filterSiren);
        this.filterSiren.connect(this.feedbackSiren);
        this.feedbackSiren.connect(this.outputGain);
        this.feedbackSiren.connect(this.delaySiren);
        return this.delaySiren;
    }
}

jQuery(document).ready(function(){
    jQuery('body').on("mousedown", "#play_siren", function(e){
        siren.play();
    });
    jQuery('body').on("mouseup", "#play_siren", function(e){
        siren.stop();
    });
    jQuery(".mainFrequency").knob({
        'width': 40,
        'height': 40,
        'min':40,
        'max':1000,
        'bgColor': '#d4d4d4',
        'fgColor': '#ffa500',
        'change':function(e){
            var val = e;
            siren.mainFrequencySlider = val;
            siren.updateMainFrequency();
        }
    });

    jQuery(".delayTimeSiren").knob({
        'width': 40,
        'height': 40,
        'min':0.1,
        'max':1,
        'bgColor': '#d4d4d4',
        'fgColor': '#ffa500',
        'change':function(e){
            var val = e;
            siren.delayTimeSlider = val;
            siren.delaySiren.delayTime.setTargetAtTime(siren.delayTimeSlider, context.currentTime,0.0001);
        }
    });

    jQuery(".delayFeedbackSiren").knob({
        'width': 40,
        'height': 40,
        'min':0.1,
        'max':1,
        'bgColor': '#d4d4d4',
        'fgColor': '#ffa500',
        'change':function(e){
            var val = e;
            siren.delayFeedbackSlider = e;
            siren.feedbackSiren.gain.setTargetAtTime(siren.delayFeedbackSlider, context.currentTime,0.0001);
        }
    });

    jQuery(".delayCutoffFrequencySiren").knob({
        'width': 40,
        'height': 40,
        'min':1000,
        'max':10000,
        'bgColor': '#d4d4d4',
        'fgColor': '#ffa500',
        'change':function(e){
            var val = e;
            siren.delayCutoffFrequencySlider = val;
            siren.filterSiren.frequency.setTargetAtTime(siren.delayCutoffFrequencySlider, context.currentTime,0.0001);
            siren.filterSiren.frequency.linearRampToValueAtTime(siren.delayCutoffFrequencySlider - 1000, siren.context.currentTime + 2);
        }
    });
    jQuery(".modulationFrequency").knob({
        'width': 40,
        'height': 40,
        'min':0.1,
        'max':10,
        'bgColor': '#d4d4d4',
        'fgColor': '#ffa500',
        'change':function(e){
            var val = e;
            siren.modulationFrequencySlider = val;
            siren.modulationOscillator.frequency.setTargetAtTime(siren.modulationFrequencySlider, siren.context.currentTime,0.0001);
        }
    });
});