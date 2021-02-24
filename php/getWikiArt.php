<?php

$url = 'http://api.geonames.org/wikipediaSearchJSON?username=alvarezrrj&q=' . urlencode($_GET['q']);

$ch = curl_init();

curl_setopt_array($ch, [
	CURLOPT_SSL_VERIFYPEER => false,
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_URL => $url,
]);

$result = json_decode(curl_exec($ch), true);

curl_close($ch);

$status = count($result['geonames']) == 0 ? 400 : 200;

header('Content-Type: application/json; charset=UTF-8', true,  $status);

$filtered = array_filter($result['geonames'], function($a) {
	return round($a['lat'], 1) == round($_GET['lat'], 1) && round($a['lng'], 1) == round($_GET['lng'], 1);
});

$data = count($filtered) == 0 ? $result['geonames'][0] : array_values($filtered)[0];

echo json_encode($data);

?>
