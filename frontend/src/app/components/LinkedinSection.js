"use client";
import React, { useState, useEffect } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiEdit2 } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import Cookies from "js-cookie";

export default function LinkedinSection() {
  const [linkedinProfiles, setLinkedinProfiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProfile, setNewProfile] = useState({ id: null, name: "", url: "" });

  // Fetch LinkedIn profiles for the logged-in user
  useEffect(() => {
    const fetchLinkedinProfiles = async () => {
      try {
        const token = Cookies.get("user-details");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/linkedin`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLinkedinProfiles(response.data);
      } catch (err) {
        console.error("Error fetching LinkedIn profiles:", err.message);
      }
    };

    fetchLinkedinProfiles();
  }, []);

  // Open/close modal
  const handleModalToggle = (profile = null) => {
    setIsModalOpen(!isModalOpen);
    if (profile) {
      setNewProfile({ id: profile.id, name: profile.name, url: profile.url });
    } else {
      setNewProfile({ id: null, name: "", url: "" });
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    setNewProfile({ ...newProfile, [e.target.name]: e.target.value });
  };

  // Add or Update a LinkedIn profile
  const handleSave = async () => {
    try {
      const token = Cookies.get("user-details");
      if (!token) {
        throw new Error("No token found");
      }

      if (newProfile.id) {
        // Update existing profile
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/linkedin/${newProfile.id}`,
          newProfile,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setLinkedinProfiles(
          linkedinProfiles.map((profile) =>
            profile.id === response.data.id ? response.data : profile
          )
        );
      } else {
        // Add new profile
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/linkedin`,
          newProfile,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setLinkedinProfiles([...linkedinProfiles, response.data]);
      }

      handleModalToggle();
    } catch (err) {
      console.error("Error saving LinkedIn profile:", err.message);
    }
  };

  // Delete a LinkedIn profile
  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this LinkedIn profile?")
    ) {
      try {
        const token = Cookies.get("user-details");
        if (!token) {
          throw new Error("No token found");
        }

        await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/linkedin/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLinkedinProfiles(
          linkedinProfiles.filter((profile) => profile.id !== id)
        );
      } catch (err) {
        console.error("Error deleting LinkedIn profile:", err.message);
      }
    }
  };

  return (
    <div className="bg-white py-6 flex flex-col md:flex-row justify-between items-start border-b border-[#E0E0E0]">
      <h3 className="pl-0 md:pl-6 w-[40%] text-base text-[#56698E] font-[600]">
        LINKEDIN PROFILE
      </h3>
      <div className="w-full">
        {linkedinProfiles.length > 0 ? (
          linkedinProfiles.map((profile) => (
            <div
              key={profile.id}
              className="flex justify-between items-center"
            >
              <p className="text-black font-[600] hover:underline ml-4">
                <a href={profile.url} target="_blank" rel="noopener noreferrer">
                  {profile.name}
                </a>
              </p>
              <div className="flex items-center space-x-3 pr-4">
                {/* Edit Icon */}
                <button
                  className="text-gray-400 hover:text-blue-500"
                  onClick={() => handleModalToggle(profile)}
                >
                  <FiEdit2 size={20} />
                </button>
                {/* Delete Icon */}
                <button
                  className="text-gray-400 hover:text-red-500"
                  onClick={() => handleDelete(profile.id)}
                >
                  <RiDeleteBinLine size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No LinkedIn profiles added yet.</p>
        )}

        {/* Add Button */}
        {linkedinProfiles.length === 0 && (
          <button
            onClick={() => handleModalToggle()}
            className="text-sm text-blue-600 bg-blue-100 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200"
          >
            + Add LinkedIn Profile
          </button>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start justify-center pt-12 z-50">
            <div className="bg-white rounded-lg p-6 w-[90%] max-w-[600px] shadow-lg relative">
              <button
                onClick={handleModalToggle}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                <IoMdClose size={24} />
              </button>
              <h2 className="text-xl font-semibold text-center mb-6">
                {newProfile.id
                  ? "Edit LinkedIn Profile"
                  : "Add LinkedIn Profile"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Profile Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newProfile.name}
                    onChange={handleInputChange}
                    placeholder="Enter profile name"
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="url"
                    className="block text-sm font-medium text-gray-700"
                  >
                    LinkedIn URL
                  </label>
                  <input
                    type="text"
                    id="url"
                    name="url"
                    value={newProfile.url}
                    onChange={handleInputChange}
                    placeholder="Enter LinkedIn profile URL"
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div className="text-right">
                  <button
                    onClick={handleSave}
                    className="w-[174px] bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700"
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
}
