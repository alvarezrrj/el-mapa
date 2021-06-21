<?php

function filterIso($element){
	return $element['properties'];
}

$bordersJson= file('../docs/countryBorders.geo.json')[0];

$bordersJson ?  $borders = json_decode($bordersJson, true) : $borders = false;

$borders ? $status = '200' : $status = '500';

$isoCodes = array_map('filterIso', $borders['features']);

usort($isoCodes,function($a, $b) {
	return strnatcmp($a['name'], $b['name']);
});

header('Content-Type: application/json; charset=UTF-8', true,  $status);

echo json_encode($isoCodes); 

?>
