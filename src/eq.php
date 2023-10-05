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
		<link rel="stylesheet" href="css/styles_eq.css?v=1.0">
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
						<a class="nav-link" href="/">Home</span></a>
					</li>
					<li class="nav-item active">
						<a class="nav-link" href="/preamp.php">Pre-Amp</a>
					</li>
					<li class="nav-item active">
						<a class="nav-link" href="/eq.php">EQ <span class="sr-only">(current)</span></a>
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
				<div class="col-12">
					<div class="controls">
					    <label>60Hz</label>
					    <input type="range" value="0" step="1" min="-30" max="30" oninput="changeGain(this.value, 0);"></input>
						<output id="gain0">0 dB</output>
					</div>
					<div class="controls">
					    <label>170Hz</label>
					    <input type="range" value="0" step="1" min="-30" max="30" oninput="changeGain(this.value, 1);"></input>
						<output id="gain1">0 dB</output>
					</div>
					<div class="controls">
					    <label>350Hz</label>
					    <input type="range" value="0" step="1" min="-30" max="30" oninput="changeGain(this.value, 2);"></input>
						<output id="gain2">0 dB</output>
					</div>
					<div class="controls">
					    <label>1000Hz</label>
					    <input type="range" value="0" step="1" min="-30" max="30" oninput="changeGain(this.value, 3);"></input>
						<output id="gain3">0 dB</output>
					</div>
					<div class="controls">
					    <label>3500Hz</label>
					    <input type="range" value="0" step="1" min="-30" max="30" oninput="changeGain(this.value, 4);"></input>
						<output id="gain4">0 dB</output>
					</div>
					<div class="controls">
					    <label>10000Hz</label>
					    <input type="range" value="0" step="1" min="-30" max="30" oninput="changeGain(this.value, 5);"></input>
						<output id="gain5">0 dB</output>
					</div>
				</div>
			</div>
		</div>
	</main>
	<footer class="container">
		<p>© Nick Thompson 2017</p>
	</footer>
	<script src="js/eq.js"></script>
</body>
</html>