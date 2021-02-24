<?php 

$url = 'http://api.geonames.org/countryCode?username=alvarezrrj' . '&lat=' . $_GET['lat'] . '&lng=' . $_GET['lng'];

$ch = curl_init();

curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$data = trim($result);

$status = strlen($data) < 3 ? '200' : '400';

header('Content-Type: text/html; charset=UTF-8', true, $status);

echo $data; 

?>
