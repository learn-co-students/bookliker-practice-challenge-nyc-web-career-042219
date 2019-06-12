console.log('we loading?')

const bookUrl = 'http://localhost:3000/books'
const list = document.querySelector('#list')
const showPanel = document.querySelector('#show-panel')
const currentUser = { "id": 1, "username": "pouros" }
let bookArr = []

//fetch books
function fetchBooks(){
    fetch(bookUrl)
    .then(res => res.json())
    .then(books => {
        console.log(books)
        //create local state
        bookArr = books
        //append to the dom yooo
        books.forEach(book => {
            let bookElement = document.createElement('li')
            bookElement.innerHTML = `<li data-id='${book.id}'> ${book.title}</li>`
            list.appendChild(bookElement)
        })
    })
}//end of function
//invoke
fetchBooks()

//add event listener to for book title that shows book info on click
list.addEventListener('click', event => {
    // console.log(event.target.dataset.id)
    let bookId = parseInt(event.target.dataset.id)
    //have to retrun find
    let bookObj = bookArr.find(book => {        
       return bookId === book.id
    })
    // console.log(bookObj)
    const div = document.createElement('div')
    div.innerHTML = `
    <h1>${bookObj.title}</h1>
    <img src='${bookObj.img_url}'/>
    <ul id='users-list'>
        ${usersToHTML(bookObj.users)}
    </ul>
    <button data-id="${bookObj.id}">Read Book</button>
    `
    //append to dom as aleaysss
    showPanel.innerHTML = ''
    showPanel.appendChild(div)
})


//render users
function usersToHTML(users){
    return users.map(user => `<li>${user.username}</li>`).join('')
}

//add event listener to show panel for read book click
showPanel.addEventListener('click',event =>{
    console.log(event.target)
    let bookId = parseInt(event.target.dataset.id)
    let bookObj = bookArr.find(book => {
        return book.id === bookId
    })
    bookObj.users.push(currentUser)
    //add current users to book ob
    console.log(bookObj.users)
    //patch users array with current user on click
    fetch(`${bookUrl}/${bookId}`,{
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            users: bookObj.users            
        })
    })//end of fetch
    //now append to dom
    const div = document.createElement('div')
    div.innerHTML = `
    <h1>${bookObj.title}</h1>
    <img src='${bookObj.img_url}'/>
    <ul id='users-list'>
        ${usersToHTML(bookObj.users)}
    </ul>
    <button data-id="${bookObj.id}">Read Book</button>
    `
    showPanel.innerHTML = ''
    showPanel.appendChild(div)

})
//append to the dom 