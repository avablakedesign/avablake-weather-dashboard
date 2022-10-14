//This is the key used with the api.
const key = '0f9ca65301e786e31087ed440e5d77bc';

let todaysData = null;
var forecastContainer = document.getElementById("five-day-container");
var weatherBox = document.getElementById("weather-box");
var city = "";
var searchHistory = {history:[]};

var newList = document.createElement("ul");
    document.getElementById("search-history").appendChild(newList);

//This creates the search button and adds an event listener on the button. 
function createSearchButton (name) {
    let newButtonItem = document.createElement('button');
        newButtonItem.classList.add('historyButton')
        newButtonItem.innerHTML = name;
        newList.appendChild(newButtonItem);

        if(newList.children.length > 0) {
            Array.from(newList.children).forEach(function (button, i) {
                button.addEventListener("click", function () {
                    //console.log("button city", button.textContent)
                    city = button.textContent
                    cityGeocoding(city)
                })
            })
        }
} 
//This creates the search history and gets it from local storage.
(function renderSearchHistory() {
    if(localStorage.getItem("searchHistory")) {
        let storage = localStorage.getItem("searchHistory");
        searchHistory = JSON.parse(storage);
    }
    //console.log(searchHistory);
    for( var i=0; i < searchHistory.history.length; i++) {
        createSearchButton(searchHistory.history[i])
    }
})()
//This sets variables for the data which is then displayed on the page as html, it also formats the time.
function handleWeatherData(data) {
    data.list.forEach(function (weatherObj, i){
        let dateTime = weatherObj.dt_txt
        let wind = weatherObj.wind.speed 
        let temp = weatherObj.main.temp
        let humidity = weatherObj.main.humidity
        let clouds = weatherObj.clouds.all
        let formatTime = (dateTime) => {
            let formatedTime = new Date(dateTime)
            return `${formatedTime.getMonth()+1}/${formatedTime.getDate()}/${formatedTime.getFullYear()}`
              
        }
        let formatTemp = (temp) => {
            return `${Math.round(parseFloat(((temp - 273.15) * 1.8) + 32))}`
        }
        if (i === 0) {
            todaysData = weatherObj;
            let innerContent = `
                <h4><br />&nbsp;&nbsp;${city}</h4>
                <p>&nbsp;&nbsp;${clouds > 20 ? "😶‍🌫️" : "🌞"}</p>
                <p>&nbsp;&nbsp;${formatTime(dateTime)}</p>
                <p>&nbsp;&nbsp;wind:${wind} MPH</p>
                <p>&nbsp;&nbsp;temp:${formatTemp(temp)} °F</p>
                <p>&nbsp;&nbsp;humidity:${humidity} %<br />&nbsp;</p>
                `
            
            weatherBox.innerHTML = innerContent;
            //console.log(weatherBox);
        }
        if (i % 8 === 0) {
            //console.log(weatherObj);    
            let forecastDiv = forecastContainer.children[i/8]
            let innerContent = `
                <p>&nbsp;&nbsp;${clouds > 20 ? "😶‍🌫️" : "🌞"}</p>
                <p>${formatTime(dateTime)}</p>
                <p>&nbsp;&nbsp;wind:${wind} MPH</p>
                <p>&nbsp;&nbsp;temp:${formatTemp(temp)} °F</p>
                <p>&nbsp;&nbsp;humidity:${humidity} %</p>
            `
            forecastDiv.innerHTML = innerContent;
            //console.log(forecastDiv)
        }    
    });
} 
//This fetches the data for the coordinates using geocoding.
function cityGeocoding(city) {
    fetch ('https://api.openweathermap.org/geo/1.0/direct?q=' + city + "&appid=" + key)
    .then (function(response) {
        return response.json()
    })
    .then(function(data) {
        let parsedGeoJson = data;
        //console.log(parsedGeoJson);
        weatherForecast(city, data[0].lat, data[0].lon);
    })
//This catches any errors and shows it on the console log.     
    .catch(error => {
        console.log(error);
    });
}
//This fetches the 5 day forecast data of a city when passed it's latitude and longitude and it's key. 
function weatherForecast(city, lat, lon){
    console.log("calledWeatherForecast")
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}`)
    .then(function(response) {
        return response.json()
    })
   .then(function(data) {
        let parsedJson = data;
        //console.log(parsedJson);
        handleWeatherData(data);
    })
//This catches any errors and shows it on the console log.
    .catch(error => {
        console.log(error);
    });
}
//This adds an event listener to the search button and also saves the search history to local storage.
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".button-search").addEventListener("click", () => {
        const cityTextSearched = document.querySelector('.text-search');
        //console.log(cityTextSearched.value);
        city = cityTextSearched.value;

        searchHistory.history.push(cityTextSearched.value);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        
        createSearchButton(cityTextSearched.value)

        if (cityTextSearched.value) {
            cityGeocoding(cityTextSearched.value)
        }
    })
});


