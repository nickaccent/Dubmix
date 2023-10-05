<?php include("functions.php"); ?>
<!doctype html>
<html lang="en">
<head>
		<meta charset="utf-8">

		<title>DubMix</title>
		<meta name="description" content="The DubMix Site">
		<meta name="author" content="Dutty Hands">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css" integrity="sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb" crossorigin="anonymous">
		<link rel="stylesheet" href="css/font-awesome.css?v=1.0">
		<link rel="stylesheet" href="css/styles.css?v=1.0">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js" integrity="sha384-vFJXuSJphROIrBnz7yo7oB41mKfc8JzQZiCq4NCceLEaO4IHwicKwpJf9c9IpFgh" crossorigin="anonymous"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/js/bootstrap.min.js" integrity="sha384-alpBpkh1PFOepccYVYDB4do5UnbKysX5WZXm3XxPqe5iKTfUKjNkCk9SaVuEZflJ" crossorigin="anonymous"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/wavesurfer.js/1.4.0/wavesurfer.min.js"></script>
		<script src="js/siren.js"></script>
		<!--[if lt IE 9]>
			<script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.js"></script>
		<![endif]-->
</head>

<body>
	<nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
			<a class="navbar-brand" href="#">Dubmix</a>
			<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>

			<div class="collapse navbar-collapse" id="navbarsExampleDefault">
				<ul class="navbar-nav mr-auto">
					<li class="nav-item active">
						<a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
					</li>
					<li class="nav-item active">
						<a class="nav-link" href="/preamp.php">Pre-Amp</a>
					</li>
					<li class="nav-item active">
						<a class="nav-link" href="/eq.php">EQ</a>
					</li>
					<li class="nav-item">
						<div class="nav-link loadProjectModalTrigger">Load Project</div>
					</li>
					<li class="nav-item map_midi_li">
						<div class="nav-link map_midi">Map Midi</div>
					</li>
					<li class="nav-item save_midi_li">
						<div class="nav-link save_midi">Save Midi Map</div>
					</li>
					<li class="nav-item load_mappings_li">
						<div class="nav-link loadMappingModalTrigger">Load Mapping</div>
					</li>
					<li class="nav-item pull-right dark_mode_li">
						<div class="nav-link dark_mode_trigger">Dark Mode</div>
					</li>
				</ul>
			</div>
	</nav>
	<main role="main">
	<div class="jumbotron">
		<div class="container">
			<h2 class="title_name">Dubmix</h2>
			<div class="alert alert-success alert-mapping-saved">
				<strong>Successfully</strong> saved this Mapping.
			</div>
		</div>
	</div>

	<div class="container">
		<div class="row">
			<div class="row inner-controls-row">
				<div class="col-2 control-panel mixer-element">
					<div class="delay_controls">
						<div class="controls">
							<h5>Delay I (Infinite)</h5>
							<div class="row">
								<div class="col-12 feedback">
									<p><span>Feedback</span>
									<input type="text" value="80" class="delayFeedback" name="feedback"></p>
									<span class="midi_cc midi_cc_dfb"></span>
								</div>
							</div>				  
						</div>
					</div>
				</div>
				<div class="col-2 control-panel-reverb mixer-element">
					<div class="delay_controls">
						<div class="controls">
							<h5>Reverb</h5>
							<div class="row">
								<div class="col-12 feedback">
									<p><span>Seconds</span>
									<input type="text" value="0.8" data-step="0.1" class="reverbSeconds" name="reverbSeconds"></p>
									<span class="midi_cc midi_cc_rs"></span>
								</div>
								<div class="col-12 feedback">
									<p><span>Decay</span>
									<input type="text" value="3" data-step="0.1" class="reverbDecay" name="reverbDecay"></p>
									<span class="midi_cc midi_cc_rd"></span>
								</div>
							</div>				  
						</div>
					</div>
				</div>
				<div class="col-4 control-panelSiren mixer-element">
					<div class="siren_controls">
						<div class="controls">
							<h5>Dub Siren</h5>
							<div class="row">
								<div class="col-6 siren-left">
									<div class="lfo">
										<span>LFO</span>
										<label>Amplitude<input class="modulationAmplitude" min="1" max="500" step="1" value="200" type="range"><span class="valueDisplay"></span></label>
										<label>
	        								<input type="radio" name="modulationOscillatorType" class="modulationOscillatorType" value="sine">Sine
										</label>
										<label>
											<input type="radio" name="modulationOscillatorType" class="modulationOscillatorType" value="square">Square
										</label>
										<label>
											<input type="radio" name="modulationOscillatorType" class="modulationOscillatorType" value="triangle">Triangle
										</label>
										<label>
											<input type="radio" name="modulationOscillatorType" class="modulationOscillatorType" value="sawtooth" checked="checked">Sawtooth
										</label>
									</div>
										<p><span>Frequency</span><input type="text" value="400" class="mainFrequency" name="mainFrequency"></p>
										<p><span>Modulation</span><input class="modulationFrequency" name="modulationFrequency" data-step="0.1" value="1" type="text"></p>
							          <label class="radio-label">
							            <input type="radio" name="mainOscillatorType" class="mainOscillatorType" value="sine">Sin
							          </label>
							          <label class="radio-label">
							            <input type="radio" name="mainOscillatorType" class="mainOscillatorType" value="square">Squ
							          </label>
							          <label class="radio-label">
							            <input type="radio" name="mainOscillatorType" class="mainOscillatorType" value="triangle">Tri
							          </label>
							          <label class="radio-label">
							            <input type="radio" name="mainOscillatorType" class="mainOscillatorType" value="sawtooth" checked="checked">Saw
							          </label>
								</div>
								<div class="col-6 siren">
									<p><label>Delay/</label><label>Feedback/</label><label>Cutoff</label></p>
									<p class="siren_input_holder">
										<input class="delayTimeSiren" name="delayTimeSiren" value="0.5" data-step="0.01" type="text">
										<input class="delayFeedbackSiren" name="delayFeedbackSiren" data-step="0.01" value="0.4" type="text">
										<input class="delayCutoffFrequencySiren" data-step="10" value="2000" type="text">
									</p>
          							<div class="play_siren btn btn-warning" id="play_siren">Trigger</div>
								</div>
							</div>				  
						</div>
					</div>
				</div>
				<div class="col-4 control-panel2 mixer-element">
					<div class="delay_controls2">
						<div class="controls">
							<h5>Delay V (Variable)</h5>
							<div class="row">
								<div class="col-6 feedback2">
									<p><span>Feedback</span>
									<input type="text" value="80" class="delayFeedback2" name="feedback"></p>
									<span class="midi_cc midi_cc_dfb2"></span>
								</div>
								<div class="col-6 time">
							  		<p><span>Delay Time</span>
							  		<input type="range" name="delayTime2" class="delayTime2" min="0" max="1" value="0.33" step="0.001"></p>
							  		<span class="midi_cc midi_cc_dt"></span>
								</div>
							</div>				  
						</div>
					</div>
				</div>
			</div>
			<div class="project">

			</div>
		</div>
		<hr>
		<h2>Recordings</h2>
  		<ul id="recordingslist"></ul>

	</div><!-- /container -->

	</main>

	<footer class="container">
		<p>© Nick Thompson 2017</p>
	</footer>
	<div class="modal-outer">
		<div class="modal-inner">
			<div class="panel">
				<div class="panel-body">
					<div class="close-modal"><i class="fa fa-times" aria-hidden="true"></i></div>
					<p>Welcome to <strong>Dubmix</strong>!</p>
					<p><strong>To get started: </strong><i>Please click</i> <strong>Load Project</strong> <i>and load a project file.</i></p>
					<p><strong>You can map your own controls</strong> by clicking <strong>Map Midi</strong>.</p>
					<p>Click the <strong>control (dial/slider)</strong> you want to map, move the dial/slider on your hardware controller to complete the mapping.</p>
					<p>To <strong>Save Mappings</strong> simply click the <strong>Save Mappings</strong> link in the <strong>header</strong></p>
					<p>To <strong>Stop Mapping</strong> simply click the <strong>Map Midi</strong> link in the <strong>header</strong> again.</p>
					<p>Latest Updates
						<ul>
							<li>Dark Mode! Turn the ui dark after you have loaded a project.</li>
							<li>Reworked Reverb! Now with more controls (note mappings still to do)</li>
						</ul>
					</p>
					<p><strong>Please be patient as the llamas load the track data</strong>.<p>
					<p>Thanks for using <strong>Dubmix</strong>!</p>
					<div class="btn btn-success close_btn">Close</div>
				</div>
			</div>
		</div>
	</div>
	<div class="modal-outer-load">
		<div class="modal-inner">
			<div class="panel">
				<div class="panel-body">
					<div class="close-modal"><i class="fa fa-times" aria-hidden="true"></i></div>
					<p>Welcome to <strong>Dubmix</strong>!</p>
					<p>Please select the device from the dropdown below:</p>
					<select class="form-control midi-device">
						
					</select>
					<p></p>
					<div class="btn btn-success device-load"><i class="fa fa-folder-open" aria-hidden="true"></i> Load</div>
					<p></p>
					<p><div class="alert alert-success alert-mappings-loaded">
						<strong>Successfully</strong> loaded Mapping.
					</div></p>
					<div class="btn btn-default close_btn">Close</div>
				</div>
			</div>
		</div>
	</div>
	<div class="modal-outer-project">
		<div class="modal-inner">
			<div class="panel">
				<div class="panel-body">
					<div class="close-modal close-project"><i class="fa fa-times" aria-hidden="true"></i></div>
					<p>Welcome to <strong>Dubmix</strong>!</p>
					<p>Please select the project from the dropdown below:</p>
					<select class="form-control project-file">
						<option value="" selected="selected">Please select a project</option>
						<option value="healing">Healing of a Nation</option>
					</select>
					<p></p>
					<div class="btn btn-success project-load"><i class="fa fa-folder-open" aria-hidden="true"></i> Load</div>
					<p></p>
					<div class="loader">
						<p>Loading sounds...</p>
						<div class="progress">
						  <div class="progress-bar" role="progressbar" aria-valuenow="0"
						  aria-valuemin="0" aria-valuemax="100" style="width:0%">
						    <span class="sr-only">0% Complete</span>
						  </div>
						</div>
					</div>
					<p>
						<div class="interim-message">Loading the last bits now...</div>
						<div class="alert alert-success alert-project-loaded">
							<strong>Successfully</strong> loaded Project.
						</div>
					</p>
					<div class="btn btn-default close_btn close-project">Close</div>
				</div>
			</div>
		</div>
	</div>
	<div class="modal-outer-save">
		<div class="modal-inner">
			<div class="panel">
				<div class="panel-body">
					<div class="close-modal"><i class="fa fa-times" aria-hidden="true"></i></div>
					<p>Welcome to <strong>Dubmix</strong>!</p>
					<p>Please enter the name of the device (A-Z & 0-9 only please):</p>
					<p><input type="text" name="device_name" class="form-control device_name">
					<p></p>
					<div class="btn btn-success device-save"><i class="fa fa-floppy-o" aria-hidden="true"></i> Save</div>
					<p></p>
					<p><div class="alert alert-success alert-mappings-saved">
						<strong>Successfully</strong> saved Mapping.
					</div></p>
					<div class="btn btn-default close_btn">Close</div>
				</div>
			</div>
		</div>
	</div>
	<script src="js/knob.js"></script>
	<script src="js/recorder.js"></script>
	<script src="js/midi.js"></script>
	
	<script src="js/scripts.js"></script>

</body>
</html>