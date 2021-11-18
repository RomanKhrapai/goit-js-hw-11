import './sass/main.scss';
import "simplelightbox/dist/simple-lightbox.min.css";
import imagesTpl from "./templates/images.hbs"
import ApiPixabay from './java-script/pixabay-api';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import throttle from 'lodash/throttle';

const refs ={
  searchForm : document.querySelector('#search-form'),
  loadMoreBtn: document.querySelector('button.load-more'),
  gallery: document.querySelector("div.gallery")
}

const apiPixabay = new ApiPixabay();
let onLoadScroll = false;

refs.searchForm.addEventListener('submit',startSearch);
 window.addEventListener("scroll",throttle(infiniteScroll,300));

function startSearch(e){
  e.preventDefault();
  clearGallery()
  apiPixabay.query = e.target.elements.searchQuery.value;
  apiPixabay.resetPage();
  apiPixabay.fetchImages()
  .then((hits)=>{
    includeHits()
    return hits 
  })
  .then(appendImages)
  .catch(searchError); 
}

function includeHits(){
  Notiflix.Notify.success(`Hooray! We found ${apiPixabay.totalHits} images.`);
  if(apiPixabay.totalHits>40){
   onLoadScroll = true; 
  }
}

function searchError(error){
  if(error.toString()==='Error: 200'){
    return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
   }
   console.log(error);
}

function onLoadMore(){
  apiPixabay.nextPage();
  apiPixabay.fetchImages()
  .then(appendImages)
  .catch(searchError);
  if(apiPixabay.totalHits<40*(apiPixabay.page+1)){
    lastRequest();
  }
}

function lastRequest(){
  onLoadScroll = false;
  Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
}

function appendImages(images){
  refs.gallery.insertAdjacentHTML('beforeend',imagesTpl(images));
  addGalery();
}

function clearGallery() {
  refs.gallery.innerHTML = "";
}

function addGalery(){
  let gallery = new SimpleLightbox('.gallery a',{captionDelay:250,captionsData:'alt'});
}

function infiniteScroll(){ 
  if(onLoadScroll) {   
    if(window.pageYOffset + window.innerHeight *2 >= refs.gallery.offsetHeight)
      {
      onLoadMore();
      }
  } 
}


