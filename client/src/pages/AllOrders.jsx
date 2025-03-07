import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader/Loader";
import { FaUserLarge, FaCheck } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { IoOpenOutline } from "react-icons/io5";
import SeeUserData from "./SeeUserData";

const AllOrders = () => {
  const [userDiv, setuserDiv] = useState("hidden");
  const [userDivData, setuserDivData] = useState(null);
  const [AllOrders, setAllOrders] = useState([]);
  const [Options, setOptions] = useState(-1);
  const [Values, setValues]=useState();
  
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:1000/api/v1/get-all-orders", { headers });
        const validOrders = response.data.data.filter(order => order && order.book); // ✅ Filter out null/undefined orders
        setAllOrders(validOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);


  const submitChanges = async (i) => {
    try {
      const id = AllOrders[i]?._id;
      const response = await axios.put(
        `http://localhost:1000/api/v1/update-status/${id}`,
        { status: Values }, // Make sure you're sending the correct value
        { headers }
      );
  
      alert(response.data.message);
  
      // ✅ Update state with the new status
      setAllOrders((prevOrders) => {
        const updatedOrders = [...prevOrders];
        updatedOrders[i].status = Values; // Update the status
        return updatedOrders;
      });
  
      setOptions(-1); // Close dropdown
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  
  return (
    <>
      {!AllOrders?.length && (
        <div className="h-[100%] flex items-center justify-center">
          <Loader />
        </div>
      )}

      {AllOrders.length > 0 && (
        <div className="h-[100%] p-0 md:p-4 text-zinc-100">
          <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">
            All Orders
          </h1>

          <div className="mt-4 bg-zinc-800 w-full rounded py-2 px-4 flex gap-2">
            <div className="w-[3%] text-center">Sr.</div>
            <div className="w-[40%] md:w-[22%]">Books</div>
            <div className="w-0 md:w-[45%] hidden md:block">Description</div>
            <div className="w-[17%] md:w-[9%]">Price</div>
            <div className="w-[30%] md:w-[16%]">Status</div>
            <div className="w-[10%] md:w-[5%]">
              <FaUserLarge />
            </div>
          </div>

          {AllOrders?.map((items, i) => (
            <div
              key={items._id}
              className="bg-zinc-800 w-full rounded py-2 px-4 flex gap-2 hover:bg-zinc-900 hover:cursor-pointer transition-all duration-300"
            >
              <div className="w-[3%] text-center">{i + 1}</div>
              <div className="w-[40%] md:w-[22%]">
                <Link
                  to={`/view-book-details/${items.book._id}`}
                  className="hover:text-blue-300"
                >
                  {items.book.title}
                </Link>
              </div>

              <div className="w-0 md:w-[45%] hidden md:block">
                {items.book.desc.slice(0, 50)} ...
              </div>
              <div className="w-[17%] md:w-[9%]">Rs.{items.book.price}</div>

              {/* Status Dropdown */}
              <div className="w-[30%] md:w-[16%] relative">
                <button
                  className="hover:scale-105 transition-all duration-300 font-semibold"
                  onClick={() => setOptions(Options === i ? -1 : i)} // Toggle dropdown
                >
                  {items.status === "Order placed" ? (
                    <div className="text-yellow-500">{items.status}</div>
                  ) : items.status === "Canceled" ? (
                    <div className="text-red-500">{items.status}</div>
                  ) : (
                    <div className="text-green-500">{items.status}</div>
                  )}
                </button>

                {Options === i && (
                  <div className="absolute bg-zinc-900 p-2 rounded shadow-md mt-1 w-36">
                    <select
                    name="status"
                    className="bg-gray-800 p-1 rounded"
                     onChange={(e) => setValues(e.target.value)} // ✅ Store selected value
                      >
                       {["Order placed", "Out for Delivery", "Delivered", "Canceled"].map(
                          (statusOption, index) => (
                         <option key={index} value={statusOption}>
                        {statusOption}
                        </option>
                         )
                           )}
                          </select>

                    <button className="text-green-500 hover:text-pink-600 mx-2"
                    onClick={() =>{
                      setOptions(-1);
                      submitChanges(i);
                    }}>
                      <FaCheck />
                    </button>
                  </div>
                )}
              </div>

              {/* User Details Button */}
              <div className="w-[10%] md:w-[5%]">
                <button
                  className="text-xl hover:text-orange-500"
                  onClick={() => {
                    setuserDiv("fixed");
                    setuserDivData(items.user);
                  }}
                >
                  <IoOpenOutline />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {userDivData  &&(
        <SeeUserData 
        userDivData={userDivData}
        userDiv={userDiv}
        setuserDiv={setuserDiv}
        />
      )}
    </>
  );  
};

export default AllOrders;  