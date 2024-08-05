let button = document.querySelector(".button");
let inputvalue = document.querySelector(".inputValue");
let nameVal = document.querySelector(".name");
let temp = document.querySelector(".temp");
let desc = document.querySelector(".desc");

button.addEventListener("click", function () {
  // Fection data from open weather API
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${inputvalue.value}&units=metric&appid=8b151143c8cc860a1c3a07ac2aebd4b5`
  )
    .then((response) => response.json())
    .then(displayData)
    .catch((err) => alert("Wrong City name"));
});

const displayData = (weather) => {
  temp.innerText = `${weather.main.temp}°C`;
  desc.innerText = `${weather.weather[0].main}`;
};
