var searchBtn = $("#search-button");
//var history = JSON.parse(localStorage.getItem("search")) ;
var citiesList = $(".list-group");
var cities = [];
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var currentHumidty = $("#humidity");
var currentWSpeed = $("#wind-speed");
var currentUvindex = $("#uvIndex");
var clearHistory = $("#clear-history");

$(document).ready(function() {
    // get the search list from the local storage
     var citySearchList = JSON.parse(localStorage.getItem("citySearchList"));
     if (citySearchList == null) {
     citiesList = {};
    }

//search button
searchBtn.on("click",function(event){
    event.preventDefault();
    var enteredCity = $('input[name="input-city"]').val().trim().toUpperCase();
    if (!enteredCity){
        console.log("You didn't enter a city");
        return;
    }
    citiesList.append('<li>' + enteredCity + '</li>');
    $('input[name="input-city"]').val('');
    if (enteredCity != "") {
        //Check to see if there is any text entered
        citySearchList[enteredCity] = true;
        localStorage.setItem("citySearchList", JSON.stringify(citySearchList));   
    }   
    getCurrentWeather(enteredCity);
    forecast(enteredCity);

   citiesList.on("click", function(){
        getCurrentWeather(enteredCity);
        forecast(enteredCity);
    });
});
});

//clear button
clearHistory.on("click", function(){
    citiesList.empty();
});


//set the APIKEY
const apiKey ="398a5ac241a4f7ec9425839acac6ae15";
//this function bring the current weather condition
function getCurrentWeather(cityName) {
    console.log(cityName);
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q="+ cityName + "&appid=" + apiKey;
    $.ajax({ 
        url: queryURL, 
        method: "GET"
})
.then(function(response){
        console.log(queryURL);
        console.log(response);
        var weathericon= response.weather[0].icon;
        var iconurl="https://openweathermap.org/img/wn/"+ weathericon +"@2x.png";
        var date=new Date(response.dt*1000).toLocaleDateString();
        $(currentCity).html(response.name +"("+date+")" + "<img src="+iconurl+">");
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        $(currentTemperature).html(" " + (tempF).toFixed(2)+"&#8457");
        $(currentHumidty).html(" " +response.main.humidity+"%");
        var ws=response.wind.speed;
        var windsmph=(ws*2.237).toFixed(1);
        $(currentWSpeed).html(" " + windsmph+"MPH");
        var lon = response.coord.lon;
        var lat = response.coord.lat;
        //the url for uvindex.
        var queryURLUv = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey +"&lat=" + lat +"&lon="+ lon ;
        $.ajax({
        url:queryURLUv,
        method:"GET"
        }).then(function(response){
            console.log(response)
            $(currentUvindex).html(" " + response.value);
      
        if(response.value <= 2.0){
            $(currentUvindex).addClass("favorable");
        } 
        if(response.value > 2.0 && response.value <= 8.0){
            $(currentUvindex).addClass("moderate");
        }
        if(response.value > 8.0){
            $(currentUvindex).addClass("severe");
        } 
    });   
    });
}

//function to get 5 days forcast
function forecast(cityName){
    var queryURL5 = "http://api.openweathermap.org/data/2.5/forecast?q="+ cityName +"&appid=" + apiKey;
    $.ajax({
        url:queryURL5,
        method:"GET"
    }).then(function(response){
        for (i=0; i<=5; i++) {
            var date= new Date((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
            console.log(response.list);
            var iconcode= response.list[((i+1)*8)-1].weather[0].icon;
            var iconurl="https://openweathermap.org/img/wn/"+iconcode+".png";
            var tempK= response.list[((i+1)*8)-1].main.temp;
            var tempF=(((tempK-273.5)*1.80)+32).toFixed(2);
            var humidity= response.list[((i+1)*8)-1].main.humidity;
        
            $("#date"+i).html(date);
            $("#img"+i).html("<img src="+iconurl+">");
            $("#temp"+i).html(tempF+"&#8457");
            $("#humidity"+i).html(humidity+"%");
        }
        
    });
}

