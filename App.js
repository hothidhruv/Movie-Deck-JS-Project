
//to store movie
let movies = [];
let currentPage = 1;
const movieList = document.getElementById("movie-lists"); // this variable globally declaer

async function fetchMovies(page) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=f531333d637d0c44abc85b3e74db2186&language=en-US&page=1${page}`);
        const result = await response.json();  //this is method that will convert data into json
        movies = result.results;  //what is it ?
        console.log("movies", movies);
        renderMovies(movies);
    } catch (error) {
        console.log(error);
    }
}


//fetch the movie from localStorage
function getMovieNameFromLocalStoage() {
    favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies"));
    return favoriteMovies === null ? [] : favoriteMovies;
}

//add movie to localStorage
function addMovieNameToLocalStorage(movie) {
    const favMovieName = getMovieNameFromLocalStoage();
    localStorage.setItem("favoriteMovies", JSON.stringify([...favMovieName, movie]));
};

//remove movie from localStorage 
function removeMovieNameToLocalStorage(movie) {
    const favMovieName = getMovieNameFromLocalStoage();
    localStorage.setItem("favoriteMovies", JSON.stringify(favMovieName.filter((movieName) => movieName != movie)));
};




//function to display the movie in the html page //
const renderMovies = (movies) => {
    // const movieList = document.getElementById("movie-lists"); //we get refernce to ul
    movieList.innerHTML = "";
    movies.map((movie) => {
        const { poster_path, title, vote_count, vote_average } = movie;
        const listItem = document.createElement("li");
        listItem.className = "card";
        let imgSrs = poster_path ? `https://image.tmdb.org/t/p/original/${poster_path}`
            : "https://w7.pngwing.com/pngs/116/765/png-transparent-clapperboard-computer-icons-film-movie-poster-angle-text-logo-thumbnail.png";

        listItem.innerHTML += `<img class="poster" src=${imgSrs} alt =${title}/>
                                <p class="title"> ${title}</p>
                                <section class="vote-favoriteIcon">
                                    <section class="vote">
                                        <p class="vote-count">vote-count : ${vote_count}</p>
                                        <p class="vote-average">vote-average : ${vote_average}</p>
                                    </section>
                                    <i class="favorite-icon fa-regular fa-heart fa-2xl" id="${title}"></i>
                                </section> `;


        //this part for like or declike that time creat event  
        const favoriteIcon = listItem.querySelector('.favorite-icon');
        favoriteIcon.addEventListener('click', (event) => {

            const { id } = event.target;  //we get id ,while do click heart 
            console.log('id for the movie', id);


            if (favoriteIcon.classList.contains("fa-solid")) {
                removeMovieNameToLocalStorage(id);
                favoriteIcon.classList.remove("fa-solid");
            }
            else {
                addMovieNameToLocalStorage(id);
                favoriteIcon.classList.add("fa-solid");
            }
        });


        movieList.appendChild(listItem)
    });
};


// logic to sort by Date //
// for cheking if the sort by date button clicking first time or not
let firstSortByDateClick = true;  //create flag variable 
const sortByDateButton = document.getElementById("short-date");
function shortByDate() {
    let shortedMovies;

    if (firstSortByDateClick) {
        shortedMovies = movies.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
        sortByDateButton.textContent = "Sort by date (latest to oldest)";
        firstSortByDateClick = false;
    }
    else if (!firstSortByDateClick) {
        shortedMovies = movies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
        sortByDateButton.textContent = "Sort by date (oldest to latest)";
        firstSortByDateClick = true;
    }
    renderMovies(shortedMovies);
}



//logic to sort by rating 
let firstSortByRatingClick = true;  //create flag variable 
const sortByRatingButton = document.getElementById("short-rating");
function shortByRatig() {
    let shortedMovies;

    if (firstSortByRatingClick) {
        shortedMovies = movies.sort((a, b) => a.vote_average - b.vote_average);
        sortByRatingButton.textContent = "Sort by rating (most to least)";
        firstSortByRatingClick = false;
    }
    else if (!firstSortByRatingClick) {
        shortedMovies = movies.sort((a, b) => b.vote_average - a.vote_average);
        sortByRatingButton.textContent = "Sort by rating (least to most)";
        firstSortByRatingClick = true;
    }
    renderMovies(shortedMovies);
}



