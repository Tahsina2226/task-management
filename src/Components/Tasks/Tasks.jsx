import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { FaTasks } from "react-icons/fa";
import { AuthContext } from "../Provider/AuthProvider";
import { BiTask } from "react-icons/bi";
import AllTasks from "./AllTasks";
import useTasks from "../Hooks/useTasks";

const Tasks = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [, refetch] = useTasks();

  // Function to handle form submission
  const onSubmit = async (data) => {
    if (!data.title || !data.category) {
      toast.error("Title and Category are required!");
      return;
    }

    // Add auto-generated timestamp
    const taskData = {
      ...data,
      timestamp: new Date().toISOString(),
      addedBy: user?.email,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/tasks",
        taskData
      );
      if (res.data.insertedId) {
        toast.success("Task added successfully!");
        reset();
        refetch();
        setIsOpen(false); // Close modal after successful submission
      }
    } catch (error) {
      console.error("Error saving task to database:", error);
      toast.error("Failed to add task. Please try again.");
    }
  };

  return (
    <div className="mx-auto py-10 w-4/5">
      {/* Title Section */}
      <div className="flex justify-center items-center gap-4 mb-8">
        <p className="font-bold text-indigo-500 text-2xl md:text-4xl lg:text-6xl">
          <FaTasks />
        </p>
        <p className="font-bold text-indigo-500 text-2xl md:text-4xl lg:text-6xl">
          Track Your Task
        </p>
      </div>

      {/* Add Task Button */}
      <div className="flex justify-center mb-6 text-center">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 bg-indigo-400 hover:bg-indigo-300 px-6 py-3 rounded-lg font-semibold text-white text-lg transition-all"
        >
          <p>
            <BiTask className="font-bold" />
          </p>
          Add Task
        </button>
      </div>

      <div className="mt-10">
        <AllTasks />
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 overflow-y-auto">
          <div className="bg-white shadow-xl p-6 rounded-lg w-11/12 md:w-2/3 lg:w-2/4">
            <h2 className="mb-4 font-bold text-indigo-500 text-2xl">Add a New Task</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Title Input */}
              <div>
                <label className="block font-medium text-gray-600 text-lg">
                  Title (max 50 characters)
                </label>
                <input
                  type="text"
                  placeholder="Enter task title"
                  className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
                  {...register("title", {
                    required: "Title is required",
                    maxLength: {
                      value: 50,
                      message: "Title must be less than 50 characters",
                    },
                  })}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>

              {/* Description Input */}
              <div>
                <label className="block font-medium text-gray-600 text-lg">
                  Description (max 200 characters)
                </label>
                <textarea
                  placeholder="Enter task description (optional)"
                  rows="4"
                  className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
                  {...register("description", {
                    maxLength: {
                      value: 200,
                      message: "Description must be less than 200 characters",
                    },
                  })}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Category Select */}
              <div>
                <label className="block font-medium text-gray-600 text-lg">
                  Category
                </label>
                <select
                  className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
                  {...register("category", {
                    required: "Category is required",
                  })}
                >
                  <option value="To-Do">To-Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm">
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="bg-gray-400 hover:bg-gray-500 px-6 py-2 rounded-lg font-semibold text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-500 hover:bg-indigo-400 px-6 py-2 rounded-lg font-semibold text-white transition-all"
                >
                  Submit Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
