<?php

$apiKey = 'be291ccc95a046f684c92710b74b3c77';

$url = 'http://newsapi.org/v2/top-headlines?pageSize=10&apiKey=' . $apiKey . '&country=' . $_GET['iso2'];

$ch = curl_init();

curl_setopt_array($ch, [
	CURLOPT_SSL_VERIFYPEER => false,
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_URL => $url,
]);

$result = curl_exec($ch);

curl_close($ch);

$status = json_decode($result, true)['totalResults'] == 0 ? '400' : '200';

header('Content-Type: text/html; charset=UTF-8', true,  $status);

echo $result;

?>
