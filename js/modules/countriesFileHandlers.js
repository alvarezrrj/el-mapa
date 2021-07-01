function getBorders(countryIso2) {
	return $.ajax('/el-mapa/php/getBorders.php', {
		dataType: 'json',
		data: {country: countryIso2},
		success: (response, stat, req) => {
			//Store response in countries object
			countries[countryIso2].GJ = response;
		},
		error: function(req, message, error) {
			alert(`We are having technical difficulties on our servers. Try again later. Error: ${error}`);
		},
	});
};
