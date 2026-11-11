const form = document.getElementById("book-form");
const bookList = document.getElementById("book-list");
const bookIdInput = document.getElementById("book-id");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const yearInput = document.getElementById("year");
const formTitle = document.getElementById("form-title");
const submitButton = document.getElementById("submit-button");
const cancelButton = document.getElementById("cancel-button");
const message = document.getElementById("message");

// GET: menampilkan semua buku ke tabel.
async function loadBooks() {
  const response = await fetch("/api/books");
  const books = await response.json();

  bookList.innerHTML = "";

  books.forEach((book, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.year}</td>
      <td>
        <div class="action-buttons">
          <button class="edit-button" onclick="editBook(${book.id})">Edit</button>
          <button class="delete-button" onclick="deleteBook(${book.id})">Hapus</button>
        </div>
      </td>
    `;
    bookList.appendChild(row);
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const book = {
    title: titleInput.value,
    author: authorInput.value,
    year: yearInput.value
  };
  const id = bookIdInput.value;
  const url = id ? `/api/books/${id}` : "/api/books";
  const method = id ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book)
  });
  const result = await response.json();

  if (!response.ok) {
    showMessage(result.message, true);
    return;
  }

  showMessage(id ? "Buku berhasil diubah." : "Buku berhasil ditambahkan.");
  resetForm();
  loadBooks();
});

async function editBook(id) {
  const response = await fetch("/api/books");
  const books = await response.json();
  const book = books.find((item) => item.id === id);

  bookIdInput.value = book.id;
  titleInput.value = book.title;
  authorInput.value = book.author;
  yearInput.value = book.year;
  formTitle.textContent = "Edit Buku";
  submitButton.textContent = "Simpan Perubahan";
  cancelButton.classList.remove("hidden");
  titleInput.focus();
}

async function deleteBook(id) {
  if (!confirm("Yakin ingin menghapus buku ini?")) {
    return;
  }

  const response = await fetch(`/api/books/${id}`, { method: "DELETE" });
  const result = await response.json();
  showMessage(result.message, !response.ok);
  loadBooks();
}

function resetForm() {
  form.reset();
  bookIdInput.value = "";
  formTitle.textContent = "Tambah Buku";
  submitButton.textContent = "Tambah";
  cancelButton.classList.add("hidden");
}

function showMessage(text, isError = false) {
  message.textContent = text;
  message.style.color = isError ? "#dc2626" : "#16a34a";
}

cancelButton.addEventListener("click", resetForm);
loadBooks();
