function handleLocError() {
	if ($('#preloader-container').is(':visible')) {
		$('#preloader-container').fadeOut();
	}
	alert('Oops! our minions weren\'t able to work out where you are. Please enter your location manually.');
	$fullScreenFog.removeClass('hidden');
	$instructions.removeClass('hidden');
	$pointyFinger.removeClass('hidden');
	$loader.hide();

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
