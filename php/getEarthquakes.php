<?php

$url = 'http://api.geonames.org/earthquakesJSON?username=alvarezrrj&north=' . $_GET['north'] . '&east=' . $_GET['east'] . '&south=' . $_GET['south'] . '&west=' . $_GET['west'];

$ch = curl_init();

curl_setopt_array($ch, [
	CURLOPT_SSL_VERIFYPEER => false,
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_URL => $url,
]);

$result = json_decode(curl_exec($ch), true);

curl_close($ch);

$status = count($result['earthquakes']) == 0 ? 400 : 200;

header('Content-Type: application/json; charset=UTF-8', true,  $status);

echo json_encode($result);

?>
