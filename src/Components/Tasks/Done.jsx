import React, { useState } from "react";
import moment from "moment";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { FaEye, FaPen, FaRegClock } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { TbSubtask } from "react-icons/tb";
import axios from "axios";
import toast from "react-hot-toast";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Done = ({ tasks, refetch }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");

  const openModal = (task) => {
    setSelectedTask(task);
    setUpdatedTitle(task.title);
    setUpdatedDescription(task.description || "");
  };

  const closeModal = () => {
    setSelectedTask(null);
  };

  const handleTitleChange = (e) => setUpdatedTitle(e.target.value);
  const handleDescriptionChange = (e) => setUpdatedDescription(e.target.value);

  const handleUpdate = () => {
    axios
      .put(`http://localhost:5000/tasks/${selectedTask._id}`, {
        title: updatedTitle,
        description: updatedDescription,
      })
      .then(() => {
        toast.success("Task updated successfully");
        refetch();
        closeModal();
      })
      .catch(() => {
        toast.error("Failed to update task");
      });
  };

  const handleDelete = (taskId) => {
    axios
      .delete(`http://localhost:5000/tasks/${taskId}`)
      .then(() => {
        refetch();
        toast.success("Task deleted successfully");
      })
      .catch(() => {
        toast.error("Failed to delete task");
      });
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedOrder = items.map((task, index) => ({
      id: task._id,
      order: index,
    }));

    try {
      const loadingToast = toast.loading("Reordering tasks...");
      await axios.put("http://localhost:5000/tasks/reorder", {
        tasks: updatedOrder,
      });
      toast.dismiss(loadingToast);
      toast.success("Tasks reordered successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to reorder tasks");
      refetch();
    }
  };

  return (
    <div className="md:w-2/6">
      <div className="flex justify-center items-center gap-2 mb-5 font-bold text-green-600 text-xl md:text-2xl lg:text-3xl">
        <p>
          <IoCheckmarkDoneCircleOutline />
        </p>
        <p>Done</p>
      </div>

      <Droppable droppableId="done">
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
                    className={`border-2 border-green-200 bg-slate-200 p-2 rounded-md flex gap-2 flex-col 
                                            shadow-[0px_4px_10px_rgba(34,197,94,0.2)] 
                                            ${
                                              snapshot.isDragging
                                                ? "opacity-75"
                                                : ""
                                            }`}
                  >
                    <div className="flex items-center gap-1 font-medium text-lg">
                      <TbSubtask />
                      <span>{task.title}</span>
                    </div>

                    <div className="flex items-center gap-1 text-md">
                      <FaRegClock />
                      <span>{moment(task.timestamp).format("MMM D YYYY")}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div
                        className="flex items-center gap-1 text-info cursor-pointer"
                        onClick={() => openModal(task)}
                      >
                        <FaEye />
                        <span>Description</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button onClick={() => openModal(task)}>
                          <FaPen className="text-green-500 text-sm" />
                        </button>
                        <button onClick={() => handleDelete(task._id)}>
                          <MdDeleteForever className="text-error text-lg" />
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
            <h2 className="mb-2 font-bold text-xl">Edit Task</h2>
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
            <div className="flex justify-between">
              <button
                onClick={closeModal}
                className="bg-gray-500 px-4 py-2 rounded-md text-white"
              >
                Close
              </button>
              <button
                onClick={handleUpdate}
                className="bg-green-500 px-4 py-2 rounded-md text-white"
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

export default Done;
