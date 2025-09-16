# SoleMate 👟  
*A community-driven marketplace for buying and selling shoes*  

## 📌 Project Overview  
SoleMate is a mobile-first marketplace application dedicated exclusively to shoes.  
It enables users to list, browse, and purchase shoes with ease. Whether you're a sneakerhead or just looking for a comfortable pair, SoleMate helps you discover the perfect match.  

---

## 🚀 Features  
- **User Authentication** – Secure login/signup via email or Google.  
- **Shoe Listings** – Add shoes with brand, size, color, condition, price, and images.  
- **Search & Filters** – Find shoes by brand, size, condition (new/used), and price range.  
- **Wishlist** – Save shoes for later.  
- **Notifications** – Stay updated on new arrivals and price drops.  
- **Profile Management** – View seller profiles, their listings, and update your own.  
- **Admin Dashboard** – Manage and moderate listings.  

---

## 🛠️ Tech Stack  
- **Frontend:** React Native (Expo)  
- **Backend:** Firebase (Cloud Functions, Firestore, Storage, Authentication)  
- **Database:** Firestore (NoSQL)  
- **Hosting:** Firebase Hosting (if needed for admin panel)  
- **Design:** Figma (UI/UX mockups)  

---

## 📂 Firestore Data Structure  

### Users  
```json
{
  "userId": "string",
  "name": "string",
  "email": "string",
  "profilePic": "string (URL)",
  "createdAt": "timestamp"
}
