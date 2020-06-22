export default class Like {
    constructor() {
        this.likedList = [];
    }

    addLike(likeID, heartNode) {
        heartNode.classList.add('liked');
        this.likedList.push(likeID);
        this.persistLiked();
    }

    removeLike(likeID, heartNode) {
        heartNode.classList.remove('liked')
        this.likedList.splice(this.likedList.findIndex(id => id == likeID), 1);
        this.persistLiked();
    }

    getLikedStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        if (storage) this.likedList = storage;
    }

    persistLiked() {
        localStorage.setItem('likes', JSON.stringify(this.likedList));
    }

    getLikedMoviesInfo(fullMovieList) {
        return this.likedList.map(id => {
            return fullMovieList.find(movie => movie.id == id)
        });
    }

    likeCheck(id, selectedMovie) {
        return this.likedList.some(id => id == selectedMovie.id);
    }
}