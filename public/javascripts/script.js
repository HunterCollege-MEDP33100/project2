const containerEl = document.getElementById("anime_container");
const loadMoreBtn = document.getElementById("loadMore");
const filterEl = document.getElementById("filter-type");
const sortEl = document.getElementById("sort-type");
const refreshBtn = document.getElementById("refresh");
const searchEl = document.getElementById("search");
const viewToggleEl = document.getElementById("view-toggle");

let state = {
  currentPage: 1,
  animeList: [],
  filteredList: [],
  currentType: "tv",
  currentSort: "score",
  currentView: "grid",
  hasNextPage: false,
  isLoading: false,
  searchTerm: ""
};

// search
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// jikan rate limit API
async function getAnime(type = "tv", page = 1, append = false) {
  if (state.isLoading) return;
  
  state.isLoading = true;
  showLoading();
  
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await fetch(
      `https://api.jikan.moe/v4/top/anime?type=${type}&page=${page}&limit=24`
    );
    
    if (!response.ok) throw new Error("Failed to fetch data");
    
    const data = await response.json();
    
    if (append) {
      state.animeList = [...state.animeList, ...data.data];
    } else {
      state.animeList = data.data;
      state.currentPage = 1;
    }
    
    state.hasNextPage = data.pagination.has_next_page;
    state.filteredList = state.animeList;
    
    applyFiltersAndSort();
    updateLoadMoreButton();
    
  } catch (error) {
    console.error("Error fetching anime:", error);
    showError();
  } finally {
    state.isLoading = false;
  }
}

// loadstate
function showLoading() {
  if (!state.animeList.length) {
    containerEl.innerHTML = `
      <div class="loading">
        Loading amazing anime content
      </div>
    `;
  }
}

// errorstate
function showError() {
  containerEl.innerHTML = `
    <div class="loading">
      Oops! Something went wrong. Please try refreshing.
    </div>
  `;
}

// search filters
function applySearch() {
  const term = state.searchTerm.toLowerCase();
  if (term) {
    state.filteredList = state.animeList.filter(anime => 
      anime.title.toLowerCase().includes(term) ||
      anime.title_english?.toLowerCase().includes(term)
    );
  } else {
    state.filteredList = state.animeList;
  }
  sortAnime(state.currentSort);
}

// sorting
function sortAnime(criteria) {
  state.currentSort = criteria;
  
  switch(criteria) {
    case "score":
      state.filteredList.sort((a, b) => (b.score || 0) - (a.score || 0));
      break;
    case "rank":
      state.filteredList.sort((a, b) => (a.rank || Infinity) - (b.rank || Infinity));
      break;
    case "title":
      state.filteredList.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }
  
  displayAnime(state.filteredList);
}

// filters and sorting
function applyFiltersAndSort() {
  applySearch();
  sortAnime(state.currentSort);
}

// grid
function displayAnimeGrid(animeList) {
  const grid = document.createElement("div");
  grid.classList.add("anime-grid");
  
  animeList.forEach((anime, index) => {
    const card = createAnimeCard(anime, index);
    grid.appendChild(card);
  });
  
  containerEl.innerHTML = "";
  containerEl.appendChild(grid);
}

// list
function displayAnimeList(animeList) {
  const list = document.createElement("div");
  list.classList.add("anime-list");
  
  animeList.forEach((anime, index) => {
    const item = createAnimeListItem(anime, index);
    list.appendChild(item);
  });
  
  containerEl.innerHTML = "";
  containerEl.appendChild(list);
}

