export const renderInfo = (movie, isLiked) => {
    const markup = `
        <section class="info">
            <div class="info__card" id="${movie.id}">
                <i class="far fa-times-circle info__close-btn"></i>
                <div class="info__heart-btn">
                    <i class="fas fa-heart${isLiked ? ' liked ' : ' '}like-heart"></i>
                </div>
                <div class="info__inner-wrapper">
                    <div class="info__box--1">
                        <div class="info__img" style="background-image: url(${movie.coverURL})"></div>
                    </div>
                    <div class="info__title info__box--2">
                        <h2>${movie.title}</h2>
                    </div>
                    <div class="info__box--3">
                        <p style="border-top: 2px solid black; border-bottom: 2px solid black; padding: 2rem 0">${movie.description}</p>
                        <p>Director: ${movie.director}</p>
                        <p>Producer: ${movie.producer}</p>
                        <p>Release: ${movie.release_date}</p>
                        <p>Score: ${movie.rt_score}%</p>
                    </div>
                </div>
            </div>
        </section>
    `;
    document.body.insertAdjacentHTML('afterbegin', markup);
}

export const clearPrevious = () => {
    const info = document.querySelector('.info');
    if (info) deleteInfo();
}

export const deleteInfo = () => {
    document.querySelector('.info').remove();
}