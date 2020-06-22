import * as GetStudio from './models/GetStudio.js';
import * as showcaseView from './views/showcaseView.js';
import * as infoView from './views/infoView.js';
import * as likesView from './views/likesView.js';
import * as sortView from './views/sortView.js';


let fullMovieList = [];
let tempMovieList = [];
let likedList = [];

const getLikedStorage = () => {
    const storage = JSON.parse(localStorage.getItem('likes'));
    if (storage) likedList = storage;
}

const persistLikeData = () => {
    localStorage.setItem('likes', JSON.stringify(likedList));
}

// CONTROLLERS
const controlInfo = () => {
    const id = window.location.hash.replace('#', '');
    if (id !== "") {
        if (document.querySelector('.info')) {
            infoView.deleteInfo();
        };
        const selectedMovie = fullMovieList.find(movie => movie.id == id);
        const isLiked = likedList.some(id => id == selectedMovie.id);
        infoView.renderInfo(selectedMovie, isLiked);
    } else if (id == "") {
        if (document.querySelector('.info')) {
            infoView.deleteInfo();
        };
    }
}

const controlLike = (e) => {
    const likeID = e.parentNode.parentNode.id
    if (e.classList.contains('liked')) {
        e.classList.remove('liked');
        const idIndex = likedList.findIndex(id => id == likeID)
        likedList.splice(idIndex, 1);
        persistLikeData();
        const currentLikes = likedList.map(likedID => { return fullMovieList.find(movie => movie.id == likedID) });
        document.querySelector('.liked-card-box').innerHTML = "";
        currentLikes.forEach(movie => likesView.renderLikes(movie));
    } else if (!e.classList.contains('.liked')) {
        e.classList.add('liked');
        likedList.push(likeID);
        persistLikeData();
        const currentLikes = likedList.map(likedID => { return fullMovieList.find(movie => movie.id == likedID) });
        document.querySelector('.liked-card-box').innerHTML = "";
        currentLikes.forEach(movie => likesView.renderLikes(movie));
    };

}

// EVENTLISTENERS

window.addEventListener('hashchange', controlInfo);

document.getElementById('search').addEventListener('keyup', e => {
    const searchString = e.target.value.toLowerCase();
    const searchMatches = fullMovieList.filter(movie => movie.title.toLowerCase().includes(searchString));
    tempMovieList = searchMatches;
    showcaseView.clearMovieCovers();
    searchMatches.forEach(movie => {
        showcaseView.renderMovieCover(movie);
    });
    showcaseView.renderPhantomCovers();
})

document.querySelector('.portal__search').addEventListener('click', function () {
    document.querySelector('.search-label').style.opacity = 1;
    document.getElementById('search').style.display = "block";
    document.getElementById('search').focus();
    document.querySelector('.portal__search').style.pointerEvents = "none";
});

document.getElementById('search').addEventListener('focusout', function () {
    document.querySelector('.search-label').style.opacity = 0;
    document.getElementById('search').style.display = "none";
    document.querySelector('.se').value = "";
    if (tempMovieList.length === 0) {
        showcaseView.clearMovieCovers();
        fullMovieList.forEach(movie => showcaseView.renderMovieCover(movie));
        tempMovieList = fullMovieList;
    };
    document.querySelector('.portal__search').style.pointerEvents = "all";
});

document.querySelector('.heart-container').addEventListener('click', function () {
    document.querySelector('.fa-heart').classList.toggle('active1');
    document.querySelector('.portal__like-window').classList.toggle('portal__like-window--active');
});

document.querySelector('.close-window-btn').addEventListener('click', function () {
    document.querySelector('.fa-heart').classList.toggle('active1');
    document.querySelector('.portal__like-window').classList.toggle('portal__like-window--active');
});

document.body.addEventListener('click', e => {
    if (e.target.classList.contains('info__close-btn')) {
        infoView.deleteInfo();
        history.pushState("", document.title, window.location.pathname);
    } else if (e.target.classList.contains('like-heart')) {
        controlLike(e.target);
    };
});

document.getElementById("sort-select").addEventListener('change', e => {
    showcaseView.clearMovieCovers();
    tempMovieList = sortView.sortShowcase(e.target.value, tempMovieList);
    showcaseView.renderPhantomCovers();
});

document.querySelector('.logo-box').addEventListener('click', function () {
    location.reload();
})

GetStudio.getMovies()
    .then(data => {
        data.forEach(movie => {
            showcaseView.renderMovieCover(movie);
        })
        showcaseView.renderPhantomCovers();
        fullMovieList = data;
        tempMovieList = data;
        getLikedStorage();
        const currentLikes = likedList.map(likedID => {
            return fullMovieList.find(movie => movie.id == likedID)
        });
        document.querySelector('.liked-card-box').innerHTML = "";
        currentLikes.forEach(movie => likesView.renderLikes(movie));
    });
