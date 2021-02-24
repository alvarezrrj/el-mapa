<?php

$url = 'http://api.geonames.org/gtopo30JSON?username=alvarezrrj&lat=' . $_GET['lat'] . '&lng=' . $_GET['lng'];

$ch = curl_init();

curl_setopt_array($ch, [
	CURLOPT_SSL_VERIFYPEER => false,
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_URL => $url,
]);

$result = json_decode(curl_exec($ch), true);

curl_close($ch);

$status = $result['gtopo30'] < 0 ? 400 : 200;

header('Content-Type: text/html; charset=UTF-8', true,  $status);

echo $result['gtopo30'];

?>
