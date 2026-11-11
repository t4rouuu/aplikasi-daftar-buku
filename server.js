require("dotenv").config();

const express = require("express");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL belum diatur. Salin .env.example menjadi .env.");
}

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function validateBookInput(body) {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const author = typeof body.author === "string" ? body.author.trim() : "";
  const year = Number(body.year);

  if (!title || !author || !Number.isInteger(year) || year < 1) {
    return null;
  }

  return { title, author, year };
}

app.get("/api/books", async (req, res, next) => {
  try {
    const books = await prisma.book.findMany({ orderBy: { id: "asc" } });
    res.json(books);
  } catch (error) {
    next(error);
  }
});

app.post("/api/books", async (req, res, next) => {
  const data = validateBookInput(req.body);

  if (!data) {
    return res.status(400).json({ message: "Judul, penulis, dan tahun harus valid." });
  }

  try {
    const book = await prisma.book.create({ data });
    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
});

app.put("/api/books/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  const data = validateBookInput(req.body);

  if (!Number.isInteger(id) || !data) {
    return res.status(400).json({ message: "ID atau data buku tidak valid." });
  }

  try {
    const book = await prisma.book.update({
      where: { id },
      data
    });
    res.json(book);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Buku tidak ditemukan." });
    }
    next(error);
  }
});

app.delete("/api/books/:id", async (req, res, next) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "ID buku tidak valid." });
  }

  try {
    await prisma.book.delete({ where: { id } });
    res.json({ message: "Buku berhasil dihapus." });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Buku tidak ditemukan." });
    }
    next(error);
  }
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: "Terjadi kesalahan pada database." });
});

const server = app.listen(PORT, () => {
  console.log(`Aplikasi berjalan di http://localhost:${PORT}`);
});

async function shutdown() {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
