import $ from 'jquery';
import store from './store'
const BASE_URL = 'https://thinkful-list-api.herokuapp.com/andreaP';

const fetchApi = function(...args){
    let error = null;
    return fetch(...args)
      .then(res => {
        if(!res.ok){
          error = {code: res.status};
        }  
        return res.json();
      })
      .then(data => {
        if(error) {
          error.message = data.message;
          return Promise.reject(error);
        }  
        return data;
        
      });
  };

const fetchBookmarks = function(){
   return fetchApi(`${BASE_URL}/bookmarks`)
   .then(items => {
     items.forEach(item => {
     store.addBookmark(item);    
     }) 
   })
   };
  
  const addNewBookmark = function(title, url, desc, rating) {
    const newBookmark = JSON.stringify(
        {
            title: title,
            url: url,
            desc: desc,
            rating: rating
        });
    return fetchApi(`${BASE_URL}/bookmarks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: newBookmark
    });
};
  
  const deleteBookmark = function(id){
    return fetchApi(`${BASE_URL}/bookmarks/${id}`, {
      method: 'DELETE',
    });
  };

  const editBookmark = function(id, newData){
    const editedBookmark = JSON.stringify(newData);
    return fetchApi(`${BASE_URL}/bookmarks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
      },
      body: editedBookmark
    });
  };
  
  
 
  
  export default {
    fetchApi,
    deleteBookmark,
    editBookmark,
    addNewBookmark,
    fetchBookmarks,
  }