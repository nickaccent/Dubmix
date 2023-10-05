<?php
$dir = dirname(__FILE__)."/device_maps/";
$files1 = scandir($dir);
array_splice($files1, 0, 1);
array_splice($files1, 0, 1);
$files1 = array_values($files1);
echo json_encode($files1);
?>