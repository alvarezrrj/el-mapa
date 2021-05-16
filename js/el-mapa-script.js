//TO DO

//Sort out widget bar getting onthewayof layers control (Desktop)
//Find out why message won't appear when unkown country is input.
//Delete all console.logs before deployment!
//Replace jQuery for the minified version
//Replace leaflet.markerCluster-src.js for leaflet.markerCluster.js
//Minify all files.

//Preloader remove
$(window).on("load", function() {
	//The first two lines allow me to use $.slideUp/Down afterwards.
	$('.widget-content').hide().removeClass('hidden');
	$('#widget-fog').hide().removeClass('hidden');
	$("#loader-container").delay(100).fadeOut('slow').removeClass('opaque');
});

//Variables declaration
var layersControl;
var weather;
var exchangeR;
var isoCodes = {};
var userLocation = {};
var countries = {};
var currentCountry = new Array(5);		
var $fullScreenFog = $('#full-screen-fog');
var $instructions = $('#search-bar-instructions');
var $pointyFinger = $('#pointy-finger');
var $noMatch = $('#no-match').hide();
var $loader = $('#loader-container');
var popupWidth = $(window).width() * ($(window).width() > 750 ? 0.4 : 0.80);

//Promises
var exchangeP = $.Deferred();
var infoP = $.Deferred();
var reverseP = $.Deferred();
var weatherP = $.Deferred();
var altitudeP = $.Deferred();
var newsP = $.Deferred();
var wikiP = $.Deferred();
var earthquakesP = $.Deferred();
var bordersP = $.Deferred();
var restP = $.Deferred();


//Marker Icons
const pin = L.icon({
	iconUrl: 'images/pin.png',
	iconAnchor: [19,53],
	iconSize: [34, 54],
	shadowUrl: 'images/pin-shadow.png',
	shadowSize: [40, 41],
	shadowAnchor: [6, 40],
	popupAnchor: [0, -45]
});
const eqIcon = L.icon({
	iconUrl: 'images/earthquake.png',
	iconSize: [55, 49],
});
const dancer = L.icon({
	iconUrl: 'images/dancer.png',
	iconSize: [54, 54],
	iconAnchor: [29, 50],
	shadowUrl: 'images/dancer-shadow1.png',
	shadowSize: [34, 40],
	shadowAnchor: [8, 39],
	popupAnchor: [-2, -50],
});
const cutlery = L.icon({
	iconUrl: 'images/cutlery.png',
	iconSize: [22, 47],
	iconAnchor: [17, 46],
	shadowUrl: 'images/cutlery-shadow.png',
	shadowSize: [46, 46],
	shadowAnchor: [19, 43],
	popupAnchor: [-7, -40],
});

//Instantiate map
var map = L.map('map', {
	zoomControl: false,				      //remove zoom buttons on top left corner
	attributionControl: false, 			      //remove attributions element.
	worldCopyJump: true,				      //jumps back to main world when you pan away.
}).fitWorld();

//Initialize attributions element.
var attribution = L.control.attribution();
attribution.addAttribution('Emojis by <a href="https://openmoji.org/">OpenMoji</a> - License <a href="https://creativecommons.org/licenses/by-sa/4.0/#">CC BY-SA 4.0</a> |');
attribution.addAttribution('Fonts by The Raleway Project - impallari@gmail.com - <a href="http://scripts.sil.org/OFL">SIL Open Font License</a> |');

//Add tiles onto the map.
const waterColorTiles = L.tileLayer.provider('Stamen.Watercolor').addTo(map);

//Function definitions
//Reactify bonding Box for countries that cross the antimeridian
function bBoxRect(n, e, s, w) {
	if (e - w < 0) {
		e = 360 - Math.abs(e);
	} return [[n, e], [s, w]];
};

function handleWeatherError(e) {
	$loader.removeClass().addClass('preloader-responsive').insertAfter($('#weather-top')).show();
	let loc = userLocation.lat ?
		{lat: userLocation.lat, lng: userLocation.lng} :
		{city: countries[currentCountry[0]].info.capital};
	getWeather(loc)
	.then((res, stat, req) => {
		$loader.hide();
		displayWeather(res);
	})
	.catch(() => $loader.hide());
};

function handleNewsError(e) {
	$loader.removeClass().addClass('preloader-responsive').appendTo($('#news-content')).show();
	getNews(currentCountry[0])
	.then((res, stat, req) => {
		$loader.hide();
		displayNews(res.articles);
	})
	.catch(() => $loader.hide());
};

