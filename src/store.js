import api from './api'

const addBookmark = function(bookmark) {
  bookmark.expanded = false;
  bookmark.editing = false;
 storeList.bookmarks.push(bookmark);
}

const storeList = {
    bookmarks: [],
    adding: false,
    error: null,
    filter: 0
  };


    export default {
             storeList,
             addBookmark,
             
          }