class Library {
  library = [];
  constructor() {}

  deleteBook(id) {
    this.library = this.library.filter((book) => book.id !== id);
  }

  addBookToLibrary({ name, author, pages, read }) {
    const book = new Book(name, author, pages, read);
    this.library.push(book);

    return book;
  }

  getBookById(id) {
    const book = this.library.find((book) => book.id === id);

    if (!book) return;

    return book;
  }
}

class Book {
  constructor(name, author, pages, read) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }

  toggleReadStatus() {
    this.read = !this.read;
  }
}

const library = new Library();

class UIController {
  libraryEl = document.querySelector('.library tbody');
  newBookForm = document.querySelector('.form');
  dialogEl = document.getElementById('dialog');
  dialogCloseBtn = document.getElementById('dialog-close-btn');
  newBookBtn = document.getElementById('new-book-btn');
  constructor() {
    this.newBookBtn.addEventListener('click', () => this.dialogEl.show());
    this.dialogCloseBtn.addEventListener('click', () => this.dialogEl.close());
    this.newBookForm.addEventListener(
      'submit',
      this.handlerNewBookForm.bind(this)
    );
  }

  createBookHTML(book) {
    this.createRow(book);
  }

  createRow({ id, name, author, pages, read }) {
    const tr = document.createElement('tr');
    tr.dataset.id = id;
    const tdName = this.createColumn(name);
    const tdAuthor = this.createColumn(author);
    const tdPages = this.createColumn(pages);
    const tdRead = this.createColumn(read ? 'Read' : 'Not read');
    tdRead.setAttribute('id', 'td-read');
    const tdActions = this.createColumn('');
    const tdReadToggle = this.createButton(
      'Toggle Read',
      this.handlerToggleRead.bind(this)
    );
    const tdDeleteBook = this.createButton(
      'Delete book',
      this.handlerDeleteBook.bind(this)
    );

    tdActions.append(tdReadToggle, tdDeleteBook);
    tr.append(tdName, tdAuthor, tdPages, tdRead, tdActions);
    this.libraryEl.append(tr);
  }

  createColumn(text) {
    const td = document.createElement('td');
    td.textContent = text;

    return td;
  }

  createButton(text, handler) {
    const button = document.createElement('button');
    button.classList.add('button');
    button.textContent = text;

    if (handler) {
      button.addEventListener('click', handler);
    }

    return button;
  }

  handlerToggleRead(e) {
    const { book, tr } = this.getBookFromEvent(e);
    const td = tr.querySelector('#td-read');
    book.toggleReadStatus();
    td.textContent = book.read ? 'Read' : 'Not read';
  }

  handlerDeleteBook(e) {
    const { book, tr } = this.getBookFromEvent(e);

    const isAllow = confirm('Do you want delete book?');

    if (isAllow) {
      library.deleteBook(book.id);
      this.libraryEl.removeChild(tr);
    }
  }

  getBookFromEvent(e) {
    const tr = e.target.closest('tr');

    if (!tr) return;

    const id = tr.dataset.id;
    const book = library.getBookById(id);

    if (!book) return;

    return { book, tr };
  }

  handlerNewBookForm(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const { name, author, pages, read } = Object.fromEntries(formData);

    if (!name.trim() || !author.trim()) return;

    const newBook = {
      name: name.trim(),
      author: author.trim(),
      pages: Number(pages),
      read: read ? true : false,
    };

    const book = library.addBookToLibrary(newBook);
    this.createBookHTML(book);
    this.dialogEl.close();
    form.reset();
  }
}

new UIController();
