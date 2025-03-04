import React from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";

const BookCard = ({ data, favourite }) => {
  const handleRemoveBook = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:1000/api/v1/remove-book-from-favourite",
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
            id: localStorage.getItem("id"),
          },
          data: { bookid: data._id, id: localStorage.getItem("id") }, 
        }
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error removing book:", error);
    }
  };

  return (
    <div>
      <Link to={`/view-book-details/${data._id}`}>
        <div className="bg-zinc-800 rounded p-4 flex flex-col">
          <div className="bg-zinc-900 rounded flex items-center justify-center">
            <img src={data.url} alt="/" className="h-[20vh]" />
          </div>
          <h2 className="mt-4 text-xl text-white font-semibold">{data.title}</h2>
          <p className="mt-2 text-zinc-400 font-semibold"> by {data.author}</p>
          <p className="mt-2 text-xl text-zinc-200 font-semibold">Rs. {data.price}</p>
        </div>
      </Link>

      {favourite && (
        <button
          className="bg-yellow-100 px-4 py-2 rounded border border-yellow-500 text-yellow-500 mt-4"
          onClick={handleRemoveBook}
        >
          Remove from Favourite
        </button>
      )}
    </div>
  );
};

export default BookCard;
