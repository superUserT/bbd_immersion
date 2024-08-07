let button = document.querySelector(".button");
let temp = document.querySelector(".temp");
let desc = document.querySelector(".desc");
let coords = document.querySelector(".coords");

button.addEventListener("click", function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const apiKey = "8b151143c8cc860a1c3a07ac2aebd4b5";
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

        fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            const temperature = data.main.temp;
            const description = data.weather[0].main;

            temp.innerText = `Current Temperature: ${temperature}°C`;
            desc.innerText = `Current Condition: ${description}`;

            coords.innerText = `Latitude: ${lat}, Longitude: ${lon}`;
          })
          .catch((error) => {
            console.log("Error fetching weather data:", error);
            alert("Failed to fetch weather data.");
          });
      },
      (error) => {
        console.log("Error getting geolocation:", error);
        alert("Geolocation is not supported or permission denied.");
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
});
