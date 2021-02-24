<?php

$rapidAPIk = '76c2f2e10cmshb59e81549e1c0bfp1744efjsn96a91560b55e';
$rapidAPIh = 'wft-geo-db.p.rapidapi.com';
$rapidAPIurl = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities?minPopulation=10000&sort=-population&types=CITY&limit=10&countryIds=' . $_GET['country'];

$ch = curl_init();

curl_setopt_array($ch, [
	CURLOPT_SSL_VERIFYPEER => false,
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_URL => $rapidAPIurl,
	CURLOPT_HTTPHEADER => [
		'x-rapidapi-key: ' . $rapidAPIk,
		'x-rapidapi-host: ' . $rapidAPIh,
		'useQueryString: true',
	],
]);

$result = curl_exec($ch);

$responseCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);

header('Content-Type: application/json; charset=UTF-8', true,  $responseCode);

echo $result;

?>
