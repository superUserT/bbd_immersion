// news.js

// Make sure to include your API token here
const apiToken = "RUk41FSxrrsyK0xbDy7jrMh2cRC9vOsNEtTbKi2I";
const newsContainer = document.querySelector("#news");

function fetchTopNews() {
  // Define the query parameters
  const params = {
    api_token: apiToken,
    categories: "business,tech",
    search: "apple",
    limit: "5", // Limit to 5 results
  };

  // Encode parameters
  const esc = encodeURIComponent;
  const query = Object.keys(params)
    .map((k) => `${esc(k)}=${esc(params[k])}`)
    .join("&");

  // Define the URL for the NewsAPI endpoint
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

      // Generate HTML content for the news articles
      const htmlString = data.data
        .map((item) => {
          const image = item.image_url
            ? `<img src="${item.image_url}" alt="${item.title}" style="width: 100%; max-width: 600px;">`
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

      // Insert the generated HTML into the newsContainer
      newsContainer.innerHTML = htmlString;
    })
    .catch((error) => {
      newsContainer.innerHTML = `<div class='error'>Error fetching news: ${error.message}</div>`;
      console.error("Error fetching news:", error);
    });
}

// Optional: Add event listener to the button if you want to trigger it via JS instead of inline HTML
document.querySelector("button").addEventListener("click", fetchTopNews);
