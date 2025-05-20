"use client";
import React, { useState, useEffect } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import Cookies from "js-cookie";

const SkillsSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ title: "", skill: "" });

  // Fetch skills for the logged-in user
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const token = Cookies.get("user-details");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/skills`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSkills(response.data);
      } catch (err) {
        console.error("Error fetching skills:", err.message);
      }
    };

    fetchSkills();
  }, []);

  // Handle modal toggle
  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
      setNewSkill({ title: "", skill: "" });
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSkill((prev) => ({ ...prev, [name]: value }));
  };

  // Add a new skill
  const handleAddSkill = async () => {
    try {
      const token = Cookies.get("user-details");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/skills`,
        { name: newSkill.skill, type: newSkill.title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSkills([...skills, response.data]);
      handleModalToggle();
    } catch (err) {
      console.error("Error adding skill:", err.message);
    }
  };

  // Delete a skill
  const handleDeleteSkill = async (id) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      try {
        const token = Cookies.get("user-details");
        if (!token) {
          throw new Error("No token found");
        }

        await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/skills/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSkills(skills.filter((skill) => skill.id !== id));
      } catch (err) {
        console.error("Error deleting skill:", err.message);
      }
    }
  };

  return (
    <div className="bg-white py-6 flex flex-col md:flex-row justify-between items-start border-b border-[#E0E0E0]">
      <h3 className="w-[40%] md:pl-6 mb-4 text-base text-[#56698E] font-[600]">
        SKILLS
      </h3>
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="flex justify-between items-center border border-gray-200 p-3 rounded-lg"
            >
              <div>
                <p className="text-base font-semibold text-[#56698E]">
                  {skill.name}
                </p>
                <p className="text-sm text-[#A09EA2]">• {skill.type}</p>
              </div>
              <button
                onClick={() => handleDeleteSkill(skill.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <RiDeleteBinLine size={20} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={handleModalToggle}
          className="mt-4 text-sm text-blue-600 bg-blue-100 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200"
        >
          + Add Skills
        </button>
        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start pt-12 justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[90%] max-w-[600px] shadow-lg relative">
              <button
                onClick={handleModalToggle}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                <IoMdClose size={24} />
              </button>
              <h2 className="text-xl font-semibold text-center mb-6">
                Add New Skill
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newSkill.title}
                    onChange={handleInputChange}
                    placeholder="Enter title (e.g., Softskill)"
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="skill"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Add Skill
                  </label>
                  <input
                    type="text"
                    id="skill"
                    name="skill"
                    value={newSkill.skill}
                    onChange={handleInputChange}
                    placeholder="Enter skill name"
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div className="col-span-2 text-right">
                  <button
                    onClick={handleAddSkill}
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

export default SkillsSection;
