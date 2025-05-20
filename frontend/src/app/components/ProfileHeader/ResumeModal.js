"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { IoMdClose } from "react-icons/io";
import { MdEmail, MdPhone } from "react-icons/md";
import { FaLinkedin } from "react-icons/fa";
import Image from "next/image";

const ResumeModal = ({ onClose }) => {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const resumeRef = useRef();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = Cookies.get("user-details");
        if (!token) throw new Error("No authentication token found");

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/user-info`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.data || !response.data.user) {
          throw new Error("Invalid response data from server");
        }

        setResumeData(response.data);
      } catch (err) {
        console.error("Error fetching user information:", err.message);
        alert("Failed to retrieve user information. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handlePrint = () => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();

    const resumeContent = resumeRef.current.outerHTML;
    const styles = `
      <style>
        body {
          margin: 0;
          padding: 0;
          width: 8.5in;
          height: 11in;
          font-family: 'Arial', sans-serif;
          color: #1f2937; /* gray-900 */
          background: #ffffff;
        }
        .space-y-6 > * + * {
          margin-top: 1.5rem; /* Reduced from 2rem for tighter spacing */
        }
        .flex {
          display: flex;
        }
        .items-center {
          align-items: center;
        }
        .border-b-2 {
          border-bottom: 2px solid #1f2937; /* gray-800 */
        }
        .pb-3 {
          padding-bottom: 0.75rem; /* Reduced from 1rem */
        }
        .mr-6 {
          margin-right: 1.5rem;
        }
        .flex-1 {
          flex: 1;
        }
        .text-3xl {
          font-size: 1.875rem;
          line-height: 2rem; /* Tightened line height */
        }
        .font-bold {
          font-weight: 700;
        }
        .mt-2 {
          margin-top: 0.5rem;
        }
        .space-y-1 > * + * {
          margin-top: 0.25rem; /* Tighter spacing for contact info */
        }
        .text-sm {
          font-size: 0.875rem;
          line-height: 1.25rem; /* Consistent line height */
        }
        .text-gray-700 {
          color: #374151;
        }
        .text-gray-800 {
          color: #1f2937;
        }
        .w-4 {
          width: 1rem;
        }
        .h-4 {
          height: 1rem;
        }
        .gap-2 {
          gap: 0.5rem;
        }
        .text-xl {
          font-size: 1.25rem;
          line-height: 1.5rem; /* Tightened line height */
        }
        .font-semibold {
          font-weight: 600;
        }
        .uppercase {
          text-transform: uppercase;
        }
        .bg-gray-100 {
          background-color: #f3f4f6;
        }
        .px-3 {
          padding-left: 0.75rem;
          padding-right: 0.75rem;
        }
        .py-1 {
          padding-top: 0.25rem;
          padding-bottom: 0.25rem;
        }
        .mb-2 {
          margin-bottom: 0.5rem; /* Reduced from 0.75rem */
        }
        .mb-3 {
          margin-bottom: 0.75rem; /* Reduced from 1rem */
        }
        .text-gray-600 {
          color: #4b5563;
        }
        .italic {
          font-style: italic;
        }
        .grid {
          display: grid;
        }
        .grid-cols-2 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .w-1\\.5 {
          width: 0.375rem;
        }
        .h-1\\.5 {
          height: 0.375rem;
        }
        .rounded-full {
          border-radius: 9999px;
        }
        .bg-gray-800 {
          background-color: #1f2937;
        }
        .flex-shrink-0 {
          flex-shrink: 0;
        }
        .flex-wrap {
          flex-wrap: wrap;
        }
        .bg-gray-200 {
          background-color: #e5e7eb;
        }
        .mt-6 {
          margin-top: 1.5rem; /* Reduced from 2rem */
        }
        .text-xs {
          font-size: 0.75rem;
          line-height: 1rem; /* Consistent line height */
        }
        .text-gray-500 {
          color: #6b7280;
        }
        .border-t {
          border-top: 1px solid #e5e7eb; /* gray-200 */
        }
        .pt-2 {
          padding-top: 0.5rem;
        }
        a {
          color: #1f2937;
          text-decoration: none;
        }
        a:hover {
          color: #4b5563;
          text-decoration: underline;
        }
        /* Education-specific styling */
        .education-section {
          border-left: 4px solid #1f2937; /* gray-800 */
          padding-left: 1rem;
          background-color: #f9fafb; /* light gray */
        }
        .education-item {
          padding: 0.5rem 0;
          border-bottom: 1px solid #e5e7eb; /* gray-200 */
        }
        .education-item:last-child {
          border-bottom: none;
        }
        @page {
          size: letter;
          margin-top: 0.2in;
          margin-bottom: 0.2in;
          margin-left: 0.5in;
          margin-right: 0.5in;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      </style>
    `;

    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          ${styles}
        </head>
        <body>
          ${resumeContent}
        </body>
      </html>
    `);
    doc.close();

    iframe.contentWindow.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      iframe.contentWindow.onafterprint = () => {
        document.body.removeChild(iframe);
      };
    };
  };

  const profilePhotoSrc = resumeData?.user?.profile_photo
    ? resumeData.user.profile_photo.startsWith("http")
      ? resumeData.user.profile_photo
      : `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${resumeData.user.profile_photo}`
    : "/img/default-avatar.png";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[95%] max-w-[900px] max-h-[95vh] overflow-y-auto shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
        >
          <IoMdClose size={24} />
        </button>
        {!loading && resumeData && (
          <button
            onClick={handlePrint}
            className="absolute top-4 right-16 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all"
          >
            Print Resume
          </button>
        )}

        <div
          ref={resumeRef}
          className="w-[8.5in] mx-auto bg-white text-gray-900 font-sans"
          style={{ minHeight: "11in", padding: "0" }}
        >
          {loading ? (
            <p className="text-center text-gray-600 text-lg">Loading...</p>
          ) : resumeData ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center border-b-2 border-gray-800 pb-3">
                <Image
                  src={profilePhotoSrc}
                  width={100}
                  height={100}
                  alt="Profile Photo"
                  className="rounded-full border-2 border-gray-800 object-cover mr-6"
                />
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {resumeData.user?.name || "Anonymous"}
                  </h1>
                  <div className="mt-2 space-y-1 text-sm text-gray-700">
                    <p className="flex items-center gap-2">
                      <MdEmail className="text-gray-800 w-4 h-4" />
                      <span>{resumeData.user?.username || "N/A"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <MdPhone className="text-gray-800 w-4 h-4" />
                      <span>{resumeData.user?.mobile || "N/A"}</span>
                    </p>
                    {resumeData.linkedinProfiles?.length > 0 && (
                      <p className="flex items-center gap-2">
                        <FaLinkedin className="text-gray-800 w-4 h-4" />
                        <a
                          href={resumeData.linkedinProfiles[0].url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-800 hover:text-gray-600 hover:underline"
                        >
                          {resumeData.linkedinProfiles[0].name ||
                            "LinkedIn Profile"}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 uppercase bg-gray-100 px-3 py-1 mb-2">
                  Professional Summary
                </h2>
                <p className="text-sm text-gray-700">
                  {resumeData.user?.location
                    ? `Based in ${resumeData.user.location}. `
                    : ""}
                  A skilled professional with expertise in{" "}
                  {resumeData.skills?.length > 0
                    ? resumeData.skills.map((s) => s.name).join(", ")
                    : "various fields"}
                  , showcasing strong adaptability and commitment to excellence.
                </p>
              </section>

              {/* Education - Enhanced Design */}
              {resumeData.education?.length > 0 && (
                <section className="education-section">
                  <h2 className="text-xl font-semibold text-gray-900 uppercase bg-gray-100 px-3 py-1 mb-2">
                    Education
                  </h2>
                  {resumeData.education.map((edu, index) => (
                    <div
                      key={index}
                      className="education-item text-sm text-gray-700"
                    >
                      <p className="font-semibold text-gray-900">{edu.title}</p>
                      <p>{edu.school}</p>
                      <p className="text-gray-600 italic">
                        {edu.stream} | {edu.board} | {edu.start_year} -{" "}
                        {edu.end_year} | CGPA: {edu.cgpa}
                      </p>
                      {edu.website && (
                        <a
                          href={edu.website}
                          target="_blank"
                          className="text-gray-800 hover:text-gray-600 hover:underline"
                        >
                          Website
                        </a>
                      )}
                    </div>
                  ))}
                </section>
              )}

              {/* Skills */}
              {resumeData.skills?.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 uppercase bg-gray-100 px-3 py-1 mb-2">
                    Technical Skills
                  </h2>
                  <ul className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                    {resumeData.skills.map((skill, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-gray-800 rounded-full flex-shrink-0"></span>
                        <span>
                          {skill.name}{" "}
                          <span className="text-gray-600">({skill.type})</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Certifications */}
              {resumeData.certifications?.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 uppercase bg-gray-100 px-3 py-1 mb-2">
                    Certifications
                  </h2>
                  {resumeData.certifications.map((cert, index) => (
                    <div key={index} className="mb-3 text-sm text-gray-700">
                      <p className="font-semibold text-gray-900">
                        {cert.title}
                      </p>
                      <p>{cert.institute}</p>
                      {cert.file_url && (
                        <a
                          href={cert.file_url}
                          target="_blank"
                          className="text-gray-800 hover:text-gray-600 hover:underline"
                        >
                          View Certificate
                        </a>
                      )}
                    </div>
                  ))}
                </section>
              )}

              {/* Experience */}
              {resumeData.experiences?.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 uppercase bg-gray-100 px-3 py-1 mb-2">
                    Professional Experience
                  </h2>
                  {resumeData.experiences.map((exp, index) => (
                    <div key={index} className="mb-3 text-sm text-gray-700">
                      <p className="font-semibold text-gray-900">
                        {exp.designation}
                      </p>
                      <p>
                        {exp.organization} - {exp.location}
                      </p>
                      <p className="text-gray-600 italic">
                        {exp.profile} | {exp.role_type} | {exp.start_date} -{" "}
                        {exp.end_date}
                      </p>
                    </div>
                  ))}
                </section>
              )}

              {/* Projects */}
              {resumeData.projects?.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 uppercase bg-gray-100 px-3 py-1 mb-2">
                    Key Projects
                  </h2>
                  {resumeData.projects.map((project, index) => (
                    <div key={index} className="mb-3 text-sm text-gray-700">
                      <p className="font-semibold text-gray-900">
                        {project.title}
                      </p>
                      <p>{project.description}</p>
                      <p className="text-gray-600 italic">
                        {project.role_and_tech}
                      </p>
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          className="text-gray-800 hover:text-gray-600 hover:underline"
                        >
                          View Project
                        </a>
                      )}
                    </div>
                  ))}
                </section>
              )}

              {/* Hobbies */}
              {resumeData.hobbies?.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 uppercase bg-gray-100 px-3 py-1 mb-2">
                    Hobbies & Interests
                  </h2>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-700">
                    {resumeData.hobbies.map((hobby, index) => (
                      <span
                        key={index}
                        className="bg-gray-200 px-3 py-1 rounded-full"
                      >
                        {hobby.name}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <p className="text-center text-red-600 text-lg">
              Unable to load resume data
            </p>
          )}
          <footer className="mt-6 text-center text-xs text-gray-500 border-t border-gray-200 pt-2">
            Generated on {new Date().toLocaleDateString()} | Powered by ByTrait
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;
