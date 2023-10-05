<?php
$file = dirname(__FILE__)."/device_maps/".strtolower(str_replace(" ", "", $_POST['file'])).".json";
$myfile = fopen($file, "w") or die("Unable to open file!");
fwrite($myfile, $_POST['midiMap']);
fclose($myfile);
echo 1;
?>
