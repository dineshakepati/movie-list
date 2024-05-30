const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');
const backButton = document.getElementById('back-button');
const addToListButton = document.getElementById('add-to-list-button');
const publicListsDiv = document.getElementById('public-movie-lists');
const privateListsDiv = document.getElementById('private-movie-lists');
let currentMovieDetails;
let userLists = [
    { name: "Favorites", isPublic: true, movies: [] },
    { name: "Watch Later", isPublic: false, movies: [] }
];

function initialize() {
    displayUserLists();
}

// Event listeners
backButton.addEventListener('click', () => {
    searchList.classList.remove('hide-search-list');
    resultGrid.innerHTML = '';
    backButton.classList.add('hide-search-list');
    addToListButton.classList.add('hide-search-list');
});

addToListButton.addEventListener('click', () => {
    addToMovieList();
});

movieSearchBox.addEventListener('input', findMovies);

window.addEventListener('click', (event) => {
    if (event.target.className != "form-control") {
        searchList.classList.add('hide-search-list');
    }
});

// Functions
async function loadMovies(searchTerm) {
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=fc1fef96`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    if (data.Response === "True") displayMovieList(data.Search);
}

function findMovies() {
    let searchTerm = (movieSearchBox.value).trim();
    if (searchTerm.length > 0) {
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

function displayMovieList(movies) {
    searchList.innerHTML = "";
    for (let idx = 0; idx < movies.length; idx++) {
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID;
        movieListItem.classList.add('search-list-item');
        let moviePoster = (movies[idx].Poster != "N/A") ? movies[idx].Poster : "image_not_found.png";
        movieListItem.innerHTML = `
            <div class="search-item-thumbnail">
                <img src="${moviePoster}">
            </div>
            <div class="search-item-info">
                <h3>${movies[idx].Title}</h3>
                <p>${movies[idx].Year}</p>
                <button onclick="addToPublicList('${movies[idx].imdbID}', '${movies[idx].Title}')">Public</button>
                <button onclick="addToPrivateList('${movies[idx].imdbID}', '${movies[idx].Title}')">Private</button>
            </div>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

function loadMovieDetails() {
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=fc1fef96`);
            const movieDetails = await result.json();
            displayMovieDetails(movieDetails);
        });
    });
}

function displayMovieDetails(details) {
    resultGrid.innerHTML = `
        <div class="movie-poster">
            <img src="${(details.Poster !== "N/A") ? details.Poster : "image_not_found.png"}" alt="movie poster">
        </div>
        <div class="movie-info">
            <h3 class="movie-title" data-id="${details.imdbID}">${details.Title}</h3>
            <ul class="movie-misc-info">
                <li class="year">Year: ${details.Year}</li>
                <li class="rated">Ratings: ${details.Rated}</li>
                <li class="released">Released: ${details.Released}</li>
            </ul>
            <p class="genre"><b>Genre:</b> ${details.Genre}</p>
            <p class="writer"><b>Writer:</b> ${details.Writer}</p>
            <p class="actors"><b>Actors: </b>${details.Actors}</p>
            <p class="plot"><b>Plot:</b> ${details.Plot}</p>
            <p class="language"><b>Language:</b> ${details.Language}</p>
            <p class="awards"><b><i class="fas fa-award"></i></b> ${details.Awards}</p>
        </div>
        <button id="back-to-search">Back to Search</button>
    `;
    backButton.classList.remove('hide-search-list'); // Show the back button
    addToListButton.classList.remove('hide-search-list'); // Show the add-to-list button
}

function addToMovieList() {
    const movieTitle = resultGrid.querySelector('.movie-title').textContent;
    const movieID = resultGrid.querySelector('.movie-title').dataset.id;
    let movieListName = prompt("Enter the name of the list to add this movie to:");
    if (!movieListName) return;

    let list = userLists.find(list => list.name === movieListName);
    if (!list) {
        let isPublic = confirm("Do you want this list to be public?");
        list = { name: movieListName, isPublic: isPublic, movies: [] };
        userLists.push(list);
    }

    list.movies.push({ title: movieTitle, id: movieID });
    displayUserLists();
    alert(`Added "${movieTitle}" to list "${movieListName}"`);
}

function addToPublicList(movieID, movieTitle) {
    let list = userLists.find(list => list.isPublic === true);
    if (!list) {
        list = { name: "Public List", isPublic: true, movies: [] };
        userLists.push(list);
    }

    list.movies.push({ title: movieTitle, id: movieID });
    displayUserLists();
    alert(`Added "${movieTitle}" to Public List`);
}

function addToPrivateList(movieID, movieTitle) {
    let list = userLists.find(list => list.isPublic === false);
    if (!list) {
        list = { name: "Private List", isPublic: false, movies: [] };
        userLists.push(list);
    }

    list.movies.push({ title: movieTitle, id: movieID });
    displayUserLists();
    alert(`Added "${movieTitle}" to Private List`);
}

function displayUserLists() {
    publicListsDiv.innerHTML = "";
    privateListsDiv.innerHTML = "";

    userLists.forEach(list => {
        const listDiv = document.createElement('div');
        listDiv.classList.add('movie-list');
        listDiv.innerHTML = `
            <h4>${list.name} ${list.isPublic ? '(Public)' : '(Private)'}</h4>
            <ul>
                ${list.movies.map(movie => `<li class="movie-title" data-id="${movie.id}">${movie.title}</li>`).join('')}
            </
            ul>
            `;
            if (list.isPublic) {
                publicListsDiv.appendChild(listDiv);
            } else {
                privateListsDiv.appendChild(listDiv);
            }
        });
    
        // Add event listener for movie titles in favorites list
        publicListsDiv.addEventListener('click', (event) => {
            const clickedElement = event.target;
            if (clickedElement.classList.contains('movie-title')) {
                const movieID = clickedElement.dataset.id;
                openAppearancePage(movieID);
            }
        });
    }
    
    // Function to open appearance page
    function openAppearancePage(movieID) {
        // You can replace this URL with the actual URL of the appearance page
        const appearanceURL = `https://example.com/appearance/${movieID}`;
        window.open(appearanceURL, '_blank');
    }
    
    initialize(); // Initialize the user lists on page load
    
    // Add event listener for the "Back to Search" button
    resultGrid.addEventListener('click', (event) => {
        if (event.target.id === "back-to-search") {
            goBack();
        }
    });
    
    // Define the goBack function
    function goBack() {
        searchList.classList.remove('hide-search-list');
        resultGrid.innerHTML = '';
        backButton.classList.add('hide-search-list');
        addToListButton.classList.add('hide-search-list');
    }
    