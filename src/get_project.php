<?php
$file = dirname(__FILE__)."/projects/".$_POST['file'].".json";
$myfile = fopen($file, "r") or die("Unable to open file!");
echo fread($myfile,filesize($file));
fclose($myfile);
die;