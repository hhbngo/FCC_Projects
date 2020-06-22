export default class Studio {
    constructor() {
    }

    async getMovies() {
        const movieInfo = await fetchApiData('https://ghibliapi.herokuapp.com/films');
        const movieCovers = await fetchApiData('https://gist.githubusercontent.com/hhbngo/c808284f5092d47499605219b4cf94d4/raw/db4ab827d85053e0c1769430b9a7913509d01487/movieCover.json');
        movieInfo.forEach(movie => {
            movie.coverURL = movieCovers.find(obj => Object.keys(obj) == movie.title)[movie.title]
        });
        this.movieList = movieInfo;
        this.tempList = movieInfo;
    }

    getSelected(id) {
        return this.movieList.find(movie => movie.id == id);
    }

    filterMovies(str) {
        this.tempList = this.movieList.filter(movie => movie.title.toLowerCase().includes(str));
    }

    resetList() {
        this.tempList = this.movieList;
    }

    sortMovies(type) {
        switch (type) {
            case "1":
                this.tempList.sort((a, b) => {
                    return (a.title > b.title) ? 1 : -1
                });
                break;
            case "2":
                this.tempList.sort((a, b) => {
                    return (a.title < b.title) ? 1 : -1
                });
                break;
            case "3":
                this.tempList.sort((a, b) => {
                    return (parseInt(a.rt_score.replace('%', "")) < parseInt(b.rt_score.replace('%', ""))) ? 1 : -1
                });
                break;
            case "4":
                this.tempList.sort((a, b) => {
                    return (a.rt_score.replace(/^\d+$/g, "") > b.rt_score.replace(/^\d+$/g, "")) ? 1 : -1
                });
                break;
            case "5":
                this.tempList.sort((a, b) => {
                    return (parseInt(a.release_date) < parseInt(b.release_date)) ? 1 : -1
                });
                break;
            case "6":
                this.tempList.sort((a, b) => {
                    return (parseInt(a.release_date) > parseInt(b.release_date)) ? 1 : -1
                });
        }
    }
}

const fetchApiData = async (link) => {
    try {
        const response = await fetch(link);
        const movies = await response.json();
        return movies;
    } catch (error) {
        console.log('Server error please reload the page.');
    }
}