// animecards
function createAnimeCard(anime, index) {
  const card = document.createElement("div");
  card.classList.add("anime-card");
  card.style.setProperty("--card-index", index);
  
  card.innerHTML = `
    <div class="anime-image">
      ${anime.rank ? `<span class="anime-rank">#${anime.rank}</span>` : ''}
      ${anime.score ? `<span class="anime-score">${anime.score}</span>` : ''}
      <img src="${anime.images.jpg.large_image_url || anime.images.jpg.image_url}" 
           alt="${anime.title}"
           loading="lazy">
    </div>
    <div class="anime-content">
      <h3 class="anime-title" title="${anime.title}">${anime.title}</h3>
      <div class="anime-meta">
        <span class="anime-type">${anime.type || 'N/A'}</span>
        <span>${anime.episodes ? `${anime.episodes} episodes` : 'Ongoing'}</span>
      </div>
    </div>
  `;
  
  card.addEventListener("click", () => {
    window.open(anime.url, "_blank");
  });
  
  return card;
}

// animelistview
function createAnimeListItem(anime, index) {
  const item = document.createElement("div");
  item.classList.add("anime-list-item");
  item.style.setProperty("--card-index", index);
  
  item.innerHTML = `
    <div class="anime-image">
      <img src="${anime.images.jpg.image_url}" 
           alt="${anime.title}"
           loading="lazy">
    </div>
    <div class="anime-details">
      <h3 class="anime-title">${anime.title}</h3>
      <div class="anime-stats">
        ${anime.rank ? `<span>Rank: <strong>#${anime.rank}</strong></span>` : ''}
        ${anime.score ? `<span>Score: <strong>${anime.score}</strong></span>` : ''}
        <span class="anime-type">${anime.type || 'N/A'}</span>
        <span>${anime.episodes ? `${anime.episodes} episodes` : 'Ongoing'}</span>
      </div>
    </div>
  `;
  
  item.addEventListener("click", () => {
    window.open(anime.url, "_blank");
  });
  
  return item;
}

// displayview
function displayAnime(animeList) {
  if (!animeList.length) {
    containerEl.innerHTML = `
      <div class="loading">
        No anime found. Try adjusting your filters.
      </div>
    `;
    return;
  }
  
  if (state.currentView === "grid") {
    displayAnimeGrid(animeList);
  } else {
    displayAnimeList(animeList);
  }
}

function updateLoadMoreButton() {
  loadMoreBtn.classList.toggle("hidden", !state.hasNextPage);
}

// toggleviews
function toggleView(view) {
  state.currentView = view;

  document.querySelectorAll(".view-toggle button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.view === view);
  });
  
  displayAnime(state.filteredList);
}

// event listener
filterEl?.addEventListener("change", (e) => {
  state.currentType = e.target.value;
  state.currentPage = 1;
  getAnime(state.currentType, state.currentPage);
});

sortEl?.addEventListener("change", (e) => {
  sortAnime(e.target.value);
});

loadMoreBtn?.addEventListener("click", () => {
  if (state.hasNextPage && !state.isLoading) {
    state.currentPage++;
    getAnime(state.currentType, state.currentPage, true);
  }
});

refreshBtn?.addEventListener("click", () => {
  if (!state.isLoading) {
    getAnime(state.currentType, 1);
  }
});

// searchfunct
if (searchEl) {
  const debouncedSearch = debounce(() => {
    state.searchTerm = searchEl.value;
    applyFiltersAndSort();
  }, 300);
  
  searchEl.addEventListener("input", debouncedSearch);
}

if (viewToggleEl) {
  viewToggleEl.addEventListener("click", (e) => {
    if (e.target.dataset.view) {
      toggleView(e.target.dataset.view);
    }
  });
}

// lazy load
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        observer.unobserve(img);
      }
    }
  });
}, {
  rootMargin: "50px"
});

// app init
document.addEventListener("DOMContentLoaded", () => {
  getAnime(state.currentType, state.currentPage);
});

// Ashortcuts for kb
document.addEventListener("keydown", (e) => {
  if (e.key === "g" && !e.ctrlKey && !e.altKey && !e.metaKey) {
    if (document.activeElement.tagName !== "INPUT") {
      toggleView("grid");
    }
  }
  if (e.key === "l" && !e.ctrlKey && !e.altKey && !e.metaKey) {
    if (document.activeElement.tagName !== "INPUT") {
      toggleView("list");
    }
  }
  if (e.key === "r" && !e.ctrlKey && !e.altKey && !e.metaKey) {
    if (document.activeElement.tagName !== "INPUT") {
      e.preventDefault();
      refreshBtn?.click();
    }
  }
});
