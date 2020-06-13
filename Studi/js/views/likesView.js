export const renderLikes = movie => {
    const markup = `
        <div class="liked-card">
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

export const addLikedMenu = () => {
    const markup = `
    <div class="portal__like-box">
        <div class="heart-container">
            <i class="far fa-heart fa-heart-outline"></i>
        </div>
        <div class="portal__like-window">
            <div class="portal__like-title">
                Liked Movies
            </div>
            <div class="portal__like-close-btn">
                <i class="fas fa-times-circle close-window-btn"></i>
            </div>
            <div class="liked-card-box">
            </div>
        </div>
    </div>
    </div>
    `;

    if (!document.querySelector('.portal__like-box')) {
        document.querySelector('.portal__nav').insertAdjacentHTML('beforeend', markup);
    }
}