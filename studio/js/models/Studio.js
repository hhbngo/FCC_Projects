export default class Studio {
    constructor() {
    }

    async getMovies() {
        const movieInfo = await fetchApiData('https://ghibliapi.herokuapp.com/films');
        const movieCovers = await fetchApiData('https://gist.githubusercontent.com/hhbngo/c808284f5092d47499605219b4cf94d4/raw/e25a488c9724ab929581c8213ae320bc40aa6bd9/movieCover.json');
        movieInfo.forEach(movie => {
            movie.coverURL = movieCovers.find(obj => Object.keys(obj) == movie.title)[movie.title]
        });
        this.movieList = movieInfo;
        this.tempList = JSON.parse(JSON.stringify(movieInfo));
    }

    getSelected(id) {
        return this.movieList.find(movie => movie.id == id);
    }

    filterMovies(str) {
        const filteredList = this.movieList.filter(movie => movie.title.toLowerCase().includes(str));
        this.tempList = filteredList;
    }

    resetList() {
        this.tempList = JSON.parse(JSON.stringify(this.movieList));
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
                    return (parseInt(a.rt_score.replace('%', "")) > parseInt(b.rt_score.replace('%', ""))) ? 1 : -1
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