function handleSelect(country) {
	//Check if selection matches isoCodes
	if (Object.keys(isoCodes).some(k => k == country)) {
		$noMatch.addClass('hidden');
		//Remove current country data
		currentCountry[1] && clearData();
		let iso2 = isoCodes[country].iso_a2
		currentCountry[0] = iso2;
		//If selection not in countries, call api stack
		if (!Object.keys(countries).some(c => c == iso2)) {
			$loader.removeClass().addClass('preloader-full-screen').show();
			countries[iso2] = {};
			getBorders(iso2).always(() => bordersP.resolve());
			geonamesInfo(iso2)
			.then(res => {
				infoP.resolve();
				getEarthquakes(res.north, res.south, res.east, res.west)
				.always(() => earthquakesP.resolve());
				//Get weather for capital instead of user loc
				getWeather({city: res.capital})
				.always(() => weatherP.resolve());
				getRestaurants({city: res.capital})
				.always(() => restP.resolve());
			})
			.catch(() => {
				handleLocError()
			});
			getCities(iso2)
			.then(() => {
				//Run getWiki only after both cities and info are completed
				$.when(infoP).then(() => {
					getWikiArt(countries[iso2].info.capital)
					.always(() => wikiP.resolve());
				})
			});
			getNews(iso2).always(() => newsP.resolve());
			//Call displayData after all api calls are fulfilled
			$.when(bordersP, earthquakesP, wikiP, newsP, weatherP, exchangeP, restP)
			.done(() => {
				displayData(countries[currentCountry[0]], userLocation, exchangeR);
				$loader.fadeOut();
			});
		} else {
			displayData(countries[iso2], userLocation, exchangeR);
		}
		//Remove fog and instructions
		$fullScreenFog.addClass('hidden');
		$instructions.addClass('hidden');
		$pointyFinger.addClass('hidden');
	} else {
		$noMatch.removeClass('hidden');
	}
}

//=====Asynhcronous tasks ================================================
//Fetch iso codes and populate <datalist>
$.ajax('/el-mapa/php/getIsoCountries.php' , {
	dataType: 'json',
	success: function(response, stat, req) {
		response.forEach(c => {
			isoCodes[c.name] = {
				iso_a2: c['iso_a2'],
				iso_a3: c['iso_a3'],
				iso_n3: c['iso_n3'],
			};
			//Append option to datalist.
			$(`<option>${c.name}</option>`, {value: c.name})
			.appendTo($('#countries-list'));
		});
	},
	error: function(req, message, error) {
		console.error(message);
		console.error(error);
	}
});

//fetch exchange rates
getExchange().then(() => exchangeP.resolve());

//Retrieve user's location
window.navigator.geolocation.getCurrentPosition(
	//Success callback
	function(geoLocPos)  {
		$loader.removeClass().addClass('preloader-full-screen').show();
		userLocation = {
			lat: geoLocPos.coords.latitude,
			lng: geoLocPos.coords.longitude
		};
		getCountryCode(userLocation)
		.then(iso2 => {
			getWeather(userLocation).always(() => weatherP.resolve());
			getBorders(iso2).always(() => bordersP.resolve());
			getRestaurants(userLocation).always(() => restP.resolve());
			geonamesInfo(iso2)
			.then(res => {
				getEarthquakes(res.north, res.south, res.east, res.west)
				.always(() => earthquakesP.resolve());
				infoP.resolve();
			})
			.catch(() => {
				handleLocError()
			});
			getCities(iso2)
			.then(() => {
				//Run getWiki only after both cities and info are completed
				$.when(infoP).then(() => {
					getWikiArt(countries[iso2].info.capital)
					.always(() => wikiP.resolve());
				})
			});
			getNews(iso2)
			.always(() => newsP.resolve());
		})
		.catch(() => {
			handleLocError();
		});
		getAltitude(userLocation).always(() => altitudeP.resolve());
		reverseUserLoc(userLocation).always(() => reverseP.resolve());
		//Call displayData after all api calls are fulfilled
		$.when(bordersP, earthquakesP, wikiP, newsP, altitudeP, weatherP, reverseP, exchangeP, restP)
		.done(() => {
			$loader.fadeOut();
			displayData(countries[currentCountry[0]], userLocation, exchangeR)
		});
	},
	//Error callback
	error => {
		handleLocError();
	}
);

//==== Map behaviour ===============================================
//Show attributions on click
$('#attributions-button').click(function() {
	attribution.addTo(map);
	$(this).hide();
});

//Hide attributions and widget content on map click
$('#map').click(() => {
	attribution.remove();
	$('#attributions-button').show();
	$('.widget-content').slideUp();
});

//Attach handleSelect to 'go' button click or select element change event.
if ($('#go').is(':visible')) {
	$('#go').click(() => handleSelect($('#countries-input').val()));
	L.control.zoom().addTo(map);
} else {
	$('#countries-input').change((e) => handleSelect(e.target.value));
}

$('form').submit(function(e) {
	e.preventDefault();
	handleSelect($('#countries-input').val());
});

//On search bar click, clear input and hide widget content.
$('#countries-input').click((e) => {
	e.target.value = "";
	$('.widget-content').slideUp();
});

//Toggle widget data on click
$('.widget').click(function() {
	if (this.id == "weather-icon" && $('#weather-content').is(':hidden')){
		$('#weather-content').slideDown();
		$('#news-content').hide();
	}
	else if (this.id == 'news-icon' && $('#news-content').is(':hidden')) {
		$('#news-content').slideDown();
		$('#weather-content').hide();
	}
	else {
		$('.widget-content').slideUp();
	}
});

$('#widget-fog').click(function() {
	$(this).hide();
});

