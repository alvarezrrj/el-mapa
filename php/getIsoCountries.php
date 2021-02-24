<?php

function filterIso($element){
	return $element['properties'];
}

$bordersJson= file('../docs/countryBorders.geo.json')[0];
$borders = json_decode($bordersJson, true);

$isoCodes = array_map('filterIso', $borders['features']);

usort($isoCodes,function($a, $b) {
	return strnatcmp($a['name'], $b['name']);
});

echo json_encode($isoCodes); 

?>
