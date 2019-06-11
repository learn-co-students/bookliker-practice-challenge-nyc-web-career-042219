document.addEventListener("DOMContentLoaded", function() {
    const listPanel = document.getElementById('list-panel')
    const showPanel = document.getElementById('show-panel')
    const currentUser = {"id": 1, "username": "pouros"}
    const BOOKSURL = 'http://localhost:4000/books'
    let booksArray = []

    function renderTitles(book){
        return `
        <li class="book" data-id="${book.id}">${book.title}</li>`
    }

    function displayTitles(books){
        let booksHTML = books.map(renderTitles)
        listPanel.innerHTML = booksHTML.join('')
    }

    function displayUsers(book){
        return book.users.map(user => `<li class="userLikes" data-id="${user.id}">${user.username}</li>`).join('')
    }

    function renderBookInfo(book){
        return `
        <img src="${book.img_url}">
        <p>${book.description}</p>
        ${displayUsers(book)}
        <button id="button" data-id="${book.id}">READ BRO</button>
        `
    }

    fetch(BOOKSURL)
    .then(response => response.json())
    .then (booksData => {
        booksArray = booksData
        displayTitles(booksArray)

    })

    listPanel.addEventListener('click', (event) =>{
        if (event.target.className === 'book'){
            let targetedTitle = booksArray.find(bookObject => bookObject.id == event.target.dataset.id)
            showPanel.innerHTML = renderBookInfo(targetedTitle)
        }
    })

    showPanel.addEventListener('click', (event) => {
        if (event.target.id === 'button'){
            targetedTitle = booksArray.find(bookObject => bookObject.id == event.target.dataset.id)
            targetedTitle.users.push(currentUser)
        }
        let userId = event.target.dataset.id
        fetch(BOOKSURL + '/' + userId, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                users: targetedTitle.users
            })
        })
        .then(response => response.json())
        .then(data => {
            data.users = targetedTitle.users
            showPanel.innerHTML = renderBookInfo(targetedTitle)
        })
    })

});
