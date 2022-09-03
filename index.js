document.addEventListener("DOMContentLoaded", function () {
  const books = [];
  const RENDER_EVENT = "render-book";

  const submitform = document.getElementById("form-input-data");
  submitform.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  function generateId() {
    return +new Date();
  }

  function generateBookObject(id, title, author, year, isComplete) {
    return {
      id,
      title,
      author,
      year,
      isComplete,
    };
  }

  function addBook() {
    const bookName = document.getElementById("title").value;
    const bookAuthor = document.getElementById("penulis").value;
    const bookYearReleased = document.getElementById("tahunterbit").value;
    const bookIsCompletedChecked =
      document.getElementById("is-complete").checked;

    let bookIsComplete = false;
    bookIsCompletedChecked ? (bookIsComplete = true) : (bookIsComplete = false);

    const generatedId = generateId();
    const bookObject = generateBookObject(
      generatedId,
      bookName,
      bookAuthor,
      bookYearReleased,
      bookIsComplete
    );

    books.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    document.getElementById("form-input-data").reset();

    saveData();
  }

  function addFinishedBook(bookId) {
    const bookTarget = findBook(bookId);

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function undoFinishedBook(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function findBookIndex(bookId) {
    for (const index in books) {
      if (books[index].id == bookId) {
        return index;
      }
    }
    return -1;
  }

  function deleteBook(bookId) {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function findBook(bookId) {
    for (const bookItem of books) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
  }

  document.addEventListener(RENDER_EVENT, function () {
    const unfinishedBook = document.getElementById("unfinished-book");
    const finishedBook = document.getElementById("finished-book");
    unfinishedBook.innerHTML = "";
    finishedBook.innerHTML = "";

    for (const bookItem of books) {
      const bookElement = makeBookElement(bookItem);
      if (bookItem.isComplete) {
        finishedBook.append(bookElement);
      } else {
        unfinishedBook.append(bookElement);
      }
    }
  });

  function makeBookElement(bookObject) {
    const textTitleBook = document.createElement("p");
    textTitleBook.innerText = bookObject.title;
    textTitleBook.classList.add("card-book-name");
    const textAuthorBook = document.createElement("p");
    textAuthorBook.innerText = bookObject.author;
    textAuthorBook.classList.add("card-author-name");
    const textYearReleasedBook = document.createElement("p");
    textYearReleasedBook.innerText = bookObject.year;
    textYearReleasedBook.classList.add("card-year");

    const authorDataContianer = document.createElement("div");
    authorDataContianer.classList.add("card-author-data");
    authorDataContianer.append(textAuthorBook, textYearReleasedBook);

    const cardContent = document.createElement("div");
    cardContent.classList.add("card-content");
    cardContent.append(textTitleBook, authorDataContianer);

    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card");
    cardContainer.append(cardContent);
    cardContainer.setAttribute("id", `book-${bookObject.id}`);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("red", "delete-button");
    deleteButton.innerText = "hapus buku";
    deleteButton.addEventListener("click", function () {
      // modal event handler
      const modal = document.getElementById("modal-wrapper");
      const closeButton = document.getElementsByClassName("close")[0];
      const yesButton = document.getElementById("yes-button");
      const noButton = document.getElementById("no-button");

      modal.style.display = "block";
      window.addEventListener("click", function (event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      });
      closeButton.addEventListener("click", function () {
        modal.style.display = "none";
      });

      yesButton.addEventListener("click", function () {
        deleteBook(bookObject.id);
        modal.style.display = "none";
      });

      noButton.addEventListener("click", function () {
        modal.style.display = "none";
      });
    });

    if (!bookObject.isComplete) {
      const finishedReadButton = document.createElement("button");
      finishedReadButton.classList.add("green");
      finishedReadButton.innerText = "selesai dibaca";
      finishedReadButton.addEventListener("click", function () {
        addFinishedBook(bookObject.id);
      });

      const cardButtonContainer = document.createElement("div");
      cardButtonContainer.classList.add("card-btn");
      cardButtonContainer.append(finishedReadButton, deleteButton);

      cardContainer.append(cardButtonContainer);
    } else {
      const undoBookFromFinishedButton = document.createElement("button");
      undoBookFromFinishedButton.classList.add("orange");
      undoBookFromFinishedButton.innerText = "belum dibaca";
      undoBookFromFinishedButton.addEventListener("click", function () {
        undoFinishedBook(bookObject.id);
      });

      const cardButtonContainer = document.createElement("div");
      cardButtonContainer.classList.add("card-btn");
      cardButtonContainer.append(undoBookFromFinishedButton, deleteButton);

      cardContainer.append(cardButtonContainer);
    }
    return cardContainer;
  }

  const ADDED_BOOK = "added_book";
  const STORAGE_KEY = "BOOKSHELF_APP";

  function isStorageExist() {
    if (typeof Storage === undefined) {
      alert("Browser kamu belum mendukung web storage");
      return false;
    }
    return true;
  }

  function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(ADDED_BOOK));
    }
  }

  function loadDataFromStorage() {
    const bookData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(bookData);

    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
