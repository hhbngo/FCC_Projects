export const renderMovies = movieList => {
    movieList.forEach(movie => render(movie));
}

const render = movie => {
    const markup = `
    <a href="#${movie.id}">
        <div class="showcase__movie-card" style="background-image: url(${movie.coverURL})" data-name="${movie.title}">
        </div>
    </a>
    `;
    document.querySelector('.showcase').insertAdjacentHTML('beforeend', markup);
}

export const renderPhantomCovers = () => {
    const markup = `
        <div class="showcase__movie-card showcase__movie-card--phantom">
        </div>
        <div class="showcase__movie-card showcase__movie-card--phantom">
        </div>
        <div class="showcase__movie-card showcase__movie-card--phantom">
        </div>
        <div class="showcase__movie-card showcase__movie-card--phantom">
        </div>
    `;
    document.querySelector('.showcase').insertAdjacentHTML('beforeend', markup);
}

export const clearMovieCovers = () => {
    document.querySelector('.showcase').innerHTML = "";
}

export const resetSort = () => {
    document.getElementById("sort-select").selectedIndex = 0;
}
