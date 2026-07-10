import { useState, useEffect } from "react";

/**
 * ProjectForm - Reusable form for creating/editing projects
 * Used in both CreateProjectModal and UpdateProjectModal
 */
const DEFAULT_VALUES = {
  name: "",
  description: "",
  deadline: "",
};
export default function ProjectForm({
  initialValues = DEFAULT_VALUES,
  onSubmit,
  isLoading = false,
  formError = null,
}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const validateForm = () => {
    const newErrors = {};
    const name = values.name.trim();
    const description = values.description.trim();

    if (!name) {
      newErrors.name = "Project name is required";
    } else if (name.length < 3 || name.length > 100) {
      newErrors.name = "Name must be between 3 and 100 characters";
    }

    if (!description) {
      newErrors.description = "Description is required";
    } else if (description.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters";
    }

    if (!values.deadline) {
      newErrors.deadline = "Deadline is required";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({
      name: values.name.trim(),
      description: values.description.trim(),
      deadline: values.deadline,
    });
  };

  return (
    <form
      id="project-form"
      onSubmit={handleSubmit}
      className="space-y-4"
      noValidate
    >
      {/* Error alert */}
      {formError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {formError.detail || "Something went wrong"}
        </div>
      )}

      {/* Name field */}
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-slate-700"
        >
          Project Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={values.name}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Website Redesign"
          className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition ${
            errors.name
              ? "border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          } disabled:opacity-60`}
        />
        {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
      </div>

      {/* Description field */}
      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-slate-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={values.description}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Describe the project..."
          rows={4}
          className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition ${
            errors.description
              ? "border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          } disabled:opacity-60`}
        />
        {errors.description && (
          <p className="text-xs text-red-600">{errors.description}</p>
        )}
      </div>

      {/* Deadline field */}
      <div className="space-y-2">
        <label
          htmlFor="deadline"
          className="block text-sm font-medium text-slate-700"
        >
          Deadline
        </label>
        <input
          id="deadline"
          name="deadline"
          type="date"
          value={values.deadline}
          onChange={handleChange}
          disabled={isLoading}
          className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition ${
            errors.deadline
              ? "border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          } disabled:opacity-60`}
        />
        {errors.deadline && (
          <p className="text-xs text-red-600">{errors.deadline}</p>
        )}
      </div>

      {/* Hidden submit button (for form to work with modals) */}
      <button type="submit" className="hidden" disabled={isLoading} />
    </form>
  );
}
