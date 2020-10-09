
//Import statements
import $ from 'jquery';
import storeItem from './store';
import api from './api';

console.log(storeItem)
const store = storeItem.storeList;


const render = function () {
  
      console.log('page has been rendered')
    const startTemplate = `
      <div class ="title"><h3>Current Bookmarks</h3></div>`
      
      let filterArea = `
      <div class="filter-bookmarks">
      <h4>Filter Results By Rating:</h4>
        <select id="filter-select">
          <option disabled selected hidden>Filter by</option>
          <option value=5>Show 5 Stars</option>
          <option value=4>Show 4+ Stars</option>
          <option value=3>Show 3+ Stars</option>
          <option value=2>Show 2+ Stars</option>
          <option value=1>Show 1+ Stars</option>
          <option value=0>Show All</option>
        </select>
      </div>`
    console.log(store)
    let formTemplate = `<button name="add-new-bookmark-btn" id="add-new-bookmark-btn">+ Add New</button>`;  
    if (store.adding === true ) {
        formTemplate = addNewBookMarkForm();    
    }
   const pageLoad = startTemplate + formTemplate + filterArea + bookmarksList(store.bookmarks);
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
                <p class="description">${bookmark.desc}</p>
                <h3 class="rating">Rating: ${bookmark.rating} Stars </h3>
                <div class="visit-site">
                  <a href="${bookmark.url}">Visit Site</a>
                </div>
                <div class="bookmark-controls">
                  <button class="collapse-button" type="button">Collapse</button>
                  <button class="delete-button" type="button" id= "delete">Delete</button>
                   </div>
              </li>`;
                } 
              if (bookmark.editing === true) {
                   return `
                   <li data-item-id="${bookmark.id}" class="bookmark-item">
               <form name="edit-form" class="edit-form" id ="edit-form" >
              <label for="add-bookmark-url" class="add-new">Current URL: ${bookmark.url} New URL: </label>                 
              <input type="text" name="add-bookmark-url" id="new-bookmark-url" placeholder= "${bookmark.url}" />
              <label for="add-bookmark-name" class="add-new">Current Name: ${bookmark.title} New Title: </label>
              <input type="text" name="add-bookmark-name" id="new-bookmark-name" placeholder="${bookmark.title}" />
              <label for="add-bookmark-description" class="add-new">Current Description: ${bookmark.desc} New Description: </label>
              <input type="textarea" name="add-bookmark-description" id="new-bookmark-description" placeholder="${bookmark.desc}">
              <div class="add-new rating">
              <label for "add-bookmark-rating" name="bookmark-rating" class="stars"> Current Rating: ${bookmark.rating} New Rating:</label>
              <input type="number" name="rating" size="3" min="1" max="5" id="new-rating">
              </div>
              <button type="submit" name="edit-item" id="edit-item" class="submit">Submit</button>
              <button type="submit" name="cancel-submit" id="cancel-edit" class="submit">Cancel</button>
              </form>`    
             }
               if (bookmark.rating >= store.filter) {
                    return `
               <section> <li data-item-id="${bookmark.id}" class="bookmark-item">
                <h2 class="bookmark-name">${bookmark.title}</h2>
                <h3 class="rating">Rating: ${bookmark.rating} Stars</h3>
                <div class="bookmark-controls">
                  <button class="expand-button" type="button">Expand</button>
                  <button class="edit-button" id="edit-button" type="button">Edit Bookmark</button>
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
      <input type="text" name="add-bookmark-url" id="add-bookmark-url" placeholder="https://samplelink.code" required />
      <label for="add-bookmark-name" class="add-new">Bookmark Name:</label>
      <input type="text" name="add-bookmark-name" id="add-bookmark-name" placeholder="Link name" required />
      <p><label for="add-bookmark-description" class="add-new">Description</label>
      <input type="textarea" name="add-bookmark-description" id="add-bookmark-description" placeholder="Describe your link" required /></p>
        <div class="add-new rating">
        <label for "add-bookmark-rating" name="bookmark-rating" class="stars">Enter Rating (1 - 5)</label>
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
        const title = $('#add-bookmark-name').val();
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
     const handleEditButton = function() {
        $('main').on('click', '.edit-button', function (event) {
        const id = getBookmarkIdFromElement(event.currentTarget);
        const bookmark = store.bookmarks.find(bookmark => bookmark.id === id);
        bookmark.editing = true;
             console.log(id + ' edit button')
                 render();       
        });
     }

     const handleEditSubmit = function() {
        $('main').on('submit', '#edit-form', event => {
            event.preventDefault();
            const id = getBookmarkIdFromElement(event.currentTarget);
               const title = $('#new-bookmark-name').val();
                const url = $('#new-bookmark-url').val();
              const desc = $('#new-bookmark-description').val();
               const rating = $('#new-rating').val();
                const newData = {title:`${title}`, url:`${url}`, desc:`${desc}`, rating:`${rating}`}
                console.log(newData)
                api.editBookmark(id, newData)
                .then(newData => {                
                const bookmark = store.bookmarks.find(bookmark => bookmark.id === id);
                    bookmark.editing = false; 
                    render();
                   });
                  })
     }
     const handleCancelEdit = function() {
        $('main').on('click', '#cancel-edit', event => {
         const id = getBookmarkIdFromElement(event.currentTarget);
            const bookmark = store.bookmarks.find(bookmark => bookmark.id === id);
            bookmark.editing = false;
            render();  
        })          
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
        handleCancelEdit,
        handleEditSubmit,
        handleCancelSubmit,
       handleDeleteButton,
        handleAddFormSubmit,
        addNewBookMarkForm,
        handleToggleAddForm,
        handleExpand,
        handleCollapse,
        handleEditButton,
        render
      };

