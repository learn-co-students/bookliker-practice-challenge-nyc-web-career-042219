const BOOKS_URL = 'http://localhost:3000/books/';
let BOOKS_ARRAY = [];

document.addEventListener("DOMContentLoaded", function() {
    const body = document.querySelector('body');
    const bookList = document.getElementById('list');
    fetchBooks(bookList);

    body.addEventListener('click', function(e) {
        if (e.target.tagName === 'LI') {
            createShowPage(e);
        } else if (e.target.className === 'like-btn') {
            likeBook(e);
        }
    })
});

function fetchBooks(list) {
    fetch(BOOKS_URL)
    .then(resp => resp.json())
    .then(function(json) {
        json.forEach(function(book) {
            let bookItem = document.createElement('li');
            bookItem.innerHTML = `${book.title}`
            bookItem.dataset.id = `${book.id}`
            list.appendChild(bookItem);
            BOOKS_ARRAY.push(book);
        })
    })
}

function findBook(id) {
    let index = Number(id);
    return BOOKS_ARRAY.find(function(book) {
        return book.id === index;
    })
}

function createShowPage(e) {
    let book = findBook(e.target.dataset.id);

    const showPage = document.getElementById('show-panel');
    showPage.innerHTML = `
        <h2> ${book.title} </h2>
        <img src='${book.img_url}'>
        <p> ${book.description} </p>
    `

    book.users.forEach(function(user) {
        showPage.innerHTML += `<p> ${user.username} </p>`
    })

    //since i am user 1 no matter what i need to see if this book includes me already then change the like button to unlike
    let likedUser = book.users.find(user => user.id === 1)
    if (likedUser == undefined) 
        showPage.innerHTML += `<button class='like-btn' data-id='${book.id}'> Like Book </button>`;
    else
        showPage.innerHTML += `<button class='like-btn' data-id='${book.id}'> Unlike Book </button>`;
}

function likeBook(e) {
    let book = findBook(e.target.dataset.id);
    let liked = book.users.find(user => user.id === 1)

    if (liked == undefined) {
        book.users.push({"id":1, "username":"pouros"});
        
        //append to DOM
        newUser = document.createElement('p')
        newUser.innerHTML = 'pouros';
        e.target.insertAdjacentElement('beforebegin', newUser);
        e.target.innerText = 'Unlike Book'
    } else {
        book.users.splice(book.users.indexOf(liked), 1);
        e.target.previousElementSibling.remove();
        e.target.innerText = 'Like Book';
    }

    let users = book.users;
    fetch(BOOKS_URL + book.id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users })
    })
}