export async function getMovies() {
    const movieInfo = await fetchMovies();
    const movieCovers = await fetchCovers();
    movieInfo.forEach(movie => {
        movie.coverURL = movieCovers.find(obj => Object.keys(obj) == movie.title)[movie.title]
    })
    return (movieInfo);
}

async function fetchMovies() {
    try {
        const response = await fetch(`https://ghibliapi.herokuapp.com/films`);
        const movies = await response.json();
        return movies;
    } catch (error) {
        console.error(error);
    }
}

async function fetchCovers() {
    try {
        const response = await fetch(`https://gist.githubusercontent.com/hhbngo/c808284f5092d47499605219b4cf94d4/raw/db4ab827d85053e0c1769430b9a7913509d01487/movieCover.json`);
        const movies = await response.json();
        return movies;
    } catch (error) {
        console.error(error);
    }
}


