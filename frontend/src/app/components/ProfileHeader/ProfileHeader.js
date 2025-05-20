"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { FiEdit2 } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import ResumeModal from "./ResumeModal"; // Import the ResumeModal component

const ProfileHeader = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newProfilePhoto, setNewProfilePhoto] = useState(null);
  const [fileError, setFileError] = useState("");
  const [isSaving, setIsSaving] = useState(false); // State to track saving status
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false); // State for resume modal
  const [isEditInfoModalOpen, setIsEditInfoModalOpen] = useState(false); // State for Edit Info modal
  const [editInfo, setEditInfo] = useState({
    name: "",
    username: "",
    mobile: "",
    location: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("user-details");
        if (!token) throw new Error("No token found");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/user`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message || "An error occurred while fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!file || !validTypes.includes(file.type)) {
      setFileError("Only PNG, JPG, or JPEG files are allowed.");
      setNewProfilePhoto(null);
    } else {
      setFileError("");
      setNewProfilePhoto(file);
    }
  };

  // Handle profile photo update
  const handleUpdateProfilePhoto = async () => {
    if (!newProfilePhoto) {
      alert("Please select a valid image file.");
      return;
    }

    setIsSaving(true); // Disable button and change text/color
    try {
      const token = Cookies.get("user-details");
      if (!token) throw new Error("No token found");

      const formData = new FormData();
      formData.append("profile_photo", newProfilePhoto);

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUserData(response.data); // Update user data with new profile photo URL
      setIsEditModalOpen(false); // Close modal
      setNewProfilePhoto(null); // Reset file input
    } catch (err) {
      setError(err.message || "Failed to update profile photo");
    } finally {
      setIsSaving(false); // Re-enable button and reset text/color
    }
  };

  // Open Edit Info Modal with prefilled data
  const handleOpenEditInfoModal = () => {
    setEditInfo({
      name: userData?.name || "",
      username: userData?.username || "",
      mobile: userData?.mobile || "",
      location: userData?.location || "",
    });


    setIsEditInfoModalOpen(true);

  };

  // Handle input changes in the Edit Info form
  const handleEditInfoChange = (e) => {
    const { name, value } = e.target;
    setEditInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission to update user info
  const handleUpdateInfo = async () => {
    try {
      const token = Cookies.get("user-details");
      if (!token) throw new Error("No token found");

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/update`,
        editInfo,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUserData(response.data); // Update user data with new info
      setIsEditInfoModalOpen(false); // Close modal
    } catch (err) {
      setError(err.message || "Failed to update user info");
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const profilePhotoSrc = userData?.profile_photo
    ? userData.profile_photo.startsWith("http")
      ? userData.profile_photo // Use Cloudinary URL
      : `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${userData.profile_photo}` // Fallback for local uploads
    : "/img/Avatar.png"; // Default avatar

  return (
    <div className="bg-white p-6 rounded-t-lg border-b border-[#E0E0E0]">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <Image
              src={profilePhotoSrc}
              width={110}
              height={110}
              alt="Profile"
              className="w-[110px] h-[110px] rounded-[100%] object-cover"
            />
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            >
              <FiEdit2 size={16} />
            </button>
          </div>
          <div>
            <h2 className="text-[27.5px] font-[600]">
              {userData?.name || "Unknown"}
            </h2>
            <p className="text-[13.1px] text-[#56698E] font-[400]">
              {userData?.username || "Email not available"}
            </p>
            <p className="text-[13.1px] text-[#56698E] font-[400]">
              {userData?.mobile || "Mobile number not available"}
            </p>
            <p className="text-[13.1px] text-[#56698E] font-[400]">
              {userData?.location || "Location not available"}
            </p>
          </div>
          <button
            onClick={handleOpenEditInfoModal}
            className="text-sm text-blue-600 bg-blue-100 px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 hover:bg-blue-200"
          >
            <FiEdit2 size={16} />
            <span>Edit Info</span>
          </button>
        </div>

        {/* View Resume Button */}
        <button
          onClick={() => setIsResumeModalOpen(true)}
          className="text-sm text-blue-600 bg-blue-100 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200"
        >
          View Resume
        </button>
      </div>

      {/* Edit Profile Photo Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-[400px] shadow-lg relative">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <IoMdClose size={24} />
            </button>
            <h2 className="text-xl font-semibold text-center mb-6">
              Update Profile Photo
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="profile_photo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Upload New Photo (PNG/JPG Only)
                </label>
                <input
                  type="file"
                  id="profile_photo"
                  name="profile_photo"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleFileChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                />
                {fileError && (
                  <p className="text-sm text-red-500 mt-1">{fileError}</p>
                )}
              </div>
              <div className="text-right">
                <button
                  onClick={handleUpdateProfilePhoto}
                  disabled={isSaving} // Disable button when saving
                  className={`py-2 px-4 rounded-lg font-semibold text-white ${isSaving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                  {isSaving ? "Saving" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Info Modal */}
      {isEditInfoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-[400px] shadow-lg relative">
            <button
              onClick={() => setIsEditInfoModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <IoMdClose size={24} />
            </button>
            <h2 className="text-xl font-semibold text-center mb-6">
              Edit Info
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editInfo.name}
                  onChange={handleEditInfoChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={editInfo.username}
                  onChange={handleEditInfoChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label
                  htmlFor="mobile"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mobile
                </label>
                <input
                  type="text"
                  id="mobile"
                  name="mobile"
                  value={editInfo.mobile}
                  onChange={handleEditInfoChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={editInfo.location}
                  onChange={handleEditInfoChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div className="text-right">
                <button
                  onClick={handleUpdateInfo}
                  className="py-2 px-4 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resume Modal */}
      {isResumeModalOpen && (
        <ResumeModal
          userData={userData}
          onClose={() => setIsResumeModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProfileHeader;
