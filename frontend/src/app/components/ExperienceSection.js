"use client";
import React, { useState, useEffect } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiEdit2 } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import Cookies from "js-cookie";

const ExperienceSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [experienceData, setExperienceData] = useState([]);
  const [newExperience, setNewExperience] = useState({
    designation: "",
    profile: "",
    organization: "",
    location: "",
    startDate: "",
    endDate: "",
    roleType: "Job",
  });
  const [editingIndex, setEditingIndex] = useState(null);

  // Fetch experiences on mount
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const token = Cookies.get("user-details");
        if (!token) throw new Error("No token found");

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/experiences`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setExperienceData(response.data);
      } catch (err) {
        console.error("Error fetching experiences:", err.message);
      }
    };

    fetchExperiences();
  }, []);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
      setNewExperience({
        designation: "",
        profile: "",
        organization: "",
        location: "",
        startDate: "",
        endDate: "",
        roleType: "Job",
      });
      setEditingIndex(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExperience((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveExperience = async () => {
    try {
      const token = Cookies.get("user-details");
      if (!token) throw new Error("No token found");

      const requiredFields = [
        "designation",
        "profile",
        "organization",
        "location",
        "startDate",
        "endDate",
        "roleType",
      ];
      if (requiredFields.some((field) => !newExperience[field])) {
        alert("All fields are required");
        return;
      }

      if (editingIndex !== null) {
        // Update existing experience
        const updatedExperience = {
          ...experienceData[editingIndex],
          ...newExperience,
        };
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/experiences/${updatedExperience.id}`,
          updatedExperience,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const updatedData = experienceData.map((exp, i) =>
          i === editingIndex ? response.data : exp
        );
        setExperienceData(updatedData);
      } else {
        // Add new experience
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/experiences`,
          newExperience,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setExperienceData((prev) => [...prev, response.data]);
      }

      handleModalToggle();
    } catch (err) {
      console.error("Error saving experience:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
    }
  };

  const handleEditExperience = (index) => {
    const experience = experienceData[index];
    setNewExperience({
      designation: experience.designation,
      profile: experience.profile,
      organization: experience.organization,
      location: experience.location,
      startDate: experience.start_date,
      endDate: experience.end_date,
      roleType: experience.role_type,
    });
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleDeleteExperience = async (id) => {
    if (window.confirm("Are you sure you want to delete this experience?")) {
      try {
        const token = Cookies.get("user-details");
        if (!token) throw new Error("No token found");

        await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/experiences/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setExperienceData(experienceData.filter((exp) => exp.id !== id));
      } catch (err) {
        console.error("Error deleting experience:", err.message);
      }
    }
  };

  return (
    <div className="bg-white py-6 flex flex-col md:flex-row justify-between items-start border-b border-[#E0E0E0]">
      <h3 className="md:w-[40%] md:pl-6 text-base text-[#56698E] font-[600] mb-4 md:mb-0">
        INTERNSHIP / WORK EXPERIENCE
      </h3>
      <div className="w-full">
        <ul className="space-y-4">
          {experienceData.map((item, index) => (
            <li
              key={item.id}
              className="p-4 border border-gray-200 rounded-lg flex justify-between items-start"
            >
              <div>
                <p className="text-base font-semibold text-[#56698E]">
                  {item.designation} -{" "}
                  <span className="font-normal">{item.organization}</span>
                </p>
                <p className="text-sm text-[#A09EA2]">
                  {item.profile} | {item.location} | {item.start_date} -{" "}
                  {item.end_date} | {item.role_type}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleEditExperience(index)}
                  className="text-gray-400 hover:text-blue-500"
                >
                  <FiEdit2 size={18} />
                </button>
                <button
                  onClick={() => handleDeleteExperience(item.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <RiDeleteBinLine size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <button
          onClick={handleModalToggle}
          className="mt-6 text-sm text-blue-600 bg-blue-100 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200"
        >
          + Add Internship / Work
        </button>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[90%] max-w-[600px] shadow-lg relative">
              <button
                onClick={handleModalToggle}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                <IoMdClose size={24} />
              </button>
              <h2 className="text-xl font-semibold text-center mb-6">
                {editingIndex !== null
                  ? "Edit Experience"
                  : "Add New Internship / Work Experience"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="designation"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Designation
                  </label>
                  <input
                    type="text"
                    id="designation"
                    name="designation"
                    value={newExperience.designation}
                    onChange={handleInputChange}
                    placeholder="Enter job title (e.g., UI/UX Designer)"
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="profile"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Profile
                  </label>
                  <input
                    type="text"
                    id="profile"
                    name="profile"
                    value={newExperience.profile}
                    onChange={handleInputChange}
                    placeholder="Enter profile (e.g., Product Design)"
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="organization"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Organization
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={newExperience.organization}
                    onChange={handleInputChange}
                    placeholder="Enter organization name"
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
                    value={newExperience.location}
                    onChange={handleInputChange}
                    placeholder="Enter location (e.g., Remote, New York, USA)"
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Start Date
                    </label>
                    <input
                      type="text"
                      id="startDate"
                      name="startDate"
                      value={newExperience.startDate}
                      onChange={handleInputChange}
                      placeholder="Enter start date (e.g., Oct 2023)"
                      className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      End Date
                    </label>
                    <input
                      type="text"
                      id="endDate"
                      name="endDate"
                      value={newExperience.endDate}
                      onChange={handleInputChange}
                      placeholder="Enter end date (e.g., Present)"
                      className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="roleType"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Role Type
                  </label>
                  <select
                    id="roleType"
                    name="roleType"
                    value={newExperience.roleType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="Job">Job</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div className="col-span-2 text-right">
                  <button
                    onClick={handleSaveExperience}
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
};

export default ExperienceSection;
