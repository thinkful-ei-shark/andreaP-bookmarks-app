import $ from 'jquery';
import './style.css'
import store from './store';
import bookmarkelement from './bookmark'
import api from './api'


// Start Page Template Here: 


  //api.fetchBookmarks()
 
  


 
function main() {
  api.fetchBookmarks();
  bookmarkelement.bookmarksList(store.storeList.bookmarks);
  bookmarkelement.handleFilterBookmarks();
  bookmarkelement.handleEditSubmit();
  bookmarkelement.handleCancelEdit();
  bookmarkelement.handleCancelSubmit();
  bookmarkelement.handleDeleteButton();
  bookmarkelement.handleToggleAddForm();
  bookmarkelement.handleExpand();
  bookmarkelement.handleCollapse();
  bookmarkelement.handleAddFormSubmit();
  bookmarkelement.handleEditButton();
  bookmarkelement.render();
}  
$(main);