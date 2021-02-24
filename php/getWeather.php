<?php

$appId = '697821243c447aa1d7c000ba39df12fa';

if (count($_GET) == 1) {
	$url = 'api.openweathermap.org/data/2.5/weather?units=metric&q=' . $_GET['city'] . '&appid=' . $appId;
	$city = true;
} else {
	$url = 'api.openweathermap.org/data/2.5/onecall?units=metric&exclude=minutely,hourly,alerts&lat=' . $_GET['lat'] . '&lon=' . $_GET['lng'] . '&appid=' . $appId;
};

$ch = curl_init();

curl_setopt_array($ch, [
	CURLOPT_SSL_VERIFYPEER => false,
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_URL => $url,
]);

$result = json_decode(curl_exec($ch), true);

$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);

header('Content-Type: text/html; charset=UTF-8', true,  $status);

if ($city) {
	echo json_encode($result);
} else {
	echo json_encode(['current' => $result['current'], 'forecast' => $result['daily']]);
}

?>
