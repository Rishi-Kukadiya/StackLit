# StackLit 💡 — A Fullstack Q&A Platform

**StackLit** is a full-featured StackOverflow-style Q&A web application built using the **MERN stack**, allowing users to post questions, answer others, get real-time notifications, search users/questions/tags, and much more.

---

## 🚀 Live Demo

🌐 [https://your-live-demo-link.com](https://your-live-demo-link.com)

---

## 📸 Screenshots

Here are some example pages from the app:

| Home | Question Page | Ask Form |
|------|---------------|----------|
| ![](https://picsum.photos/600/300?random=1) | ![](https://picsum.photos/600/300?random=2) | ![](https://picsum.photos/600/300?random=3) |

| Tags | Notifications | Chat |
|------|---------------|------|
| ![](https://picsum.photos/600/300?random=4) | ![](https://picsum.photos/600/300?random=5) | ![](https://picsum.photos/600/300?random=6) |

| Search | Profile | Group Chat |
|--------|---------|-------------|
| ![](https://picsum.photos/600/300?random=7) | ![](https://picsum.photos/600/300?random=8) | ![](https://picsum.photos/600/300?random=9) |

| Dark Mode | Rich Editor | Responsive |
|-----------|-------------|-------------|
| ![](https://picsum.photos/600/300?random=10) | ![](https://picsum.photos/600/300?random=11) | ![](https://picsum.photos/600/300?random=12) |

| Pagination | Sidebar | Auth Pages |
|------------|----------|-------------|
| ![](https://picsum.photos/600/300?random=13) | ![](https://picsum.photos/600/300?random=14) | ![](https://picsum.photos/600/300?random=15) |

---

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS, Axios, React Router, Redux Toolkit
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** JWT-based auth
- **Real-time:** Socket.IO (for notifications)
- **Editor:** Quill.js (rich text)
- **Storage:** Cloudinary (image upload)
- **Search:** Regex-based search for users/questions/tags
- **Other:** Vite, CORS, dotenv, express-async-handler

---

## ✨ Features

- ✅ Sign up / Login / JWT Auth
- ✅ Ask questions with tags, images, formatting
- ✅ View answers, post answers, like/dislike
- ✅ Live notifications for answers, likes/dislikes
- ✅ Search users, tags, and questions
- ✅ View user profile and stats
- ✅ Paginated questions, answers, and search results
- ✅ Mobile responsive UI

---

## 📂 Project Structure

```bash
StackLit/
│
├── Backend/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── sockets/
│   └── utils/
│
└── Frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── redux/
    │   ├── routes/
    │   ├── App.jsx
    │   └── main.jsx
```

---

## 🔧 Setup Instructions

### 1. Clone Repo

```bash
git clone https://github.com/your-username/stacklit.git
cd stacklit
```

### 2. Backend Setup

```bash
cd Backend
npm install
touch .env
```

Fill in your `.env` file with:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

Start backend server:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd ../Frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

You need these for your backend `.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=secret123
CLOUDINARY_NAME=yourname
CLOUDINARY_API_KEY=123456
CLOUDINARY_API_SECRET=abcdef
```

---

## 📬 Feedback or Contribution

Pull requests are welcome. For major changes, open an issue first.

---

## 📄 License

This project is licensed under the MIT License.

---

### ⭐ Give a Star

If you like the project, don’t forget to ⭐ the repository!
