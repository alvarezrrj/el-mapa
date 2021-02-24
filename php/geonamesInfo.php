<?php 

$url = 'http://api.geonames.org/countryInfo?username=alvarezrrj&country=' . $_GET['country'];

$ch = curl_init();

curl_setopt_array($ch, [
	CURLOPT_SSL_VERIFYPEER => false,
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_URL => $url
]);

$result = curl_exec($ch);

curl_close($ch);

$data = array();
$dom = new DOMDocument();
$dom->loadXML($result);
$countryElem = $dom->getElementsByTagName('country')->item(0);
$fields = $countryElem->childNodes;

for ($i = 0; $i < $fields->length; $i++) {
	$data[$fields->item($i)->nodeName] = $fields->item($i)->nodeValue;
}

$status = count($data) == 0 ? '400' : '200';

header('Content-Type: application/json; charset=UTF-8', true, $status);

echo json_encode($data);

?>
