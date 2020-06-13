export const sortShowcase = (selectValue, movieList) => {
    let sortedList;
    switch (selectValue) {
        case "1":
            sortedList = movieList.sort((a, b) => {
                return (a.title > b.title) ? 1 : -1
            });
            break;
        case "2":
            sortedList = movieList.sort((a, b) => {
                return (a.title < b.title) ? 1 : -1
            });
            break;
        case "3":
            sortedList = movieList.sort((a, b) => {
                return (parseInt(a.rt_score.replace('%', "")) > parseInt(b.rt_score.replace('%', ""))) ? 1 : -1
            });
            break;
        case "4":
            sortedList = movieList.sort((a, b) => {
                return (a.rt_score.replace(/^\d+$/g, "") < b.rt_score.replace(/^\d+$/g, "")) ? 1 : -1
            });
            break;
        case "5":
            sortedList = movieList.sort((a, b) => {
                return (parseInt(a.release_date) < parseInt(b.release_date)) ? 1 : -1
            });
            break;
        case "6":
            sortedList = movieList.sort((a, b) => {
                return (parseInt(a.release_date) > parseInt(b.release_date)) ? 1 : -1
            });
    }
    sortedList.forEach(movie => renderSortedMovies(movie));
    return sortedList;
}

const renderSortedMovies = (movie) => {
    let markup = `
    <a href="#${movie.id}">
        <div class="showcase__movie-card" style="background-image: url(${movie.coverURL})" data-name="${movie.title}">
        </div>
    </a>
    `;

    document.querySelector('.showcase').insertAdjacentHTML('beforeend', markup);
} 