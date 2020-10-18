
//Import statements
import $ from 'jquery';
import storeItem from './store';
import api from './api';

console.log(storeItem)
const store = storeItem.storeList;

const startTemplate = function() {
  return `
  <div class ="title"><h3>Current Bookmarks:</h3></div>`
}
const filterArea = function () {
  return `<div class="filter-bookmarks">
<label for ="filter-select"><h4>Filter Results by Rating:</h4></label> 
<select id="filter-select">
    <option disabled selected hidden>Show All</option>
    <option value=5>Show 5 Stars</option>
    <option value=4>Show 4+ Stars</option>
    <option value=3>Show 3+ Stars</option>
    <option value=2>Show 2+ Stars</option>
    <option value=1>Show 1+ Stars</option>
    <option value=0>Show All</option>
  </select>
</div>`} 

const render = function () {

    console.log(store)
    let formTemplate = `<button name="add-new-bookmark-btn" id="add-new-bookmark-btn">+ Add New</button>`;  
    if (store.adding === true ) {
        formTemplate = addNewBookMarkForm();    
    }
   const pageLoad = filterArea() + startTemplate() + formTemplate + bookmarksList(store.bookmarks);
   $('main').html(pageLoad);
  };


      const bookmarksList = function (bookmark) {
        console.log("line 46 bookmarks", bookmark)
             let allBookmarks = ''
        for (let i = 0; i < bookmark.length; i++) {
            allBookmarks += itemDisplayView(bookmark[i]);
        }  
        return allBookmarks;
    }
    
    //create a function that shows collapsed  view of list
        function itemDisplayView (bookmark) {  
                if (bookmark.expanded === true) {
                    return `
              <li data-item-id="${bookmark.id}" class="bookmark-item expanded">
                <h2 class="bookmark-name">${bookmark.title}</h2>
                <h3 class="rating">Rating: ${bookmark.rating} Stars </h3>
                <h4 class="description">Description: ${bookmark.desc}</h4>                
                <div class="visit-site">
                  <h4><a href="${bookmark.url}">Visit Site</a></h4>
                </div>
                <div class="bookmark-controls">
                  <button class="collapse-button" type="button">Collapse</button>
                  <button class="delete-button" type="button" id= "delete">Delete</button>
                   </div>
              </li>`;
                } 
               if (bookmark.rating >= store.filter) {
                    return `
               <section class="bookmark-list"> <li data-item-id="${bookmark.id}" class="bookmark-item">
                <h2 class="bookmark-name">${bookmark.title}</h2>
                <h4 class="rating">Rating: ${bookmark.rating} Stars</h4>
                <div class="bookmark-controls">
                  <button class="expand-button" type="button">Expand</button>
                  <button class="delete-button" type="button">Delete</button>
                </div>
              </li></section>`; 
                } else {
                  return ''
                }
            
}
    function getBookmarkIdFromElement(bookmark) {
          return $(bookmark).closest('li').data('item-id');
    };

    const handleExpand = function() {
        $('main').on('click', '.expand-button', function (event) {
        const id = getBookmarkIdFromElement(event.currentTarget);
            const bookmark = store.bookmarks.find(bookmark => bookmark.id === id);
            bookmark.expanded = true;
            console.log(bookmark.expanded + 'bookmark expanded')
            render();            
     });
    }
    const handleCollapse = function() {
        $('main').on('click', '.collapse-button', function (event) {
        const id = getBookmarkIdFromElement(event.currentTarget);
            const bookmark = store.bookmarks.find(bookmark => bookmark.id === id);
            bookmark.expanded = false;
            console.log(bookmark.expanded + 'bookmark collapsed')
            render();            
     });
    }
  

function handleToggleAddForm() {
     $('main').on('click', '#add-new-bookmark-btn', function (event) {
               console.log('add new button clicked');
            store.adding = true;
            render()
         });

}
    const addNewBookMarkForm = function() {
       const newBookMarkForm = `<form name="form" id ="submit-new-form">
      <label for="add-bookmark-url" class="add-new">Bookmark URL:</label>
      <input type="text" name="new-bookmark-url" id="add-bookmark-url" placeholder="https://samplelink.code" required />
      <label for="add-bookmark" class="add-new">Bookmark Name:</label>
      <input type="text" name="add-bookmark-name" id="add-bookmark" placeholder="Link name" required />
      <p><label for="add-bookmark-description">Description:</label>
      <input type="textarea" name="bookmark-description" id="add-bookmark-description" placeholder="Describe your link" required /></p>
        <div class="add-new rating">
        <label for "add-rating" name="bookmark-rating" class="stars">Enter Rating (1 - 5)</label>
        <input type="number" size="3" min="1" max="5" name="rating" id="add-rating" required>
       </div>
      <button type="submit" name="submit-new" id="submit-new" class="submit-new">Submit</button>
      <button type="button" name="cancel-submit" id="cancel-submit" class="cancel-submit">Cancel</button>
    </form>`    
    return newBookMarkForm;
}


const handleAddFormSubmit = function() {
    $('main').on('submit', '#submit-new-form', function (event) {
        event.preventDefault();
        const title = $('#add-bookmark').val();
        const url = $('#add-bookmark-url').val();
        const desc = $('#add-bookmark-description').val();
        const rating = $('#add-rating').val();
        api.addNewBookmark(title, url, desc, rating)
          .then(newBookmark => {
            storeItem.addBookmark(newBookmark); 
            store.adding = false;
            render();
          })
      })
       };

     const handleCancelSubmit = function() {
        $('main').on('click', '.cancel-submit', event => {
                 store.adding = false; 
                 render();  
                })     
        }

     const handleDeleteButton = function() {
        $('main').on('click', '.delete-button', function (event) {
        const id = getBookmarkIdFromElement(event.currentTarget);
                 api.deleteBookmark(id).then( () => {
                   storeItem.deleteBookmark(id)
                   render()
                 });
                  console.log(id + ' delete button');
                           
        });
     }

     
    
 const handleFilterBookmarks = function () {
     $('main').on('change', '#filter-select', event => {
        console.log('sort click')
        store.filter = $(event.target).val();
        render();
          });
   };

  
function initialize () {
  api.fetchBookmarks() .then( () => render() )
  render();
}
   
   $(function() {
    console.log('app loading');
   
});


    export default {
      initialize,
        bookmarksList,
        handleFilterBookmarks,
        handleCancelSubmit,
       handleDeleteButton,
        handleAddFormSubmit,
        addNewBookMarkForm,
        handleToggleAddForm,
        handleExpand,
        handleCollapse,
        render
      };

