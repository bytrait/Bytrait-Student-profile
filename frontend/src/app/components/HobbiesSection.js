"use client";
import React, { useState, useRef, useEffect } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import Cookies from "js-cookie";

const HobbiesSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hobbies, setHobbies] = useState([]);
  const [newHobby, setNewHobby] = useState("");
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch hobbies on mount
  useEffect(() => {
    const fetchHobbies = async () => {
      try {
        const token = Cookies.get("user-details");
        if (!token) throw new Error("No token found");

        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/hobbies`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setHobbies(response.data.map((hobby) => hobby.name));
      } catch (err) {
        console.error("Error fetching hobbies:", err.message);
      }
    };

    fetchHobbies();
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isModalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isModalOpen]);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) setNewHobby("");
  };

  const handleInputChange = (e) => {
    setNewHobby(e.target.value.trimStart());
  };

  const handleAddHobby = async () => {
    if (newHobby.trim() && !hobbies.includes(newHobby.trim())) {
      try {
        const token = Cookies.get("user-details");
        if (!token) throw new Error("No token found");

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/hobbies`,
          { name: newHobby.trim() },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setHobbies((prevHobbies) => [...prevHobbies, response.data.name]);
        handleModalToggle();
      } catch (err) {
        console.error("Error adding hobby:", err.message);
      }
    }
  };

  const handleDeleteHobby = async (index) => {
    try {
      const token = Cookies.get("user-details");
      if (!token) throw new Error("No token found");

      const hobbyToDelete = hobbies[index];
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/hobbies`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const hobbyId = response.data.find((h) => h.name === hobbyToDelete).id;

      await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/hobbies/${hobbyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setHobbies(hobbies.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Error deleting hobby:", err.message);
    }
  };

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="bg-white py-6 flex flex-col md:flex-row justify-between items-start">
      <h3 className="md:w-[40%] md:pl-6 mb-4 text-base text-[#56698E] font-[600]">
        HOBBIES & INTERESTS
      </h3>
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {hobbies.map((hobby, index) => (
            <div
              key={index}
              className="flex justify-between items-center border border-gray-200 p-3 rounded-lg"
            >
              <p className="text-sm font-semibold text-[#56698E]">{hobby}</p>
              <button
                className="text-gray-400 hover:text-red-500"
                onClick={() => handleDeleteHobby(index)}
              >
                <RiDeleteBinLine size={20} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={handleModalToggle}
          className="mt-6 text-sm text-blue-600 bg-blue-100 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200"
        >
          + Add Hobbies & Interests
        </button>

        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-start justify-center pt-12 z-50"
            onClick={handleOutsideClick}
          >
            <div
              ref={modalRef}
              className="bg-white rounded-lg p-6 w-[90%] max-w-[600px] shadow-lg relative"
            >
              <button
                onClick={handleModalToggle}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                <IoMdClose size={24} />
              </button>
              <h2 className="text-xl font-semibold text-center mb-6">
                Add New Hobby or Interest
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="hobby"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Add Hobbies & Interests / Extra-curriculum
                  </label>
                  <input
                    type="text"
                    id="hobby"
                    ref={inputRef}
                    value={newHobby}
                    onChange={handleInputChange}
                    placeholder="Enter hobby or interest"
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div className="col-span-2 text-right">
                  <button
                    onClick={handleAddHobby}
                    className="w-[174px] bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700"
                    disabled={!newHobby.trim()}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HobbiesSection;
