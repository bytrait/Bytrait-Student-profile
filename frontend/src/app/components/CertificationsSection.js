"use client";
import React, { useState, useEffect } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiEdit2 } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import Cookies from "js-cookie";

const CertificationsSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [certificationsData, setCertificationsData] = useState([]);
  const [newCertificate, setNewCertificate] = useState({
    title: "",
    institute: "",
    file: null,
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [fileError, setFileError] = useState("");
  const [isSaving, setIsSaving] = useState(false); 

  // Fetch certifications for the logged-in user
  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const token = Cookies.get("user-details");
        if (!token) throw new Error("No token found");

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/certifications`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setCertificationsData(response.data);
      } catch (err) {
        console.error("Error fetching certifications:", err.message);
      }
    };

    fetchCertifications();
  }, []);

  // Handle modal toggle
  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
      setNewCertificate({ title: "", institute: "", file: null });
      setEditingIndex(null);
      setFileError("");
      setIsSaving(false); // Reset saving state when opening modal
    }
  };

  // Handle input changes (text and file)
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file" && files[0]) {
      const file = files[0];
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        setFileError("Only PNG, JPG, or JPEG files are allowed.");
        setNewCertificate((prev) => ({ ...prev, file: null }));
      } else {
        setFileError("");
        setNewCertificate((prev) => ({ ...prev, file }));
      }
    } else {
      setNewCertificate((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Add or update a certification
  const handleSaveCertificate = async () => {
    if (newCertificate.file && fileError) {
      alert("Please upload a valid image file before saving.");
      return;
    }

    setIsSaving(true); // Disable button and change text/color
    try {
      const token = Cookies.get("user-details");
      if (!token) throw new Error("No token found");

      const formData = new FormData();
      formData.append("title", newCertificate.title);
      formData.append("institute", newCertificate.institute);
      if (newCertificate.file) {
        formData.append("file", newCertificate.file);
      }

      if (editingIndex !== null) {
        // Update existing certification
        const updatedCert = certificationsData[editingIndex];
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/certifications/${updatedCert.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const updatedData = certificationsData.map((cert, i) =>
          i === editingIndex ? response.data : cert
        );
        setCertificationsData(updatedData);
      } else {
        // Add new certification
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/certifications`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setCertificationsData([...certificationsData, response.data]);
      }

      handleModalToggle();
    } catch (err) {
      console.error("Error saving certification:", err.message);
    } finally {
      setIsSaving(false); // Re-enable button and reset text/color
    }
  };

  // Delete a certification
  const handleDeleteCertificate = async (id) => {
    if (window.confirm("Are you sure you want to delete this certification?")) {
      try {
        const token = Cookies.get("user-details");
        if (!token) throw new Error("No token found");

        await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/certifications/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCertificationsData(
          certificationsData.filter((cert) => cert.id !== id)
        );
      } catch (err) {
        console.error("Error deleting certification:", err.message);
      }
    }
  };

  // Edit a certification
  const handleEditCertificate = (index) => {
    const certificate = certificationsData[index];
    setNewCertificate({
      title: certificate.title,
      institute: certificate.institute,
      file: null,
    });
    setEditingIndex(index);
    setIsModalOpen(true);
    setFileError("");
    setIsSaving(false); // Reset saving state when editing
  };

  return (
    <div className="bg-white py-6 flex flex-col md:flex-row justify-between items-start border-b border-[#E0E0E0]">
      <h3 className="md:w-[40%] md:pl-6 text-base text-[#56698E] font-[600] mb-4 md:mb-0">
        CERTIFICATIONS ACHIEVED
      </h3>
      <div className="w-full">
        <ul className="space-y-4">
          {certificationsData.map((item, index) => (
            
            <li
              key={item.id}
              className="p-4 border border-gray-200 rounded-lg flex justify-between items-start"
            >

              <div>
                <p className="text-base font-semibold text-[#56698E]">
                  {item.title}
                </p>
                <p className="text-sm text-[#A09EA2]">{item.institute}</p>
                {item.file_url && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      <a
                        href={item.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Certificate
                      </a>
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleEditCertificate(index)}
                  className="text-gray-400 hover:text-blue-500"
                >
                  <FiEdit2 size={18} />
                </button>
                <button
                  onClick={() => handleDeleteCertificate(item.id)}
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
          className="mt-4 text-sm text-blue-600 bg-blue-100 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200"
        >
          + Add Certificate
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
                {editingIndex !== null
                  ? "Edit Certificate"
                  : "Add New Certificate"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name of Certificate
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newCertificate.title}
                    onChange={handleInputChange}
                    placeholder="Enter certificate name"
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="institute"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name of Institution/College/Place
                  </label>
                  <input
                    type="text"
                    id="institute"
                    name="institute"
                    value={newCertificate.institute}
                    onChange={handleInputChange}
                    placeholder="Enter institution/college/place"
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="file"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Upload Certificate (PNG/JPG Only)
                  </label>
                  <input
                    type="file"
                    id="file"
                    name="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                  {fileError && (
                    <p className="text-sm text-red-500 mt-1">{fileError}</p>
                  )}
                </div>
                <div className="col-span-2 text-right">
                  <button
                    onClick={handleSaveCertificate}
                    disabled={isSaving} // Disable button when saving
                    className={`w-[174px] py-2 px-4 rounded-lg font-semibold text-white ${
                      isSaving
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
      </div>
    </div>
  );
};

export default CertificationsSection;
