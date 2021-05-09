//takes a {lat: , lng: } object
function getCountryCode(coords){
	//returns iso2
	return $.ajax('/el-mapa/php/getCountryCode.php', {
		data: coords,
		success: (response, stat, req) => {
			currentCountry[0] = response;
			//initialize countries object
			countries[response] = {};
		},
	});
};

function getWikiArt(capital) {
	if (! countries[currentCountry[0]].cities.some(c => c.name == capital)) {
		return $.Deferred().resolve(); //If getCities doesn't return the capital, abort.
	}
	let lat = countries[currentCountry[0]].cities.find(c => c.name == capital).latitude;
	let lng = countries[currentCountry[0]].cities.find(c => c.name == capital).longitude;
	return $.ajax('/el-mapa/php/getWikiArt.php', {
		dataType: 'json',
		data: {
			q: capital,
			lat: lat,
			lng: lng,
		},
		success: (res, stat, req) => {
			countries[currentCountry[0]].wiki = res
		},
		error: (req, message, error) => {
			countries[currentCountry[0]].wiki = {error: 'Something went wrong'}
		},
	});
};

function getEarthquakes(n, s, e, w) {
	return $.ajax('/el-mapa/php/getEarthquakes.php', {
		dataType: 'json',
		data: {
			north: n,
			south: s,
			east: e,
			west: w,
		},
		success: (res, stat, req) => {
			countries[currentCountry[0]].earthQ = res.earthquakes;
		},
	})
};

function getAltitude(coords) {
	return $.ajax('/el-mapa/php/getAltitude.php', {
		dataType: 'text',
		data: coords,
		success: (res, stat, req) => {
			userLocation['alt'] = res;
		},
	});
};

function getExchange() {
	return $.ajax('/el-mapa/php/getExchange.php', {
		dataType: 'json',
		success: (res, stat, req) => {
			exchangeR = res;	
		},
	});
};

//Takes a {city: } or {lat: , lng: } object as an argument
function getWeather(loc) {
	return $.ajax('/el-mapa/php/getWeather.php', {
		dataType: 'json',
		data: loc,
		success: (res, stat, req) => {
			countries[currentCountry[0]].weather = res;	
		},
		error: () => {
			countries[currentCountry[0]].weather = {error: 'Something went wrong'};
		},
	});
};

function getNews(iso2) {
	return $.ajax('/el-mapa/php/getNews.php', {
		dataType: 'json',
		data: {iso2: iso2},
		success: (res, stat, req) => {
			countries[iso2].news = res.articles;
		},
		error: () => {
			countries[iso2].news = {error: 'Something went wrong'};
		},
	});
};

//Takes a {city: } or {lat: , lng: } object as an argument
function getRestaurants(loc) {
	return $.ajax('/el-mapa/php/getRestaurants.php', {
		dataType: 'json',
		data: loc,
		success: (res, stat, req) => {
			countries[currentCountry[0]].restaurants = res.businesses;
		},
		error: () => {
			countries[currentCountry[0]].restaurants = [];
		},
	});
};

function reverseUserLoc(coords) {
	return $.ajax('/el-mapa/php/reverseUserLoc.php', {
		dataType: 'json',
		data: coords,
		success: (res, stat, req) => {
			Object.assign(userLocation, res);
		},
	});
};

function geonamesInfo(countryIso2) {
	return $.ajax('/el-mapa/php/geonamesInfo.php', {
		dataType: 'json',
		data: {country: countryIso2},
		success: (response, stat, req) => {
			//Store result in 'properties' element of geoJson country object
			countries[countryIso2].info = response;
		},
	});
};

function getCities(countryIso2) {
	return $.ajax('/el-mapa/php/getCities.php', {
		dataType: 'json',
		data: {country: countryIso2},
		success: (response, stat, req) => {
			//Store cities in countries object
			countries[countryIso2].cities = response.data;
		},
	});
};