const showFavoritMovie = (favMoviesName) => {
    const { poster_path, title, vote_count, vote_average } = favMoviesName;
    const listItem = document.createElement("li");
    listItem.className = "card";
    let imgSrs = poster_path ? `https://image.tmdb.org/t/p/original/${poster_path}`
        : "https://w7.pngwing.com/pngs/116/765/png-transparent-clapperboard-computer-icons-film-movie-poster-angle-text-logo-thumbnail.png";
    listItem.innerHTML += `<img class="poster" src=${imgSrs} alt =${title}/>
                            <p class="title"> ${title}</p>
                            <section class="vote-favoriteIcon">
                                <section class="vote">
                                    <p class="vote-count">vote-count : ${vote_count}</p>
                                    <p class="vote-average">vote-average : ${vote_average}</p>
                                </section>
                                <i class="favorite-icon fa-solid fa-heart fa-2xl heart" id="${title}"></i>
                            </section> `;

    const removeWhistlistBtn = listItem.querySelector(".heart");
    removeWhistlistBtn.addEventListener("click", (event) => {
        const { id } = event.target;
        removeMovieNameToLocalStorage(id);
        fetchWishlistMovies();
    })

    movieList.appendChild(listItem);
}


// search for movies
const searchMovies = async (searchMovie) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${searchMovie}&api_key=f531333d637d0c44abc85b3e74db2186&language=en-US&page=1`);
        const result = await response.json();
        movies = result.results;
        renderMovies(movies);
    
    } catch (error) {
        console.log(error);
    }

}
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");

searchButton.addEventListener("click", () => {
    searchMovies(searchInput.value);
})




const getMovieByName = async (movieName) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${movieName}&api_key=f531333d637d0c44abc85b3e74db2186&language=en-US&page=1`);
        const result = await response.json();
        return result.results[0];
    }
    catch (error) {

    }
}

const fetchWishlistMovies = async () => {
    movieList.innerHTML = "";
    const movieNameList = getMovieNameFromLocalStoage();
    for (let i = 0; i < movieNameList.length; i++) {
        const movieName = movieNameList[i];
        let movieDataFromName = await getMovieByName(movieName);
        showFavoritMovie(movieDataFromName);
    }
}
//get reffrence to buttons 
const allTab = document.getElementById("tab1");
const favouriteTab = document.getElementById("tab2");

function displayMovies() {
    if (allTab.classList.contains("active-tab")) {
        renderMovies(movies);
    }
    else if (favouriteTab.classList.contains("active-tab")) {
        fetchWishlistMovies();
    }
}

function switchTab(event) {
    allTab.classList.remove("active-tab");
    favouriteTab.classList.remove("active-tab");
    event.target.classList.add("active-tab");
    displayMovies();
}

allTab.addEventListener("click", switchTab);
favouriteTab.addEventListener("click", switchTab);



sortByDateButton.addEventListener("click", shortByDate);
sortByRatingButton.addEventListener("click", shortByRatig);



const prevButton = document.querySelector("button#prev-button");
const nextButton = document.querySelector("button#next-button");
const pgNoButton = document.querySelector("button#page-number-button");

prevButton.disabled = true;

prevButton.addEventListener('click', () => {
    currentPage--;
    fetchMovies(currentPage);
    pgNoButton.textContent = `Current Page: ${currentPage}`;
    if (currentPage == 1) {
        prevButton.disabled = true;
        nextButton.disabled = false;
    }
    else if (currentPage == 2) {
        prevButton.disabled = false;
        nextButton.disabled = false;
    }
});
nextButton.addEventListener('click', () => {
    currentPage++;
    fetchMovies(currentPage);
    pgNoButton.textContent = `Current Page: ${currentPage}`;
    if (currentPage == 445) {
        prevButton.disabled = false;
        nextButton.disabled = true;
    }
    else if (currentPage == 1) {
        prevButton.disabled = true;
        nextButton.disabled = false;
    }

    else {
        prevButton.disabled = false;
        nextButton.disabled = false;
    }
});

fetchMovies(currentPage);
