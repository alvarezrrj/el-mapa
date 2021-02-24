<?php 

$country = $_GET['country'];

$bordersJson = file('../docs/countryBorders.geo.json')[0];
$bordersArray = json_decode($bordersJson, true);

foreach ($bordersArray['features'] as $elem) {
	if (
		$elem['properties']['iso_a2'] == $country ||
		$elem['properties']['iso_a3'] == $country ||
		$elem['properties']['iso_n3'] == $country ||
		$elem['properties']['name'] == $country 
	) {
		$bordersFiltered = $elem;
		break;
	}
}

echo json_encode($bordersFiltered);
