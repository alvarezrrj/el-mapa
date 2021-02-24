<?php

$apiKey = 'd65c427c12e5456ba6d08f226c164d95';

$url = 'https://api.opencagedata.com/geocode/v1/json?limit=1&q=' . $_GET['lat'] . '+' . $_GET['lng'] . '&key=' . $apiKey;

$ch = curl_init();

curl_setopt_array($ch, [
	CURLOPT_SSL_VERIFYPEER => false,
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_URL => $url,
]);

$result = json_decode(curl_exec($ch), true);

$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);

$data = $result['results'][0]['components'];

$filtered = [
	'city' => $data['city'],
	'town' => $data['town'],
	'county' => $data['county'],
	'postode' => $data['postcode'],
];

header('Content-Type: text/html; charset=UTF-8', true,  $status);

echo json_encode($filtered);

?>
