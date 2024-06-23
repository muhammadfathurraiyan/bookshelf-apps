const books = [];
const RENDER_EVENT = "render-book";
const STORAGE_KEY = "BOOKSELF-APPS";
let bookIdToDelete = null;
let filteredBooks = [];

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year: parseInt(year),
    isComplete,
  };
}

function findBook(bookId) {
  for (const book of books) {
    if (book.id === bookId) {
      return book;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function createBookList(bookObject) {
  const { id, title, author, year, isComplete } = bookObject;

  const h3 = document.createElement("h3");
  h3.innerText = title;

  const pAuthor = document.createElement("p");
  pAuthor.innerText = `Author: ${author}`;

  const pYear = document.createElement("p");
  pYear.innerText = `Tahun: ${year}`;

  const container = document.createElement("article");
  container.classList.add("book-item");
  container.append(h3, pAuthor, pYear);

  if (isComplete) {
    const undoButton = document.createElement("button");
    undoButton.innerText = "Belum dibaca";
    undoButton.classList.add("buttonPrimary");
    undoButton.addEventListener("click", function () {
      undoIsComplete(id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Hapus";
    deleteButton.classList.add("buttonDestructive");
    deleteButton.addEventListener("click", function () {
      deleteBook(id);
    });

    const divElement = document.createElement("div");
    divElement.classList.add("action");
    divElement.append(undoButton, deleteButton);

    container.append(divElement);
  } else {
    const checkButton = document.createElement("button");
    checkButton.innerText = "Selesai dibaca";
    checkButton.classList.add("buttonPrimary");
    checkButton.addEventListener("click", function () {
      addIsComplete(id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Hapus";
    deleteButton.classList.add("buttonDestructive");
    deleteButton.addEventListener("click", function () {
      deleteBook(id);
    });

    const divElement = document.createElement("div");
    divElement.classList.add("action");
    divElement.append(checkButton, deleteButton);

    container.append(divElement);
  }
  return container;
}

function addBook() {
  const id = generateId();
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = document.getElementById("year").value;
  const isComplete = document.getElementById("isComplete").checked;

  const bookObject = generateBookObject(id, title, author, year, isComplete);
  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addIsComplete(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoIsComplete(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function deleteBook(bookId) {
  bookIdToDelete = bookId;
  showModal(bookId);
}

function confirmDelete() {
  if (bookIdToDelete !== null) {
    const bookTarget = findBookIndex(bookIdToDelete);
    if (bookTarget === -1) return;
    books.splice(bookTarget, 1);
    filteredBooks = [];
    bookIdToDelete = null;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
  closeModal();
}

function showModal() {
  const modal = document.getElementById("deleteModal");
  modal.style.display = "flex";
}

function closeModal() {
  const modal = document.getElementById("deleteModal");
  modal.style.display = "none";
}

function searchBook() {
  const query = document.getElementById("search").value.toLowerCase();
  if (query.length > 0) {
    filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(query)
    );
  } else {
    filteredBooks = [];
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

document
  .getElementById("confirmDelete")
  .addEventListener("click", confirmDelete);
document.getElementById("cancelDelete").addEventListener("click", closeModal);

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("bookForm");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
    submitForm.reset();
  });

  const searchForm = document.getElementById("searchForm");
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, function () {
  const listUncompleted = document.getElementById("listUncompleted");
  const listCompleted = document.getElementById("listCompleted");

  listUncompleted.innerHTML = "";
  listCompleted.innerHTML = "";

  const booksToRender = filteredBooks.length > 0 ? filteredBooks : books;

  for (const book of booksToRender) {
    const bookElement = createBookList(book);
    if (book.isComplete) {
      listCompleted.append(bookElement);
    } else {
      listUncompleted.append(bookElement);
    }
  }
});
