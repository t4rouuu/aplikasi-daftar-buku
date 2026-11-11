HEAD
# aplikasi-daftar-buku

# Aplikasi Daftar Buku

Aplikasi CRUD buku menggunakan Express, Prisma ORM, dan Neon PostgreSQL.

## Menjalankan project

1. Install dependency:

   ```bash
   npm install
   ```

2. Salin `.env.example` menjadi `.env`, lalu isi `DATABASE_URL` dari project Neon. URL harus memakai `sslmode=require`.

3. Generate Prisma Client dan sinkronkan tabel ke Neon:

   ```bash
   npm run prisma:generate
   npm run prisma:push
   ```

   (Opsional) isi data awal:

   ```bash
   npm run prisma:seed
   ```

4. Jalankan aplikasi:

   ```bash
   npm start
   ```

5. Buka `http://localhost:3000`.

## Endpoint

- `GET /api/books` menampilkan semua buku.
- `POST /api/books` menambahkan buku.
- `PUT /api/books/:id` mengubah buku.
- `DELETE /api/books/:id` menghapus buku.

## Evidence laporan

Lampirkan screenshot berikut:

1. Halaman aplikasi sebelum dan sesudah menambah buku.
2. Halaman aplikasi setelah mengedit buku.
3. Dialog/tampilan setelah menghapus buku.
4. Neon SQL Editor atau Prisma Studio sebelum perubahan data.
5. Neon SQL Editor atau Prisma Studio sesudah perubahan data, yang menunjukkan baris buku bertambah, berubah, dan terhapus.

Jangan commit file `.env`; gunakan `.env.example` untuk dokumentasi konfigurasi.
2bcffa3 (Menambahkan Prisma Neon dan laporan evidence)
