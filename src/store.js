

const addBookmark = function(bookmark) {
  bookmark.expanded = false;
  bookmark.editing = false;
 storeList.bookmarks.push(bookmark);
}
const deleteBookmark = function (id) {
  storeList.bookmarks = storeList.bookmarks.filter( (bookmark) => bookmark.id !== id)
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
             deleteBookmark
             
          }