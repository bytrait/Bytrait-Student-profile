import React, { useState } from "react";

const EducationForm = ({ educationType, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    start_year: initialData?.start_year || "",
    end_year: initialData?.end_year || "",
    board: initialData?.board || "",
    cgpa: initialData?.cgpa || "",
    stream: initialData?.stream || "",
    school: initialData?.school || "",
    website: initialData?.website || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error("Error saving education data:", err.message);
    }
  };

  return (
    <div className="overflow-auto max-h-[40rem]">
      <h2 className="text-xl font-semibold text-center mb-6">
        {`Add ${educationType} Details`}
      </h2>
      <div className="flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full max-w-lg"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Board
            </label>
            <input
              type="text"
              name="board"
              value={formData.board}
              onChange={handleChange}
              placeholder="e.g., CBSE"
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              School/College
            </label>
            <input
              type="text"
              name="school"
              value={formData.school}
              onChange={handleChange}
              placeholder="e.g., ABC International School"
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stream
            </label>
            <input
              type="text"
              name="stream"
              value={formData.stream}
              onChange={handleChange}
              placeholder="e.g., Science (PCM)"
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Year
            </label>
            <input
              type="text"
              name="start_year"
              value={formData.start_year}
              onChange={handleChange}
              placeholder="e.g., 2020"
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Year
            </label>
            <input
              type="text"
              name="end_year"
              value={formData.end_year}
              onChange={handleChange}
              placeholder="e.g., 2024 or Present"
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Grade
            </label>
            <input
              type="text"
              name="cgpa"
              value={formData.cgpa}
              onChange={handleChange}
              placeholder="e.g., 75%"
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Website (optional)
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="e.g., https://www.example.com"
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div className="col-span-2 text-right">
            <button
              type="submit"
              className="mt-4 w-[174px] bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EducationForm;
