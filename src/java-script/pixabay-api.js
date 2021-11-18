import axios from "axios";

export default class ApiPixabay {
constructor(){
    this.searchQuery = '';
    this.page = 1;
    this.totalHits = 0;
    
}

fetchImages(){
    const URL_DEFAULT = 'https://pixabay.com/api/';
   const API_KEY = '24343204-c81a45d0777a603181c59324d';
const URL = URL_DEFAULT+"?key="+API_KEY+"&q="+
encodeURIComponent(this.searchQuery)+
"&image_type=photo&orientation=horizontal&safesearch=true&page="+
this.page+"&per_page=40";

return axios.get(URL)
.then(response => { 
      if (response.data.hits.length===0) {      
          throw new Error(response.status);
        }
        this.totalHits = response.data.totalHits;
      return response.data.hits;
    })
}

nextPage(){
    this.page +=1;
}

resetPage(){
  this.page = 1; 
} 

get query(){
    return this.searchQuery;
}

set query(newQuery){
    this.searchQuery = newQuery;
}
}