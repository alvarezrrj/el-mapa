function populateCapital(country, $popUp) {
	let currency = country.info.currencyCode;
	$popUp.find('#country-name').html(country.info.countryName);
	$popUp.find('#population').html(`Population<br> ${country.info.population}`);
	$popUp.find('#area').html(`Area<br> ${country.info.areaInSqKm} Km<sup>2</sup>`);
	$popUp.find('#currency').html(`Currency<br> ${currency}`);
	exchangeR &&
	$popUp.find('#exchangeR').html(`Exchange rate<br> 1 USD = ${exchangeR[currency].toFixed(2)} ${currency}`);
	$popUp.find('#capital').html(`Capital: ${country.info.capital}<br>`);
	country.wiki && 
	$popUp.find('#wiki').html(country.wiki.summary + ` <a href=${country.wiki.wikipediaUrl}>wikipedia.org</a>`);
};

function displayCities(cities){
	let $popUp;
	let capital = countries[currentCountry[0]].info.capital;
	//Add cities to map and currentCountry array
	currentCountry[2] = L.layerGroup().addTo(map);
	cities.forEach((c, i, a) => {
		let icon;  
		let popupContent;
		let order;   
		switch (i) {
			case 0: order = ""; break;
			case 1: order = '2<sup>nd</sup>'; break;
			case 2: order = '3<sup>rd</sup>'; break;
			default: order = `${i}<sup>th</sup>`; break;
		};
		if (capital == c.city) {
			icon = pin;
			$popUp = $('#capital-popup').clone().removeClass('hidden').addClass(capital);
			popupContent = $popUp[0];
		} else {
			icon = new L.Icon.Default();
			popupContent = `${c.city}, the ${order} most populated city in ${countries[currentCountry[0]].GJ.properties.name}`;
		}
		currentCountry[2].addLayer(L.marker([c.latitude, c.longitude], {icon: icon})
		.bindPopup(popupContent, {
			maxWidth: popupWidth,
			className: 'text-centered',
		}))
	});
	return $popUp
};

function displayEarthq(eqs) {
	currentCountry[3] = L.layerGroup().addTo(map);
	eqs.forEach(e => {
		let popupContent = (`<p>An earthquake ocurred here on<br> ${e.datetime}.<br>
			Location (lat, lng): ${e.lat}, ${e.lng}.<br>
			Magnitude: ${e.magnitude}.</p>`);
		currentCountry[3].addLayer(
			L.marker([e.lat, e.lng], {icon: eqIcon})
			.bindPopup( popupContent, {
				maxWidth: popupWidth,
				className: 'text-centered',
			})
		)
	});
};

function displayUserLoc(userL) {
	currentCountry[4] = L.marker([userL.lat, userL.lng], {icon: dancer}).bindPopup(
		`<p>This is our best guess at your location:<br>
		Coordinates (lat, lng): ${userL.lat}, ${userL.lng}.
		${userL.alt ? "<br>Altitude: " + userL.alt + " masl." : ""}<br>
		${userL.town ? userL.town : userL.city}
		${userL.county ? "<br>" + userL.county : ""}
		${userL.postcode ? "<br>" + userL.postcode : ""}
		`,
		{maxWidth: popupWidth,
		className: 'text-left'}
	).addTo(map);
};

function displayWeather(weather) {
	let $w;
	if ($('#weather-content').length) {
		$w = $('#weather-content');
	} else {
		$w = $('.weather').clone().insertAfter($('#widget-icons')).attr('id', 'weather-content');
	}
	if (weather.error) {
		$('#weather-description').html('<p class="error">Something went wrong, tap to retry.</p>')
		.click(handleWeatherError);
	} else {
		let a; 
		let b;
		let d = new Date();
		if (weather.current) { 
			a = weather.current;
			b = weather.current;
		} else {
			a = weather;
			b = weather.main;
		}
		$w.find('#weather-img').attr('src', `https://openweathermap.org/img/wn/${a.weather[0].icon}@2x.png`);
		$w.find('#weather-description').html(a.weather[0].description);
		$w.find('#weather-feelsLike').html(`feels like ${Math.round(b.feels_like)}&#176;C`);
		$w.find('#weather-humidity').html(`humidity ${b.humidity}%`);
		$w.find('#weather-temp').html(`<p>${Math.round(b.temp)}&#176;C</p>`);
		weather.forecast &&
			weather.forecast.forEach((f, i, a) => {
				let $d = $w.find('.forecast.template').clone().appendTo($('#weather-bottom'))
					.removeClass('template');
				let day;
				switch((d.getUTCDay() + i) % 7) {
					case 0: day = 'Monday'; break;
					case 1: day = 'Tuesday'; break;
					case 2: day = 'Wednesday'; break;
					case 3: day = 'Thursday'; break;
					case 4: day = 'Friday'; break;
					case 5: day = 'Saturday'; break;
					case 6: day = 'Sunday'; break;
				}
				$d.find('img').attr('src', `https://openweathermap.org/img/wn/${f.weather[0].icon}@2x.png`);
				$d.find('#weather-pop').html(`${f.pop * 100}%`);
				$d.find('#weather-max').html(`${Math.round(f.temp.max)}`);
				$d.find('#weather-min').html(`${Math.round(f.temp.min)}&#176;C`);
				$d.find('#weather-day').html(day);
				//On last iteration, remove forecast template.
				i == (a.length - 1) && $w.find('.forecast').filter('.template').remove();
			});
	}
};

