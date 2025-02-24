import React, { useState } from "react";
import moment from "moment";
import { RiProgress7Line } from "react-icons/ri";
import { FaEye, FaPen, FaRegClock } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { TbSubtask } from "react-icons/tb";
import toast from "react-hot-toast";
import axios from "axios";
import Swal from "sweetalert2";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const InProgress = ({ tasks, refetch }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");

  const openModal = (task) => {
    setSelectedTask(task);
    setUpdatedTitle(task.title);
    setUpdatedDescription(task.description || "");

    // Open SweetAlert2 modal with form to update the task
    Swal.fire({
      title: "Edit Task",
      html: `
        <div>
          <label for="title" class="swal2-label">Title</label>
          <input id="title" class="swal2-input" type="text" value="${task.title}" />
          <label for="description" class="swal2-label">Description</label>
          <textarea id="description" class="swal2-textarea">${task.description || ""}</textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Close",
      preConfirm: () => {
        const newTitle = document.getElementById("title").value;
        const newDescription = document.getElementById("description").value;

        if (!newTitle) {
          toast.error("Title is required");
          return false; // Prevent modal from closing if validation fails
        }

        return { newTitle, newDescription };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { newTitle, newDescription } = result.value;

        // Update the task in the backend
        axios
          .put(`http://localhost:5000/tasks/${task._id}`, {
            title: newTitle,
            description: newDescription,
          })
          .then(() => {
            toast.success("Task updated successfully");
            refetch(); // Refetch data without reloading the page
          })
          .catch(() => {
            toast.error("Failed to update task");
          });
      }
    }).catch((error) => {
      console.error("SweetAlert2 error: ", error);
    });
  };

  const handleDelete = (taskId) => {
    axios
      .delete(`http://localhost:5000/tasks/${taskId}`)
      .then(() => {
        refetch(); // Refetch data without reloading the page
        toast.success("Task deleted successfully");
      })
      .catch(() => {
        toast.error("Failed to delete task");
      });
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    try {
      const items = Array.from(tasks);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      const updatedOrder = items.map((task, index) => ({
        id: task._id,
        order: index,
      }));

      const loadingToast = toast.loading("Reordering tasks...");

      await axios.put("http://localhost:5000/tasks/reorder", {
        tasks: updatedOrder,
      });

      toast.dismiss(loadingToast);
      toast.success("Tasks reordered successfully");
      await refetch(); // Refetch data without reloading the page
    } catch (error) {
      toast.error("Failed to reorder tasks");
    }
  };

  return (
    <div className="md:w-2/6">
      <div className="flex justify-center items-center gap-2 mb-5 font-bold text-[#FF5722] text-xl md:text-2xl lg:text-3xl">
        <p>
          <RiProgress7Line />
        </p>
        <p>In Progress</p>
      </div>

      <Droppable droppableId="inProgress">
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
                    className={`border-2 border-[#00BFFF] bg-[#f5f5f5] p-2 rounded-md flex gap-2 flex-col 
                                          shadow-[0px_4px_10px_rgba(59,130,246,0.2)] 
                                          ${snapshot.isDragging ? "opacity-75" : ""}`}
                  >
                    <div className="flex items-center gap-1 font-medium text-[#4CAF50] text-lg">
                      <p>
                        <TbSubtask />
                      </p>
                      <p>{task.title}</p>
                    </div>

                    <div className="flex items-center gap-1 text-[#808080] text-md">
                      <p>
                        <FaRegClock />
                      </p>
                      <p>{moment(task.timestamp).format("MMM D YYYY")}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div
                        className="flex items-center gap-1 text-[#008CBA] cursor-pointer"
                        onClick={() => openModal(task)}
                      >
                        <p>
                          <FaEye />
                        </p>
                        <p> Description</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button onClick={() => openModal(task)}>
                          <FaPen className="text-[#4CAF50] text-sm" />
                        </button>

                        <button onClick={() => handleDelete(task._id)}>
                          <MdDeleteForever className="text-[#D32F2F] text-lg" />
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
    </div>
  );
};

export default InProgress;
