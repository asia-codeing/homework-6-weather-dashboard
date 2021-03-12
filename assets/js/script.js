var searchBtn = $("#search-button");
var history = JSON.parse(localStorage.getItem("search")) ;
var citiesList = $(".list-group");
var cities = [];

searchBtn.on("click",function(event){
    event.preventDefault();
    var enteredCity = $('input[name="input-city"]').val();
    if (!enteredCity){
        console.log("You didn't enter a city");
        return;
    }
    citiesList.append('<li>' + enteredCity + '</li>');
    $('input[name="input-city"]').val('');
    localStorage.setItem("search",JSON.stringify(cities));
    getCurrentWeather(enteredCity);
    forecast(enteredCity);
});
const apiKey ="398a5ac241a4f7ec9425839acac6ae15";

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
        $(".city-name").html(response.name);
       // $(".current-date").html(moment(weather.dt.value).format("MMM D, YYYY"));
        $(".icon").innerHTML("<img src='http://openweathermap.org/img/w/" + response.weather[0].icon + "@2x.png'/>");
        $("#temperature").text(response.main.temp + " °F");
        $("#humidity").text(response.main.humidity + "%");
        $("#wind-speed").text(response.wind.speed + " MPH");

        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var queryURLUv = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat +"&lon="+ lon +"&appid=" + apiKey;
        

        //get uv index
        $.ajax({
            url: queryURLUv,
            method: "GET"
        })
        .then(function(response) {
         console.log(queryURL);
         console.log(response);
         $("#uv-index").text(response.val());
        
        if(response.val() <=2){
            $("#uv-index").addClass("favorable");
        }else if(response.val() >2 && response.val()<=8){
            $("#uv-index").addClass("moderate ");
        }
        else if(response.val()() >8){
            $("#uv-index").addClass("severe");
        }     
});
});
}
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
