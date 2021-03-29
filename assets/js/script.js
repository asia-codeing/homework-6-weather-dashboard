var searchBtn = $("#search-button");
var citiesList = $(".list-group");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var currentHumidty = $("#humidity");
var currentWSpeed = $("#wind-speed");
var currentUvindex = $("#uvIndex");
var clearHistory = $("#clear-history");
var saveList = [];

$(document).ready(function() {
//search button
searchBtn.on("click",function(event){
    event.preventDefault();
    var enteredCity = $('input[name="input-city"]').val().trim().toUpperCase();
    if (!enteredCity){
        console.log("You didn't enter a city");
        return;
    }
    var history = '<li>' + enteredCity + '</li>';
    console.log(history);
    citiesList.append(history);
    
    $('input[name="input-city"]').val('');
    if (enteredCity != "") {
        //Check to see if there is any text entered
        saveList.push(enteredCity)
        localStorage.setItem("citySearchList", JSON.stringify(saveList));   
    }   
    getCurrentWeather(enteredCity);
    forecast(enteredCity);
});
var citySearchList = JSON.parse(localStorage.getItem("citySearchList"));
console.log(citySearchList);

for (var i = 0; i < citySearchList.length; i++){
    var history = '<li>' + citySearchList[i] + '</li>';
    console.log(history);
    citiesList.append(history);
}
//function click on a city in the search history,I am again presented with current and future conditions for that city.
citiesList.on("click", function(){
        getCurrentWeather(citySearchList);
        forecast(citySearchList);
});

});

//clear button
clearHistory.on("click", function(){
    citiesList.empty();
});


//Set the APIKEY
const apiKey ="398a5ac241a4f7ec9425839acac6ae15";
//This function bring the current weather condition
function getCurrentWeather(cityName) {
    console.log(cityName);
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+ cityName + "&appid=" + apiKey;
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
        var queryURLUv = "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey +"&lat=" + lat +"&lon="+ lon ;
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

//Function to get 5 days forcast
function forecast(cityName){
    var queryURL5 = "https://api.openweathermap.org/data/2.5/forecast?q="+ cityName +"&appid=" + apiKey;
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


