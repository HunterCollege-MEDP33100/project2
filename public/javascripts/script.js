const containerEl = document.getElementById("slideshow_container");
const loadMoreBtn = document.getElementById("loadMore");
const filterEl = document.getElementById("filter-type");
const sortEl = document.getElementById("sort-type");
const refreshBtn = document.getElementById("refresh");

let currentPage = 1;
let animeList = [];
let currentType = "ona";
let hasNextPage = false;

// Fetch anime from Jikan API
async function getAnime(type = "ona", page = 1) {
  containerEl.innerHTML = `<div class="loading">Fetching ${type.toUpperCase()} anime...</div>`;
  try {
    const response = await fetch(`https://api.jikan.moe/v4/top/anime?type=${type}&page=${page}`);
    const data = await response.json();
    animeList = page === 1 ? data.data : [...animeList, ...data.data];
    hasNextPage = data.pagination.has_next_page;
    displayAnime(animeList);
    loadMoreBtn.classList.toggle("hidden", !hasNextPage);
  } catch (error) {
    containerEl.innerHTML = `<div class="loading">Error fetching data</div>`;
    console.error(error);
  }
}

// Display anime cards
function displayAnime(works) {
  containerEl.innerHTML = "";
  const sliderInner = document.createElement("div");
  sliderInner.classList.add("slider__inner");

  works.forEach((work) => {
    const card = document.createElement("div");
    card.classList.add("slider__contents");

    const img = document.createElement("img");
    img.src = work.images.jpg.image_url;
    img.alt = work.title;
    img.classList.add("slider__image");

    const title = document.createElement("h3");
    title.classList.add("slider__caption");
    title.textContent = work.title;

    const rank = document.createElement("p");
    rank.classList.add("slider__txt");
    rank.textContent = `Rank: ${work.rank || "N/A"} | Score: ${work.score || "N/A"}`;

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(rank);
    sliderInner.appendChild(card);
  });

  containerEl.appendChild(sliderInner);

  // Auto-slideshow logic
  let index = 0;
  setInterval(() => {
    index = (index + 1) % works.length;
    sliderInner.style.transform = `translateX(-${index * 100}%)`;
  }, 4000);
}

// Sorting function
function sortAnime(criteria) {
  if (criteria === "score") {
    animeList.sort((a, b) => (b.score || 0) - (a.score || 0));
  } else if (criteria === "rank") {
    animeList.sort((a, b) => (a.rank || Infinity) - (b.rank || Infinity));
  } else if (criteria === "title") {
    animeList.sort((a, b) => a.title.localeCompare(b.title));
  }
  displayAnime(animeList);
}

// Event Listeners
filterEl.addEventListener("change", (e) => {
  currentType = e.target.value;
  currentPage = 1;
  getAnime(currentType, currentPage);
});

sortEl.addEventListener("change", (e) => {
  sortAnime(e.target.value);
});

loadMoreBtn.addEventListener("click", () => {
  if (hasNextPage) {
    currentPage++;
    getAnime(currentType, currentPage);
  }
});

refreshBtn.addEventListener("click", () => {
  getAnime(currentType, 1);
});

// Initial call
getAnime(currentType, currentPage);
