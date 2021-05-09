<?php

$appId = 'a3367b5f75754e7cb8fbf696db9308f8';

$url = 'https://openexchangerates.org/api/latest.json?prettyprint=false&app_id=' . $appId;

$ch = curl_init();

curl_setopt_array($ch, [
	CURLOPT_SSL_VERIFYPEER => false,
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_URL => $url,
]);

$result = json_decode(curl_exec($ch), true);

$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);


header('Content-Type: application/json; charset=UTF-8', true,  $status);

echo json_encode($result['rates']);

?>
