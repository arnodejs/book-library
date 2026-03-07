// DOM Nodes

const myLibraryBodyNode = document.querySelector('.library tbody');
const dialogNode = document.getElementById('dialog');
const dialogCloseBtn = document.getElementById('dialog-close-btn');
const bookFormNode = document.querySelector('.form');
const newBookBtn = document.getElementById('new-book-btn');

const closeDialog = () => dialogNode.close();
const showDialog = () => dialogNode.show();

dialogCloseBtn.addEventListener('click', closeDialog);
newBookBtn.addEventListener('click', showDialog);

const myLibrary = [];

function Book(name, author, pages) {
  if (!new.target) throw new Error('Book must be called with new');

  this.id = crypto.randomUUID();
  this.name = name;
  this.author = author;
  this.pages = pages;
  this.isRead = false;
}

Book.prototype.changeReadStatus = function () {
  this.isRead = !this.isRead;
};

Book.prototype.deleteBook = function () {
  const findIndex = myLibrary.findIndex((book) => book.id === this.id);
  const answer = confirm('Do you want to delete book?');

  if (answer) myLibrary.splice(findIndex, 1);
};

function addBookToLibrary(name, author, pages) {
  if (!name.trim() || !author.trim() || !pages) return;

  const book = new Book(name.trim(), author.trim(), pages);
  myLibrary.push(book);
  renderBooks();
}

function createBookHTML({ id, name, author, pages, isRead }) {
  // Create table columns
  const tr = document.createElement('tr');
  const tdName = document.createElement('td');
  const tdAuthor = document.createElement('td');
  const tdPages = document.createElement('td');
  const tdReadStatus = document.createElement('td');
  const tdDelete = document.createElement('td');

  // Add event listener to delete and read status buttons
  const tdReadStatusCheckbox = document.createElement('input');
  tdReadStatusCheckbox.type = 'checkbox';
  tdReadStatusCheckbox.checked = isRead;
  const tdDeleteBtn = document.createElement('button');
  tdDeleteBtn.classList.add('book-delete-btn', 'book-action');
  tdReadStatusCheckbox.classList.add('book-read-checkbox');

  tdReadStatus.append(tdReadStatusCheckbox);
  tdDelete.append(tdDeleteBtn);
  tdDeleteBtn.addEventListener('click', handleDeleteBook);
  tdReadStatusCheckbox.addEventListener('change', handleReadStatus);

  // Append columns to row
  tr.setAttribute('data-id', id);
  tdName.textContent = name;
  tdAuthor.textContent = author;
  tdPages.textContent = pages;
  tr.append(tdName, tdAuthor, tdPages, tdReadStatus, tdDelete);

  return tr;
}

function handleDeleteBook(e) {
  const book = getBookFromEvent(e);
  if (!book) return;

  book.deleteBook();
  renderBooks();
}

function getBookFromEvent(e) {
  const tr = e.target.closest('tr');

  if (!tr) return;

  const id = tr.dataset.id;
  const book = myLibrary.find((book) => book.id === id);

  return book;
}

function handleReadStatus(e) {
  const book = getBookFromEvent(e);

  if (!book) return;

  book.changeReadStatus();
}

function renderBooks() {
  myLibraryBodyNode.textContent = '';

  myLibrary.forEach((book) => {
    const tr = createBookHTML(book);
    myLibraryBodyNode.append(tr);
  });
}

function handleBookFormSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const { name, author, pages } = Object.fromEntries(formData);

  addBookToLibrary(name, author, pages);
  closeDialog();
  bookFormNode.reset();
}

bookFormNode.addEventListener('submit', handleBookFormSubmit);

renderBooks();
