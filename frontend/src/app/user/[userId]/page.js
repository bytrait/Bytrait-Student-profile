"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";

export default function UserProfileView() {
  const { userId } = useParams();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
      
        // Use the endpoint that returns the full resume details
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/user-info/${userId}`,
        );
        setResumeData(response.data);
      } catch (err) {
        console.error("Error fetching resume data:", err.message);
      } finally {
        setLoading(false);
      }
    };

    // In this view, we use the logged-in user's resume data  
    fetchResumeData();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (!resumeData) return <p>User not found.</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow rounded-lg p-6">
        {/* Profile Header */}
        <div className="flex items-center space-x-4 border-b pb-4 mb-4">
          <img
            src={resumeData.user?.profile_photo || "/default-profile.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold">
              {resumeData.user?.name || "Anonymous"}
            </h1>
            <p className="text-gray-600">{resumeData.user?.username || "N/A"}</p>
            <p className="text-gray-600">
              {resumeData.user?.mobile || "N/A"}
            </p>
          </div>
        </div>

        {/* Professional Summary */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 uppercase bg-gray-100 px-3 py-1">
            Professional Summary
          </h2>
          <p className="text-gray-700">
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

        {/* LinkedIn Profiles */}
        {resumeData.linkedinProfiles?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2 uppercase bg-gray-100 px-3 py-1">
              LinkedIn Profiles
            </h2>
            <ul>
              {resumeData.linkedinProfiles.map((profile) => (
                <li key={profile.id} className="mb-1">
                  <a
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {profile.name || profile.url}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Education */}
        {resumeData.education?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2 uppercase bg-gray-100 px-3 py-1">
              Education
            </h2>
            <ul>
              {resumeData.education.map((edu) => (
                <li key={edu.id} className="mb-2">
                  <p className="font-semibold">{edu.title}</p>
                  <p className="text-gray-600">
                    {edu.school} ({edu.start_year} - {edu.end_year})
                  </p>
                  <p className="text-gray-600">CGPA: {edu.cgpa}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Skills */}
        {resumeData.skills?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2 uppercase bg-gray-100 px-3 py-1">
              Skills
            </h2>
            <ul className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill) => (
                <li
                  key={skill.id}
                  className="bg-blue-100 px-3 py-1 rounded-full text-blue-700"
                >
                  {skill.name}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Certifications */}
        {resumeData.certifications?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2 uppercase bg-gray-100 px-3 py-1">
              Certifications
            </h2>
            <ul>
              {resumeData.certifications.map((cert) => (
                <li key={cert.id} className="mb-2">
                  <p className="font-semibold">{cert.title}</p>
                  <p className="text-gray-600">{cert.institute}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Experiences */}
        {resumeData.experiences?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2 uppercase bg-gray-100 px-3 py-1">
              Experiences
            </h2>
            <ul>
              {resumeData.experiences.map((exp) => (
                <li key={exp.id} className="mb-2">
                  <p className="font-semibold">
                    {exp.designation} at {exp.organization}
                  </p>
                  <p className="text-gray-600">
                    {exp.start_date} - {exp.end_date || "Present"}
                  </p>
                  <p className="text-gray-600">{exp.location}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Projects */}
        {resumeData.projects?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2 uppercase bg-gray-100 px-3 py-1">
              Projects
            </h2>
            <ul>
              {resumeData.projects.map((proj) => (
                <li key={proj.id} className="mb-2">
                  <p className="font-semibold">{proj.title}</p>
                  <p className="text-gray-600">{proj.description}</p>
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Project
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Hobbies */}
        {resumeData.hobbies?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2 uppercase bg-gray-100 px-3 py-1">
              Hobbies
            </h2>
            <ul className="flex flex-wrap gap-2">
              {resumeData.hobbies.map((hobby) => (
                <li
                  key={hobby.id}
                  className="bg-green-100 px-3 py-1 rounded-full text-green-700"
                >
                  {hobby.name}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
