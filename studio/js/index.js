import Studio from './models/Studio.js';
import Like from './models/Like.js';
import * as showcaseView from './views/showcaseView.js';
import * as likeView from './views/likeView.js';
import * as infoView from './views/infoView.js'
import * as searchView from './views/searchView.js';


const state = {};

// CONTROLLERS
const controlGetStudio = async () => {
    state.studio = new Studio();
    state.likes = new Like();
    state.likes.getLikedStorage();
    await state.studio.getMovies();
    controlLikeRend();
    showcaseView.renderMovies(state.studio.movieList);
    showcaseView.renderPhantomCovers();
}

const controlInfo = () => {
    const id = window.location.hash.replace('#', '');
    infoView.clearPrevious();
    if (id !== "") {
        const selectedMovie = state.studio.getSelected(id);
        const isLiked = state.likes.likeCheck(id, selectedMovie);
        infoView.renderInfo(selectedMovie, isLiked);
    }
}

const controlInfoClick = (target) => {
    if (target.classList.contains('info__close-btn')) {
        infoView.deleteInfo();
        history.pushState("", document.title, window.location.pathname);
    } else if (target.classList.contains('like-heart')) {
        controlLike(target);
    };
}

const controlLike = (e) => {
    const likeID = e.parentNode.parentNode.id
    const likedStatus = e.classList.contains('liked');
    if (likedStatus) state.likes.removeLike(likeID, e);
    else if (!likedStatus) state.likes.addLike(likeID, e);
    controlLikeRend();
}

const controlLikeRend = () => {
    likeView.toggleLikedMenu(state.likes.likedList);
    const currentLikes = state.likes.getLikedMoviesInfo(state.studio.movieList);
    likeView.clearLikes();
    currentLikes.forEach(movie => likeView.renderLikes(movie));
}

const controlSearch = (str) => {
    state.studio.filterMovies(str.toLowerCase());
    showcaseView.clearMovieCovers();
    showcaseView.renderMovies(state.studio.tempList);
    showcaseView.renderPhantomCovers();
}

const controlFocusOut = () => {
    searchView.focusOut();
    if (state.studio.tempList.length == 0) {
        showcaseView.clearMovieCovers();
        state.studio.resetList();
        showcaseView.renderMovies(state.studio.movieList);
        showcaseView.renderPhantomCovers();
        showcaseView.resetSort();
    };
}

const controlSort = (n) => {
    showcaseView.clearMovieCovers();
    state.studio.sortMovies(n);
    showcaseView.renderMovies(state.studio.tempList);
    showcaseView.renderPhantomCovers();
}

// EVENTLISTENERS
window.addEventListener('load', controlGetStudio);

window.addEventListener('hashchange', controlInfo);

document.querySelector('.portal__search').addEventListener('click', searchView.focusSearch);

document.getElementById('search').addEventListener('input', e => controlSearch(e.target.value));

document.getElementById('search').addEventListener('focusout', controlFocusOut);

document.getElementById("sort-select").addEventListener('change', e => controlSort(e.target.value));

[document.querySelector('.heart-container'), document.querySelector('.close-window-btn')].forEach(el => {
    el.addEventListener('click', likeView.toggleLikedWindow);
});

document.body.addEventListener('click', e => controlInfoClick(e.target));

document.querySelector('.logo-box').addEventListener('click', function () {
    location.reload();
});
