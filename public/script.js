var weatherApp = function() {

    var locations = []

    var STORAGE_ID = 'gettheWeather';

    var ID = 0

    var getWeather = function(city, country, temp, time) {
        var newLocation = {
            city: city,
            country: country,
            temp: temp,
            ID: ID,
            time: time,
            comments: []
        }
        ID++
        locations.push(newLocation)
        renderWeather();
    }



    var _findPostById = function(id) {
        for (var i = 0; i < locations.length; i += 1) {
            if (locations[i].ID === id) {
                return locations[i];
            }
        }
    }

    var addComment = function(comtext, id) {
        var tempolocation = _findPostById(id)
        var texttoComment = { text: comtext }
        tempolocation.comments.push(texttoComment)
        renderWeather()
    }





    var saveToLocalStorage = function() {

        localStorage.setItem(STORAGE_ID, JSON.stringify(locations)); //new

        console.log(localStorage)
    }

    var getFromLocalStorage = function() {
        // var tempFetch = JSON.parse(localStorage['gettheWeather'] || '[]');
        // var cityOnly = JSON.parse(localStorage['cityonly'] || '[]');
        // fetchCity(cityonly)
        locations = JSON.parse(localStorage['gettheWeather'] || '[]');

        // if (STORAGE_ID.length>=1) {
        //      fetch(tempFetch)
        // }
        // else {
        //  return
        // }
    }



    var fetch = function(text,obj) {

        $.ajax({
            method: "GET",
            url: 'http://api.openweathermap.org/data/2.5/weather?q=' + text + '&appid=d703871f861842b79c60988ccf3b17ec',
            success: function(data) {
                var temp = Math.floor(data.main.temp - 273.15)
                var city = data.name;
                var country = data.sys.country;
                var time = new Date().toString();
                // var time = Date.now()
// obj.temp = temp;
                getWeather(city, country, temp, time)
            }
        })
    }


    var renderWeather = function() {
        $('.the-weather').empty()
        if (locations.length >= 1) {
            var source = $('#weather-template').html();
            var template = Handlebars.compile(source);

            for (var i = 0; i < locations.length; i++) {
                var newHTML = template(locations[i]);
                $('#show-weather').append(newHTML)
            }
            saveToLocalStorage()

        }
    }


    var removeWeather = function(id) {
        var weathertoRemove = _findPostById(id)
        locations.splice(locations.indexOf(weathertoRemove), 1);
        renderWeather()

    }



    return {
        renderWeather:renderWeather,
        addComment: addComment,
        removeWeather: removeWeather,
        fetch: fetch,
        addComment: addComment,
        getFromLocalStorage, 

    }

}


var app = weatherApp();
//events

$('.get-weather-btn').on('click', function() {
    $('#show-weather').empty()
    var text = $('.weather-input').val();
    app.fetch(text)
});


$('.weather-main').on('click', '.add-comment-btn', function() {
    var comtext = $(this).closest('span').prev().val()
    var id = $(this).closest('.single-location').data().id
    app.addComment(comtext, id)
});


$('.weather-main').on('click', '.remove-comment-btn', function() {
    var id = $(this).closest('.single-location').data().id
    app.removeWeather(id)
});

app.getFromLocalStorage()
    // app.getlatest
app.renderWeather()



// async
