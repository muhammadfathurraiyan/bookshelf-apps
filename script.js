const bookStorage = "LOCAL_BOOK_STORAGE";
function createArticleElement(dataStorage) {
  const data = dataStorage;
  const newArticleElement = document.createElement("article");
  newArticleElement.classList.add("book-item");

  const h3 = document.createElement("h3");
  h3.innerText = data.title;
  newArticleElement.appendChild(h3);

  const pAuthor = document.createElement("p");
  pAuthor.innerText = `Author: ${data.author}`;
  newArticleElement.appendChild(pAuthor);

  const pYear = document.createElement("p");
  pYear.innerText = `Tahun: ${data.year}`;
  newArticleElement.appendChild(pYear);

  const divElement = document.createElement("div");
  divElement.classList.add("action");

  const isCompleteButton = document.createElement("button");
  isCompleteButton.innerText = data.isComplete
    ? "Belum dibaca"
    : "Selesai dibaca";
  isCompleteButton.classList.add("buttonPrimary");
  divElement.appendChild(isCompleteButton);

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Hapus";
  deleteButton.classList.add("buttonDestructive");
  divElement.appendChild(deleteButton);

  newArticleElement.appendChild(divElement);
  if (data.isComplete) {
    return completeBookshelfList.appendChild(newArticleElement);
  } else {
    return incompleteBookshelfList.appendChild(newArticleElement);
  }
}

window.addEventListener("load", function () {
  if (typeof Storage !== "undefined") {
    if (localStorage.getItem(bookStorage) === null) {
      localStorage.setItem(bookStorage, {});
    } else {
      createArticleElement(localStorage.getItem(bookStorage));
    }
  } else {
    alert("Browser yang Anda gunakan tidak mendukung Web Storage");
  }
});

const formSubmit = document.getElementById("formBuku");
const incompleteBookshelfList = document.getElementById(
  "incompleteBookshelfList"
);
const completeBookshelfList = document.getElementById("completeBookshelfList");

formSubmit.addEventListener("submit", function (event) {
  const id = +new Date();
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = document.getElementById("year").value;
  const isComplete = document.getElementById("isComplete").checked;
  const newData = {
    id,
    title,
    author,
    year,
    isComplete,
  };
  localStorage.setItem(bookStorage, newData);
  event.preventDefault();
});

// const newArticleElement = document.createElement("article");
//   newArticleElement.classList.add("book-item");

//   const h3 = document.createElement("h3");
//   h3.innerText = data.title;
//   newArticleElement.appendChild(h3);

//   const pAuthor = document.createElement("p");
//   pAuthor.innerText = `Author: ${data.author}`;
//   newArticleElement.appendChild(pAuthor);

//   const pYear = document.createElement("p");
//   pYear.innerText = `Tahun: ${data.year}`;
//   newArticleElement.appendChild(pYear);

//   const divElement = document.createElement("div");
//   divElement.classList.add("action");

//   const isCompleteButton = document.createElement("button");
//   isCompleteButton.innerText = data.isComplete ? "Belum dibaca" : "Selesai dibaca";
//   isCompleteButton.classList.add("buttonPrimary");
//   divElement.appendChild(isCompleteButton);

//   const deleteButton = document.createElement("button");
//   deleteButton.innerText = "Hapus";
//   deleteButton.classList.add("buttonDestructive");
//   divElement.appendChild(deleteButton);

//   newArticleElement.appendChild(divElement);
//   if (data.isComplete) {
//     completeBookshelfList.appendChild(newArticleElement);
//   } else {
//     incompleteBookshelfList.appendChild(newArticleElement);
//   }
