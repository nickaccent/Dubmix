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
		<link rel="stylesheet" href="css/styles_preamp.css?v=1.0">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js" integrity="sha384-vFJXuSJphROIrBnz7yo7oB41mKfc8JzQZiCq4NCceLEaO4IHwicKwpJf9c9IpFgh" crossorigin="anonymous"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/js/bootstrap.min.js" integrity="sha384-alpBpkh1PFOepccYVYDB4do5UnbKysX5WZXm3XxPqe5iKTfUKjNkCk9SaVuEZflJ" crossorigin="anonymous"></script>
		<!--[if lt IE 9]>
			<script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.js"></script>
		<![endif]-->
</head>

<body>
	<nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
			<a class="navbar-brand" href="/">Dubmix Preamp</a>
			<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>

			<div class="collapse navbar-collapse" id="navbarsExampleDefault">
				<ul class="navbar-nav mr-auto">
					<li class="nav-item active">
						<a class="nav-link" href="/">Home</a>
					</li>
					<li class="nav-item active">
						<a class="nav-link" href="/preamp.php">Pre-Amp <span class="sr-only">(current)</span></a>
					</li>
					<li class="nav-item active">
						<a class="nav-link" href="/eq.php">EQ</a>
					</li>
				</ul>
				<form class="form-inline my-2 my-lg-0">
					<input class="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search">
					<button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
				</form>
			</div>
	</nav>

	<main role="main">
		<div class="container">
			<!-- Example row of columns -->
			<div class="row">
				<div class="col-12">
					<div class="row mainrow">
						<div class="record"><i class="fa fa-circle" aria-hidden="true"></i></div>
						<div class="play_all"><i class="fa fa-play-circle play_all_samples" aria-hidden="true"></i><i class="fa fa-stop-circle stop_all_samples" aria-hidden="true"></i></div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-3">
					<div class="kill_holder">
						<p>Subs</p>
						<canvas id="meter_low" class="meter" width="100" height="50"></canvas>
						<section>
						  <input type="checkbox" id="kill_button_low" class="kill_button" data-band="low"/>
						  <label for="kill_button_low"></label>						  
						  <p>Kill: true</p>
						  <p>Kill: false</p>
						</section>
					</div>
				</div>
				<div class="col-3">
					<div class="kill_holder">
						<p>Kicks</p>
						<canvas id="meter_kick" class="meter" width="100" height="50"></canvas>
						<section>
						  <input type="checkbox" id="kill_button_kick" class="kill_button" data-band="kick"/>
						  <label for="kill_button_kick"></label>						  
						  <p>Kill: true</p>
						  <p>Kill: false</p>
						</section>
					</div>
				</div>
				<div class="col-3">
					<div class="kill_holder">
						<p>Mids</p>
						<canvas id="meter_mid" class="meter" width="100" height="50"></canvas>
						<section>
						  <input type="checkbox" id="kill_button_mid" class="kill_button" data-band="mid"/>
						  <label for="kill_button_mid"></label>						  
						  <p>Kill: true</p>
						  <p>Kill: false</p>
						</section>						
					</div>
				</div>
				<div class="col-3">
					<div class="kill_holder">
						<p>Tops</p>
						<canvas id="meter_top" class="meter" width="100" height="50"></canvas>
						<section>
						  <input type="checkbox" id="kill_button_top" class="kill_button" data-band="top"/>
						  <label for="kill_button_top"></label>						  
						  <p>Kill: true</p>
						  <p>Kill: false</p>
						</section>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-4">
					<div class="sweep_holder" data-band="low"><p>Low Sweep</p><input type="text" value="62.5" class="low_sweep" data-band="low"></div>
				</div>
				<div class="col-4">
					<div class="sweep_holder" data-band="mid"><p>Mid Sweep</p><input type="text" value="2295" class="mid_sweep" data-band="mid"></div>
				</div>
				<div class="col-4">
					<div class="sweep_holder" data-band="top"><p>Top Sweep</p><input type="text" value="7250" class="top_sweep" data-band="top"></div>
				</div>
			</div>
		</div>
	</main>

	<footer class="container">
		<p>© Nick Thompson 2017</p>
	</footer>
	<script src="js/scripts_preamp.js"></script>
	<script src="js/knob.js"></script>
</body>
</html>