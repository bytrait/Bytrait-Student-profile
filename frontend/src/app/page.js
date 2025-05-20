import React from "react";

import ProfileHeader from "./components/ProfileHeader/ProfileHeader";
import LinkedinSection from "./components/LinkedinSection";
import EducationSection from "./components/EducationSection/EducationSection";
import SkillsSection from "./components/SkillsSection";
import CertificationsSection from "./components/CertificationsSection";
import ExperienceSection from "./components/ExperienceSection";
import ProjectsSection from "./components/ProjectsSection";
import HobbiesSection from "./components/HobbiesSection";

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-8 py-10">
      <div className="ml-8">
        <h1 className="text-[38px] font-bold text-[#424242]">My Profile</h1>
        <p className="text-[18px] mb-4 mt-2 text-[#3B3B3B]">
          This profile includes relevant skills, experience, achievements, and a
          few defining traits.
        </p>
      </div>
      <div className="border-[1px] border-[#BAD0F9] rounded-lg py-2 px-6 mt-8 bg-white">
        <ProfileHeader />
        <LinkedinSection />
        <EducationSection />
        <SkillsSection />
        <CertificationsSection />
        <ExperienceSection />
        <ProjectsSection />
        <HobbiesSection />
      </div>
    </div>
  );
}
