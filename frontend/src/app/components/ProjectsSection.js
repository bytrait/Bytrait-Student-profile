"use client";
import React, { useState, useEffect } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiEdit2 } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import Cookies from "js-cookie";

const ProjectsSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectsData, setProjectsData] = useState([]);
  const [newProject, setNewProject] = useState({
    title: "",
    link: "",
    description: "",
    roleAndTech: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);

  // Fetch projects for the logged-in user
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = Cookies.get("user-details");
        if (!token) throw new Error("No token found");

        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProjectsData(response.data);
      } catch (err) {
        console.error("Error fetching projects:", err.message);
      }
    };

    fetchProjects();
  }, []);

  // Handle modal toggle
  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
      setNewProject({ title: "", link: "", description: "", roleAndTech: "" });
      setEditingIndex(null);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  // Save or update project
  const handleSaveProject = async () => {
    try {
      const token = Cookies.get("user-details");
      if (!token) throw new Error("No token found");

      if (
        !newProject.title ||
        !newProject.description ||
        !newProject.roleAndTech
      ) {
        alert("All fields are required");
        return;
      }

      if (editingIndex !== null) {
        // Update existing project
        const updatedProject = { ...projectsData[editingIndex], ...newProject };
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${updatedProject.id}`,
          updatedProject,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const updatedData = projectsData.map((proj, i) =>
          i === editingIndex ? response.data : proj
        );
        setProjectsData(updatedData);
      } else {
        // Add new project
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`,
          newProject,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setProjectsData([...projectsData, response.data]);
      }

      handleModalToggle();
    } catch (err) {
      console.error("Error saving project:", err.message);
    }
  };

  // Delete a project
  const handleDeleteProject = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const token = Cookies.get("user-details");
        if (!token) throw new Error("No token found");

        await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProjectsData(projectsData.filter((proj) => proj.id !== id));
      } catch (err) {
        console.error("Error deleting project:", err.message);
      }
    }
  };

  // Edit a project
  const handleEditProject = (index) => {
    const project = projectsData[index];
    setNewProject({
      title: project.title,
      link: project.link || "",
      description: project.description,
      roleAndTech: project.role_and_tech || "", // Use the correct backend field name
    });
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white py-6 flex flex-col md:flex-row justify-between items-start border-b border-[#E0E0E0]">
      <h3 className="md:w-[40%] md:pl-6 text-base text-[#56698E] font-[600] mb-4 md:mb-0">
        PROJECTS & ACADEMIC CONTRIBUTIONS
      </h3>
      <div className="w-full">
        <ul className="space-y-4">
          {projectsData.map((project) => (
            <li
              key={project.id}
              className="p-4 border border-gray-200 rounded-lg flex justify-between items-start"
            >
              <div>
                <p className="text-base font-semibold text-[#56698E]">
                  {project.title}
                </p>
                <p className="text-sm text-gray-500 py-1">
                  {project.description} ({project.role_and_tech})
                </p>
                {project.link && (
                  <p className="text-sm text-blue-500 hover:underline">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {project.link}
                    </a>
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() =>
                    handleEditProject(projectsData.indexOf(project))
                  }
                  className="text-gray-400 hover:text-blue-500"
                >
                  <FiEdit2 size={18} />
                </button>
                <button
                  onClick={() => handleDeleteProject(project.id)}
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
          + Add Projects & Academic Contributions
        </button>
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
                {editingIndex !== null ? "Edit Project" : "Add New Project"}
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
                    value={newProject.title}
                    onChange={handleInputChange}
                    placeholder="Enter project title"
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="link"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Project Link
                  </label>
                  <input
                    type="url"
                    id="link"
                    name="link"
                    value={newProject.link}
                    onChange={handleInputChange}
                    placeholder="Enter project link"
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Project Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={newProject.description}
                    onChange={handleInputChange}
                    placeholder="Describe your project"
                    rows="3"
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="roleAndTech"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Role & Technology Used
                  </label>
                  <input
                    type="text"
                    id="roleAndTech"
                    name="roleAndTech"
                    value={newProject.roleAndTech}
                    onChange={handleInputChange}
                    placeholder="Enter role and technologies used"
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div className="col-span-2 text-right">
                  <button
                    onClick={handleSaveProject}
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

export default ProjectsSection;
