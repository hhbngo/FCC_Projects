export const renderLikes = movie => {
    const markup = `
        <div class="liked-card" data-id="${movie.id}">
            <a href="#${movie.id}">
                <div class="liked-card__img"
                style="background-image: url(${movie.coverURL});">
                </div>
                <div class="liked-card__title">${movie.title}</div>
            </a>
        </div>
    `;
    document.querySelector('.liked-card-box').insertAdjacentHTML('beforeend', markup);
}

export const toggleLikedMenu = (likeList) => {
    const likeBox = document.querySelector('.portal__like-box');
    if (likeList.length >= 1) {
        likeBox.style.opacity = 1;
        likeBox.style.pointerEvents = "all";
    } else {
        likeBox.style.opacity = 0;
        likeBox.style.pointerEvents = "none";
    }
}

export const clearLikes = () => {
    document.querySelector('.liked-card-box').innerHTML = "";
}

export const toggleLikedWindow = () => {
    document.querySelector('.fa-heart').classList.toggle('active1');
    document.querySelector('.portal__like-window').classList.toggle('portal__like-window--active');
}
