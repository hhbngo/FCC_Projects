import * as GetStudio from './models/GetStudio.js';
import * as showcaseView from './views/showcaseView.js';

let fullMovieList = [];
let tempMovieList = [];

GetStudio.getMovies()
    .then(data => {
        data.forEach(movie => {
            showcaseView.renderMovieCover(movie);
        })
        showcaseView.renderPhantomCovers();
        fullMovieList = data;
    });


document.getElementById('search').addEventListener('keyup', e => {
    const searchString = e.target.value.toLowerCase();

    const searchMatches = fullMovieList.filter(movie => movie.title.toLowerCase().includes(searchString));
    tempMovieList = searchMatches;
    showcaseView.clearMovieCovers();
    searchMatches.forEach(movie => {
        showcaseView.renderMovieCover(movie);
    })
    showcaseView.renderPhantomCovers();
})



document.querySelector('.portal__search').addEventListener('click', function () {
    document.querySelector('.search-label').style.opacity = 1;
    document.getElementById('search').style.display = "block";
    document.getElementById('search').focus();
}
);

document.getElementById('search').addEventListener('focusout', function () {
    document.querySelector('.search-label').style.opacity = 0;
    document.getElementById('search').style.display = "none";
    document.querySelector('.se').value = "";
    if (tempMovieList.length === 0) {
        showcaseView.clearMovieCovers();
        fullMovieList.forEach(movie => showcaseView.renderMovieCover(movie));
    };
});

document.querySelector('.heart-container').addEventListener('click', function () {
    document.querySelector('.fa-heart').classList.toggle('active1');
    document.querySelector('.portal__like-window').classList.toggle('portal__like-window--active');
});

document.querySelector('.close-window-btn').addEventListener('click', function () {
    document.querySelector('.fa-heart').classList.toggle('active1');
    document.querySelector('.portal__like-window').classList.toggle('portal__like-window--active');
});
