"use client";
import React, { useState, useEffect } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiEdit2, FiExternalLink } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import Cookies from "js-cookie";
import EducationForm from "./EducationForm";

export default function EducationSection() {
  const [educationData, setEducationData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEducationType, setSelectedEducationType] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  // Fetch education data
  useEffect(() => {
    const fetchEducationData = async () => {
      try {
        const token = Cookies.get("user-details");
        if (!token) throw new Error("No token found");

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/education`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setEducationData(response.data);
      } catch (err) {
        console.error("Error fetching education data:", err.message);
      }
    };

    fetchEducationData();
  }, []);

  const hasEducationType = (type) =>
    educationData.some((edu) => edu.title === type);
  const allEducationTypes = [
    "Secondary (X)",
    "Senior Secondary (XII)",
    "Diploma",
    "Graduation / Post Graduation",
    "PhD",
  ];
  const allAdded = allEducationTypes.every((type) => hasEducationType(type));

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
    setSelectedEducationType("");
    setEditingIndex(null);
  };

  const handleSave = async (newData) => {
    try {
      const token = Cookies.get("user-details");
      if (!token) throw new Error("No token found");

      if (editingIndex !== null) {
        const updatedEntry = { ...educationData[editingIndex], ...newData };
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/education/${updatedEntry.id}`,
          updatedEntry,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const updatedData = educationData.map((edu, i) =>
          i === editingIndex ? response.data : edu
        );
        setEducationData(updatedData);
      } else {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/education`,
          { title: selectedEducationType, ...newData },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setEducationData([...educationData, response.data]);
      }

      handleModalToggle();
    } catch (err) {
      console.error("Error saving education data:", err.message);
    }
  };

  const handleDelete = async (index) => {
    if (
      window.confirm("Are you sure you want to delete this education entry?")
    ) {
      try {
        const token = Cookies.get("user-details");
        if (!token) throw new Error("No token found");

        const entryId = educationData[index].id;
        await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/education/${entryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEducationData(educationData.filter((_, i) => i !== index));
      } catch (err) {
        console.error("Error deleting education data:", err.message);
      }
    }
  };

  const handleEdit = (index) => {
    const education = educationData[index];
    setSelectedEducationType(education.title);
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white py-6 flex flex-col md:flex-row justify-between items-start border-b border-[#E0E0E0]">
      <h3 className="w-[40%] md:pl-6 text-base text-[#56698E] font-[600] mb-4 md:mb-0">
        EDUCATION
      </h3>
      <div className="w-full">
        <ul className="space-y-4">
          {educationData.map((item, index) => (
            <li
              key={item.id}
              className="p-4 border border-gray-200 rounded-lg flex justify-between items-start"
            >
              <div className="flex gap-2 flex-col">
                <p className="text-base font-semibold text-[#56698E]">
                  {item.website ? (
                    <a
                      href={item.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#56698E] hover:text-blue-600 hover:underline transition-colors duration-200"
                    >
                      {item.school}
                      <FiExternalLink
                        size={16}
                        className="text-[#56698E] hover:text-blue-600"
                      />
                    </a>
                  ) : (
                    item.school
                  )}
                </p>
                <div className="flex gap-2">
                  <p className="text-sm text-[#000]">{item.title},</p>
                  <p className="text-sm text-[#000]">{item.stream}</p>
                </div>
                <p className="text-sm text-[#A09EA2]">
                  {item.start_year} - {item.end_year}
                </p>
                <p className="text-sm text-[#000]">Grade: {item.cgpa}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleEdit(index)}
                  className="text-gray-400 hover:text-blue-500"
                >
                  <FiEdit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <RiDeleteBinLine size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>
        {!allAdded && (
          <button
            onClick={handleModalToggle}
            className="mt-4 text-sm text-blue-600 bg-blue-100 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200"
          >
            + Add Education
          </button>
        )}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start pt-16 justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[90%] max-w-[900px] shadow-lg relative">
              <button
                onClick={handleModalToggle}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                <IoMdClose size={24} />
              </button>
              {!selectedEducationType ? (
                <>
                  <h2 className="text-xl font-semibold text-center mb-6">
                    Education
                  </h2>
                  <div className="flex flex-wrap gap-4 justify-center">
                    {!hasEducationType("Secondary (X)") && (
                      <button
                        onClick={() =>
                          setSelectedEducationType("Secondary (X)")
                        }
                        className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200"
                      >
                        + Add Secondary (X)
                      </button>
                    )}
                    {!hasEducationType("Senior Secondary (XII)") && (
                      <button
                        onClick={() =>
                          setSelectedEducationType("Senior Secondary (XII)")
                        }
                        className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200"
                      >
                        + Add Senior Secondary (XII)
                      </button>
                    )}
                    {!hasEducationType("Diploma") && (
                      <button
                        onClick={() => setSelectedEducationType("Diploma")}
                        className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200"
                      >
                        + Add Diploma
                      </button>
                    )}
                    {!hasEducationType("Graduation / Post Graduation") && (
                      <button
                        onClick={() =>
                          setSelectedEducationType(
                            "Graduation / Post Graduation"
                          )
                        }
                        className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200"
                      >
                        + Add Graduation / Post Graduation
                      </button>
                    )}
                    {!hasEducationType("PhD") && (
                      <button
                        onClick={() => setSelectedEducationType("PhD")}
                        className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200"
                      >
                        + Add PhD
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <EducationForm
                  educationType={selectedEducationType}
                  onClose={handleModalToggle}
                  onSave={handleSave}
                  initialData={
                    editingIndex !== null ? educationData[editingIndex] : null
                  }
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
