import { useState } from "react";
import moment from "moment";
import { FaEye, FaPen, FaRegClock } from "react-icons/fa";
import { ImTarget } from "react-icons/im";
import { MdDeleteForever } from "react-icons/md";
import { TbSubtask } from "react-icons/tb";
import Swal from "sweetalert2"; // Import SweetAlert2
import axios from "axios";
import { Droppable, Draggable } from "@hello-pangea/dnd";

const Todo = ({ tasks, refetch }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");

  // Function to open modal and pre-fill input values
  const openModal = (task) => {
    setSelectedTask(task);
    setUpdatedTitle(task.title); // Set the default value for the title
    setUpdatedDescription(task.description || ""); // Set the default value for description
  };

  // Function to close modal
  const closeModal = () => {
    setSelectedTask(null);
  };

  // Handle title and description changes
  const handleTitleChange = (e) => setUpdatedTitle(e.target.value);
  const handleDescriptionChange = (e) => setUpdatedDescription(e.target.value);

  // Handle updating the task
  const handleUpdate = () => {
    axios
      .put(`http://localhost:5000/tasks/${selectedTask._id}`, {
        title: updatedTitle,
        description: updatedDescription,
      })
      .then((res) => {
        Swal.fire({
          title: "Success",
          text: "Task updated successfully",
          icon: "success",
          confirmButtonText: "OK",
        });
        refetch(); // Refetch tasks to reflect the updated task
        closeModal(); // Close the modal after updating
      })
      .catch((err) => {
        Swal.fire({
          title: "Error",
          text: "Failed to update task",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  // Handle deleting the task
  const handleDelete = (taskId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This task will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:5000/tasks/${taskId}`)
          .then((res) => {
            Swal.fire({
              title: "Deleted!",
              text: "Task deleted successfully.",
              icon: "success",
              confirmButtonText: "OK",
            });
            refetch();
          })
          .catch((err) => {
            Swal.fire({
              title: "Error",
              text: "Failed to delete task",
              icon: "error",
              confirmButtonText: "OK",
            });
          });
      }
    });
  };

  return (
    <div className="md:w-2/6">
      {/* Title */}
      <div className="flex justify-center items-center gap-2 mb-5 font-bold text-teal-500 text-xl md:text-2xl lg:text-3xl">
        <p>
          <ImTarget />
        </p>
        <p>To-Do</p>
      </div>

      <Droppable droppableId="todo">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4 min-h-[200px]"
          >
            {tasks?.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`border-2 border-teal-200 bg-teal-50 p-4 rounded-md flex gap-2 flex-col 
                                            shadow-lg ${
                                              snapshot.isDragging
                                                ? "opacity-75"
                                                : ""
                                            }`}
                  >
                    {/* Title */}
                    <div className="flex items-center gap-1 font-medium text-teal-600 text-lg">
                      <p>
                        <TbSubtask />
                      </p>
                      <p>{task.title}</p>
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-1 text-md text-teal-500">
                      <p>
                        <FaRegClock />
                      </p>
                      <p>{moment(task.timestamp).format("MMM D YYYY")}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      {/* Description Button */}
                      <div
                        className="flex items-center gap-1 text-teal-400 cursor-pointer"
                        onClick={() => openModal(task)}
                      >
                        <p>
                          <FaEye />
                        </p>
                        <p> Description</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Edit Button */}
                        <button onClick={() => openModal(task)}>
                          <FaPen className="text-teal-500 text-sm" />
                        </button>

                        {/* Delete Button */}
                        <button onClick={() => handleDelete(task._id)}>
                          <MdDeleteForever className="text-red-500 text-lg" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Modal */}
      {selectedTask && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white shadow-lg p-6 rounded-lg w-96">
            <h2 className="mb-2 font-bold text-teal-600 text-xl">Edit Task</h2>

            {/* Title Input */}
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block font-semibold text-gray-700"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                required
                value={updatedTitle}
                onChange={handleTitleChange}
                className="p-2 border border-gray-300 rounded-md w-full"
              />
            </div>

            {/* Description Input */}
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block font-semibold text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                value={updatedDescription}
                required
                onChange={handleDescriptionChange}
                className="p-2 border border-gray-300 rounded-md w-full"
                rows="4"
              />
            </div>

            {/* Modal Buttons */}
            <div className="flex justify-between">
              <button
                onClick={closeModal}
                className="bg-gray-400 px-4 py-2 rounded-md text-white"
              >
                Close
              </button>
              <button
                onClick={handleUpdate}
                className="bg-teal-500 px-4 py-2 rounded-md text-white"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Todo;