function displayNews(news) {
	let $nc = $('#news-content');
	let $c;
	if ($nc.length) {
		$c = $nc;
	} else {
		$c = $('.news').clone().insertAfter($('#widget-icons')).attr('id', 'news-content');
	}
	if (news.error) {
		$c.html('<p class="error">Something went wrong, tap to retry.</p>')
		.click(handleNewsError);
	} else {
		$c.find('p.error').remove(); //Remove error message
		let $t = $('.news-article.template').first(); //Template
		news.forEach((a, i, arr) => {
			let $na = $t.clone().appendTo($c).removeClass('template');
						     //Remove author from title
			$na.find('#news-title').html(a.title.split("-")[0]);
			$na.find('#news-description').html(a.description);
			$na.find('#news-link').html(`<a target="_blank" href="${a.url}">Read more...</a>`);
			$na.find('#news-source').html(a.source.name);
			//Remove template when finished.
			i == (arr.length - 1) && $c.find('.template').remove();
		});
	}
};

function displayRest(rests) {
	let $pt = $('.restaurant')	//Template
	currentCountry[5] = L.layerGroup().addTo(map);
	rests.forEach(r => {
		let $pc = $pt.clone().removeClass('hidden'); 	//popup content jq element
		$pc.css('background-image', `url(${r.image_url})`); 
		$pc.find('.rest-name').html(r.name);
		$pc.find('.rest-cat').html(r.categories[0].title);
		$pc.find('address').append(`
			${r.location.display_address[0]}<br>
			${r.location.display_address[1]}<br>`);
		$pc.find('.rest-tel').attr('href', `tel:${r.phone}`).html(r.display_phone);
		$pc.find('.rest-rating').html(r.rating);
		let popupContent = $pc[0];
		currentCountry[5].addLayer(L.marker(
			[r.coordinates.latitude, r.coordinates.longitude],
			{icon: cutlery})
			.bindPopup(popupContent, {maxWidth: popupWidth})
		)
	});
};

function clearData() {
	currentCountry[1].remove();				//Remove borders
	currentCountry[2].clearLayers(); 			//Remove cities
	currentCountry[3] && currentCountry[3].clearLayers();	//Remove earthquakes
	currentCountry[4] && currentCountry[4].remove();	//Remove user loc data
	currentCountry[5] && currentCountry[5].clearLayers();	//Remove restaurants
	$('#widget-bar').find('.widget-content').remove();	//Remove widget data
	layersControl.remove();					//Remove layers control
	
};

function clearPromises() {
	//exchangeP does not need to be cleared 
	infoP = $.Deferred();
	weatherP = $.Deferred();
	newsP = $.Deferred();
	wikiP = $.Deferred();
	earthquakesP = $.Deferred();
	bordersP = $.Deferred();
	restP = $.Deferred();
};

function layerControlGen(cc) {
	let layers = {};
	cc[1] ? layers['Borders'] = cc[1] : "";
	cc[2] ? layers['Cities'] = cc[2] : "";
	cc[3] ? layers['Earthquakes'] = cc[3] : "";
	cc[5] ? layers['Restaurants'] = cc[5] : "";
	cc[4] ? layers['Yourserlf'] = cc[4] : "";
	return layers;
};

function displayData(country, userLoc, exchangeR) {
	clearPromises();
	map.flyToBounds(
		bBoxRect(
			country.info.north,
			country.info.east,
			country.info.south,
			country.info.west,
		)
	);
	//Add borders and store layer in currentCountry
	currentCountry[1] = L.geoJSON(country.GJ, {
		style: {
			fillOpacity: 0.1,
			color: '#00B300',
		}
	}).addTo(map);
	let $capitalPopup = displayCities(country.cities);
	populateCapital(country, $capitalPopup);
	country.earthQ && displayEarthq(country.earthQ);
	userLoc.lat && displayUserLoc(userLoc);
	country.restaurants.length && displayRest(country.restaurants);
	displayWeather(country.weather);
	displayNews(country.news);
	//Add layer control
	layersControl = L.control.layers({
		'Map': waterColorTiles			//Base layers			
	}, 
		layerControlGen(currentCountry),	//Overlays
	{
		hideSingleBase: true,			//Options
		position: 'bottomleft',
	}).addTo(map);
};
