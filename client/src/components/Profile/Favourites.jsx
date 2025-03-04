import React, { useState, useEffect } from 'react';
import axios from "axios";
import BookCard from '../BookCard/BookCard';

const Favourites = () => {
  const [FavouriteBooks, setFavouriteBooks] = useState([]); // Initialize as empty array

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1000/api/v1/get-favourite-books",
          { headers }
        );
        setFavouriteBooks(response.data.data || []); // Ensure it's always an array
      } catch (error) {
        console.error("Error fetching favourite books:", error);
        setFavouriteBooks([]); // Prevent undefined state
      }
    };
    fetchFavourites();
  }, []);
  

  return (
    <>
      {FavouriteBooks.length === 0 && (
        <div className='text-5xl font-semibold h-[100%] text-zinc-500 flex items-center justify-center w-full'>
          No Favourite Books
        </div>
      )}

      <div className='grid grid-cols-4 gap-4'>
        {FavouriteBooks.map((items, i) => (
          <div key={i}>
            <BookCard data={items} favourite={true} />
          </div>
        ))}
      </div>
    </>
  );
};

export default Favourites;
