const newsContainer = document.querySelector("#news");
const apiKey = "476d094070234c3bac58bca28cab17a3";

let countryCodes = {
  ae: "United Arab Emirates",
  ar: "Argentina",
  at: "Austria",
  au: "Australia",
  be: "Belgium",
  bg: "Bulgaria",
  br: "Brazil",
  ca: "Canada",
  ch: "Switzerland",
  cn: "China",
  co: "Colombia",
  cu: "Cuba",
  cz: "Czech Republic",
  de: "Germany",
  eg: "Egypt",
  fr: "France",
  gb: "United Kingdom",
  gr: "Greece",
  hk: "Hong Kong",
  hu: "Hungary",
  id: "Indonesia",
  ie: "Ireland",
  il: "Israel",
  in: "India",
  it: "Italy",
  jp: "Japan",
  kr: "South Korea",
  lt: "Lithuania",
  lv: "Latvia",
  ma: "Morocco",
  mx: "Mexico",
  my: "Malaysia",
  ng: "Nigeria",
  nl: "Netherlands",
  no: "Norway",
  nz: "New Zealand",
  ph: "Philippines",
  pl: "Poland",
  pt: "Portugal",
  ro: "Romania",
  rs: "Serbia",
  ru: "Russia",
  sa: "Saudi Arabia",
  se: "Sweden",
  sg: "Singapore",
  si: "Slovenia",
  sk: "Slovakia",
  th: "Thailand",
  tr: "Turkey",
  tw: "Taiwan",
  ua: "Ukraine",
  us: "United States",
  ve: "Venezuela",
  za: "South Africa",
};

fetch("./countryCodes.json")
  .then((response) => response.json())
  .then((data) => {
    countryCodes = data;
  })
  .catch((error) => {
    console.error("Error fetching country codes:", error);
  });

function fetchLocationNews() {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      getCountryCodeFromCoords(latitude, longitude)
        .then((countryCode) => {
          if (countryCode && countryCodes[countryCode]) {
            fetchTopNews(countryCode);
          } else {
            newsContainer.innerHTML =
              "Unable to determine location or country code.";
          }
        })
        .catch((error) => {
          console.error("Error determining location:", error);
          newsContainer.innerHTML = "Error determining location.";
        });
    },
    (error) => {
      console.error("Error getting location:", error);
      newsContainer.innerHTML = "Error getting location.";
    }
  );
}

function getCountryCodeFromCoords(latitude, longitude) {
  return Promise.resolve("us");
}

function fetchTopNews(countryCode) {
  const url = new URL(`https://newsapi.org/v2/top-headlines`);
  url.searchParams.append("country", countryCode);
  url.searchParams.append("apiKey", apiKey);

  fetch(url.toString())
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (!data.articles || data.articles.length === 0) {
        newsContainer.innerHTML = "No articles found for your location.";
        return;
      }

      let htmlString = data.articles
        .map((item) => {
          const image = item.urlToImage
            ? `<img src="${item.urlToImage}" alt="${item.title}">`
            : "";
          return `
            <article>
            <hr />
            <h2>${item.title}</h2>
            <h3>${item.author || "Unknown Author"}</h3>
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
