const apiToken = "RUk41FSxrrsyK0xbDy7jrMh2cRC9vOsNEtTbKi2I";
const newsContainer = document.querySelector("#news");
const cityContainer = document.querySelector("#city");

function fetchLocationDetails(latitude, longitude) {
  const reverseGeocodeUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

  return fetch(reverseGeocodeUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const countryCode = data.countryCode || "us";
      const cityName = data.city || "your city";
      return { countryCode, cityName };
    });
}

function fetchTopNews(countryCode, searchQuery) {
  const params = {
    api_token: apiToken,
    categories: "business,tech",
    search: searchQuery,
    limit: "5",
    locale: countryCode,
  };

  const esc = encodeURIComponent;
  const query = Object.keys(params)
    .map((k) => `${esc(k)}=${esc(params[k])}`)
    .join("&");

  const url = `https://api.thenewsapi.com/v1/news/all?${query}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (!data.data || data.data.length === 0) {
        newsContainer.innerHTML = "No articles found.";
        return;
      }

      const htmlString = data.data
        .map((item) => {
          const image = item.image_url
            ? `<img src="${item.image_url}" alt="${item.title}" style="width: 100%; max-width: 600px;">`
            : "";
          return `
            <article>
              <hr />
              <h2>${item.title}</h2>
              ${image}
              <p>${item.description || "No description available."}</p>
              <a href="${item.url}" target="_blank">Read more</a>
              <hr />
            </article>
          `;
        })
        .join("");

      newsContainer.innerHTML = htmlString;
    })
    .catch((error) => {
      newsContainer.innerHTML = `<div class='error'>Error fetching news: ${error.message}</div>`;
      console.error("Error fetching news:", error);
    });
}

function getLocationAndFetchNews() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        fetchLocationDetails(latitude, longitude)
          .then(({ countryCode, cityName }) => {
            cityContainer.innerHTML = `City: ${cityName}`;
            fetchTopNews(
              countryCode,
              document.querySelector("#search-query").value
            );
          })
          .catch((error) =>
            console.error("Error fetching location details:", error)
          );
      },
      (error) => {
        console.error("Error getting location:", error);
        fetchTopNews("us", document.querySelector("#search-query").value);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
    fetchTopNews("us", document.querySelector("#search-query").value);
  }
}

function searchNews() {
  const searchQuery = document.querySelector("#search-query").value;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        fetchLocationDetails(latitude, longitude)
          .then(({ countryCode }) => fetchTopNews(countryCode, searchQuery))
          .catch((error) =>
            console.error("Error fetching location details:", error)
          );
      },
      (error) => {
        console.error("Error getting location:", error);
        fetchTopNews("us", searchQuery);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
    fetchTopNews("us", searchQuery);
  }
}

document
  .querySelector("button")
  .addEventListener("click", getLocationAndFetchNews);
