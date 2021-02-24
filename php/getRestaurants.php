<?php

$apiKey = 'jR2jE5amZp_fh1mle8jjTV0cRX21KfcUtDNpjjLT9CBZ-W8qk-VkKVHOgx9BwuwJzN0i6FS6UF8b-IwDJS8B5yY0juLN5sC3bYmuicE9oe3omZALPaVAD5crCCQ2YHYx';

if (count($_GET) == 1) {
	$url = 'https://api.yelp.com/v3/businesses/search?limit=10&radius=40000&term=restaurants&location=' . $_GET['city'];
}
else {
	$url = 'https://api.yelp.com/v3/businesses/search?limit=10&radius=40000&term=restaurants&latitude=' . $_GET['lat'] . '&longitude=' . $_GET['lng'];
}

$ch = curl_init();

curl_setopt_array($ch, [
	CURLOPT_SSL_VERIFYPEER => false,
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_URL => $url,
	CURLOPT_HTTPHEADER => [
		'Authorization: Bearer ' . $apiKey,
	]
]);

$result = curl_exec($ch);

$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);

header('Content-Type: application/json; charset=UTF-8', true,  $status);

echo $result;

?>
