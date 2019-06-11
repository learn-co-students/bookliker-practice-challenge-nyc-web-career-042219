document.addEventListener("DOMContentLoaded", function() {

    //fetch books from API
    let bookList = [] //empty array to contain list of book objects
    
    //grab where you want to display the books
    let bookNode = document.querySelector('#list')

    //make the initial fetch request
    fetch ('http://localhost:3000/books') 
        .then(function(response) {
            return response.json();
          })
        .then(function(object) {
            console.log(JSON.stringify(object));
            bookList = object
            let mappedBookList = bookList.map(book => displayBookTitle(book)).join("")
            bookNode.innerHTML = mappedBookList
        });

    //render HTML for book display
    function displayBookTitle(book) {
        return `
            <li id="book" data-id="${book.id}">Book Title: ${book.title}</li>
        `
    }

    //grab the area you want to show the book deets
    bookDisplay = document.querySelector('#show-panel')
    //add an event listener to your list of books
    bookNode.addEventListener('click', (event) => {
        //find the book you're selecting
        if (event.target = 'li') {
            let selectedBook = bookList.find(function(book) {
                return parseInt(event.target.dataset.id) === book.id;
            });
            bookDisplay.innerHTML = displayBookDeets(selectedBook)
        }
    })

    //helper function to display the book deets
    function displayBookDeets(book) {
        return `
        <img src="${book.img_url}">
        <p>${book.description}</p>
        ${displayUsers(book)}
        <button id="button" data-id="${book.id}" >I read this book, yo</button>
        `
    }

    // helper function to create list of users who liked a book
    function displayUsers(book) {
       return usersList = book.users.map(user => `<ul><li>${user.username}</li></ul>`).join("")
    }

    //add event listener to the button
    let readBook = document.querySelector('#button')
    document.addEventListener('click', (event) => {
        if (event.target && event.target.id === 'button') {
            let newSelectedBook = bookList.find(function(book) {
                return parseInt(event.target.dataset.id) === book.id;
            });
        newSelectedBook.users.push({"id":1, "username":"pouros"})
        
        fetch(`http://localhost:3000/books/${newSelectedBook.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                users: newSelectedBook.users
            })
        })
        .then(response => response.json())
        .then(object => {newSelectedBook.users = object.users
            bookDisplay.innerHTML = displayBookDeets(newSelectedBook)
        })
    }})

    //helper function to find book
 


});