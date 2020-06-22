export const focusSearch = () => {
    document.querySelector('.search-label').style.opacity = 1;
    document.getElementById('search').style.display = "block";
    document.getElementById('search').focus();
    document.querySelector('.portal__search').style.pointerEvents = "none";
}

export const focusOut = () => {
    document.querySelector('.search-label').style.opacity = 0;
    document.getElementById('search').style.display = "none";
    document.querySelector('.se').value = "";
    document.querySelector('.portal__search').style.pointerEvents = "all";
}
