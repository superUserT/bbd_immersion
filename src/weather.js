require("dotenv").config();

let button = document.querySelector(".button");
let inputvalue = document.querySelector(".inputValue");
let nameVal = document.querySelector(".name");
let temp = document.querySelector(".temp");
let desc = document.querySelector(".desc");

let weatherKey = process.env.WeatherAPI;

button.addEventListener("click", function () {
  //thabiso remember not to hardcode api keys again
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${inputvalue.value}&units=metric&appid=${weatherKey}`
  )
    .then((response) => response.json())
    .then(displayData)
    .catch((err) => alert("Wrong City name"));
});

const displayData = (weather) => {
  temp.innerText = `${weather.main.temp}°C`;
  desc.innerText = `${weather.weather[0].main}`;
};
