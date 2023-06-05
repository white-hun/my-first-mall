import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiX } from "react-icons/hi";
import { collection, deleteDoc, doc, getDocs, query } from "firebase/firestore";
import { auth, db } from "../service/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function CartProduct({ product }) {
  const { name, price, category, size, quantity, imageUrl } = product;
  const navigate = useNavigate();
  const handleClick = () => navigate(`/products/${product.id}`, { state: { product } });

  const [uid, setUid] = useState(null);
  onAuthStateChanged(auth, (user) => {
    setUid(user.uid);
  });

  const deleteBasketItems = async () => {
    const q = query(doc(db, "users", "user", `${uid}`, "userBasket", "basket", `${product.id}`));
    const querySnapshot = await getDocs(q);
    for (const docSnpshot of querySnapshot.docs) {
      await deleteDoc(docSnpshot.ref);
    }
  };

  const handleDelete = () => {
    deleteBasketItems();
  };

  return (
    <section className="my-5">
      <article className="flex items-center bg-gray-50 rounded-xl p-2">
        <div onClick={handleClick}>
          <img src={imageUrl} alt={name} className="rounded-lg w-44" />
        </div>
        <div className="mx-5 text-xl">
          <div className="flex justify-end mb-5">
            <button
              onClick={handleDelete}
              className="border-solid border-2 border-gray-200 hover:border-gray-700 hover:text-red-600 rounded-md px-3"
            >
              <HiX />
            </button>
          </div>
          <div className="flex items-center">
            <p className="my-1 mr-2">{name}</p>
            <p className="text-sm text-gray-400">{category}</p>
          </div>
          <p className="my-1">사이즈 {size}</p>
          <div className="flex justify-between w-96">
            <p className="my-1 mb-10">수량 {quantity}</p>
            <p className="my-1 font-semibold">
              {price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}
