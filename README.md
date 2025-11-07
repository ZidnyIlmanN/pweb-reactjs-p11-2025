# pweb-reactjs-p11-2025

| Nama                   | NRP        |
| ---------------------- | ---------- |
| Zidny Ilman Nafi`an    | 5027221072 |
| Ananda Fitri Wibowo    | 5027241057 |
| Ahmad Yazid Arifuddin  | 5027241040 |

# IT Literature Shop

## Gambaran Umum
Ini adalah aplikasi toko buku berbasis web yang dibangun menggunakan Next.js 13 dengan TypeScript. Aplikasi ini memiliki fitur autentikasi pengguna, manajemen buku, keranjang belanja, dan pemrosesan transaksi.

## Teknologi yang Digunakan
- **Framework:** Next.js 13
- **Bahasa Pemrograman:** TypeScript
- **Styling:** Tailwind CSS
- **Manajemen State:** React Context (Auth Context, Cart Context)
- **Komponen UI:** Komponen kustom dengan shadcn/ui
- **Autentikasi:** Sistem autentikasi kustom

## Fitur-Fitur

<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/d20e3cfe-7b28-4c4a-a484-2a255acbc95b" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/7fc7d6ca-7cc6-4326-b3d1-d608d0be8131" />
1. **Autentikasi**
   - Pendaftaran pengguna
   - Login pengguna
   - Rute terproteksi

<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/c0efbad5-67fa-4c0c-9de1-6adec45dea6e" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/c4da45a3-117c-46d5-9478-1ad7c44b8c70" />
<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/2aade3cf-2e0e-41d8-8088-8d2205cad946" />
2. **Manajemen Buku**
   - Lihat semua buku
   - Lihat detail buku
   - Tambah buku baru (admin)
   - Filter buku berdasarkan genre
   - Kategorisasi buku

<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/917b2e38-b6c4-44c8-82cd-2c4710492bed" />
3. **Keranjang Belanja**
   - Tambah buku ke keranjang
   - Lihat item keranjang
   - Update jumlah item
   - Hapus item dari keranjang

<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/def76764-3ba1-4110-a6cf-9bde373e9a3a" />
4. **Transaksi**
   - Proses checkout
   - Riwayat transaksi
   - Detail transaksi
   - Dashboard statistik

## Struktur Proyek
```
├── app/                    # Direktori app Next.js 13
│   ├── auth/              # Halaman autentikasi
│   ├── books/             # Halaman terkait buku
│   ├── cart/              # Halaman keranjang belanja
│   └── transactions/      # Halaman transaksi
├── components/            # Komponen yang dapat digunakan kembali
│   ├── icons/            # Komponen icon SVG
│   └── ui/               # Komponen UI
├── context/              # Provider React Context
├── hooks/                # Custom React hooks
├── lib/                  # Fungsi utilitas
├── services/            # Layanan API
└── styles/              # Style global
```

## Endpoint API

### Autentikasi
```
POST /api/auth/register
- Deskripsi: Mendaftarkan pengguna baru
- Body: { username, email, password }

POST /api/auth/login
- Deskripsi: Login pengguna
- Body: { email, password }

POST /api/auth/logout
- Deskripsi: Logout pengguna
```

### Manajemen Buku
```
GET /api/books
- Deskripsi: Mendapatkan daftar semua buku
- Query: { page, limit, genre }

GET /api/books/:id
- Deskripsi: Mendapatkan detail buku
- Params: id

POST /api/books
- Deskripsi: Menambah buku baru (admin only)
- Body: { title, author, price, stock, genre }

PUT /api/books/:id
- Deskripsi: Update data buku
- Params: id
- Body: { title, author, price, stock, genre }

DELETE /api/books/:id
- Deskripsi: Hapus buku
- Params: id
```

### Keranjang
```
GET /api/cart
- Deskripsi: Mendapatkan isi keranjang

POST /api/cart
- Deskripsi: Menambah item ke keranjang
- Body: { bookId, quantity }

PUT /api/cart/:itemId
- Deskripsi: Update jumlah item
- Params: itemId
- Body: { quantity }

DELETE /api/cart/:itemId
- Deskripsi: Hapus item dari keranjang
- Params: itemId
```

### Transaksi
```
GET /api/transactions
- Deskripsi: Mendapatkan riwayat transaksi
- Query: { page, limit }

GET /api/transactions/:id
- Deskripsi: Mendapatkan detail transaksi
- Params: id

POST /api/transactions
- Deskripsi: Membuat transaksi baru
- Body: { items, shippingAddress }

GET /api/transactions/statistics
- Deskripsi: Mendapatkan statistik transaksi
```

## Cara Memulai

### Prasyarat
- Node.js (versi 16 atau lebih tinggi)
- pnpm package manager

### Langkah-Langkah Instalasi
1. Clone repository
   ```bash
   git clone https://github.com/ZidnyIlmanN/pweb-reactjs-p11-2025.git
   ```

2. Install dependensi
   ```bash
   pnpm install
   ```

3. Siapkan environment variables
   Buat file `.env.local` di direktori root dan tambahkan variabel environment yang diperlukan.

4. Jalankan server development
   ```bash
   pnpm dev
   ```

5. Buka [http://localhost:3000](http://localhost:3000) di browser Anda

## Proses Pengembangan

### 1. Persiapan Proyek
- Inisialisasi proyek Next.js dengan TypeScript
- Pengaturan Tailwind CSS untuk styling
- Konfigurasi struktur proyek dan organisasi folder

### 2. Implementasi Autentikasi
- Membuat halaman login dan registrasi
- Implementasi context autentikasi
- Pengaturan rute terproteksi

### 3. Manajemen Buku
- Mengembangkan halaman daftar dan detail buku
- Implementasi filter berdasarkan genre
- Membuat fungsi penambahan buku

### 4. Keranjang Belanja
- Implementasi context keranjang untuk manajemen state
- Membuat UI keranjang dengan fungsi tambah/hapus
- Mengembangkan ikon keranjang dengan jumlah item

### 5. Sistem Transaksi
- Membuat proses checkout
- Implementasi riwayat transaksi
- Mengembangkan dashboard statistik

### 6. Pengembangan UI/UX
- Merancang navigasi responsif
- Implementasi dark mode
- Membuat komponen UI yang dapat digunakan kembali

## Komponen Utama

### Komponen UI
- Komponen Button kustom
- Input form dan label
- Loading spinner
- Komponen pagination
- Pemilih input genre
- Card responsif

### Provider Context
- Context Autentikasi
- Context Keranjang Belanja

### Custom Hooks
- `useMobile`: Hook untuk desain responsif
- `useToast`: Hook untuk notifikasi toast

## Praktik Terbaik yang Diterapkan
- Pengembangan type-safe dengan TypeScript
- Arsitektur berbasis komponen
- Context API untuk manajemen state
- Prinsip desain responsif
- Organisasi dan modularitas kode
- Implementasi rute terproteksi
- Penanganan error dan loading state

## Pengembangan Masa Depan
1. Menambahkan fungsi pencarian
2. Implementasi ulasan dan rating pengguna
3. Menambahkan integrasi payment gateway
4. Meningkatkan dashboard admin
5. Menambahkan rekomendasi buku
6. Implementasi profil pengguna

## Kontribusi
1. Fork repository
2. Buat branch fitur Anda (`git checkout -b fitur/FiturKeren`)
3. Commit perubahan Anda (`git commit -m 'Menambahkan FiturKeren'`)
4. Push ke branch (`git push origin fitur/FiturKeren`)
5. Buat Pull Request
