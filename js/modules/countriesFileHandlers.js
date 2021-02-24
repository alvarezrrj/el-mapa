function getBorders(countryIso2) {
	return $.ajax('/el-mapa/php/getBorders.php', {
		dataType: 'json',
		data: {country: countryIso2},
		success: (response, stat, req) => {
			let bordersLayer = L.geoJSON(response, {style: {fillOpacity: 0.1}});
			//Store GJ response in countries object
			countries[countryIso2].GJ = response;
		},
	});
};
