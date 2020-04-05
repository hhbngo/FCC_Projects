function onClickMenu() {
  document.getElementById("menu").classList.toggle("change");
  document.getElementById("ham-nav").classList.toggle("change");
}

$('body').hasClass('no-touch') ? event = 'mouseenter mouseleave' : event = 'click';
