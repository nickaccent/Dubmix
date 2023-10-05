<?php
$file = dirname(__FILE__)."/device_maps/".$_POST['file'].".json";
$myfile = fopen($file, "r") or die("Unable to open file!");
echo fread($myfile,filesize($file));
fclose($myfile);
die;