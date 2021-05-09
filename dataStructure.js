exchangeR = { 			//getExchange()
	AAA: int,
	AAB: int,
	 .
	 .
	 .
}


userLocation = {
	lat: int,		//getCurrentPosition()
	lng: int,		// 	"
	alt: int,		//getAltitude(lat,lng) deps: getCurrentPosition()
	town: string,		//reverseUserLoc(lat, lng)
	city: string,		// 	"
	county: string,		// 	"
	postcode: string,	// 	"
}

isoCodes = {
	countryName: {
		iso2: ab,
		iso3: xyz,
	},
	 .
	 .
	 .
}

countries = {
	ISO2: {			//getCountryCode(lat, lon)
		GJ: {},		//getBorders(iso2) deps: getCountryCode()
		info: {},	//geonamesInfo(iso2) deps: getCountryCode()
		cities: [],	//getCities(iso2) deps: getBorders()
		earthQ: {},	//getEarthquakes(bBox) deps: geonamesInfo(), getBorders()
		wiki: {},	//getWiki(capital) deps: getCities()
		news: [],	//getNews(iso2)  deps: getCountryCode()
		weather: {},	//getWeather(lat, lng) 
		restaurants: [],//getRestaurants(loc)
	},
	 .
	 .
	 .
}

currentCountry = [		//Defined by getCountryCode and handleSelect
	ISO2, 
	bordersLayer, 
	citiesGroup,
	earthquakesGroup,
	userLocLayer,
	restsGroup,
]


