import React, { useContext, useState, useEffect } from "react";
import useTasks from "../Hooks/useTasks";
import { AuthContext } from "../Provider/AuthProvider";
import Todo from "./Todo";
import InProgress from "./InProgress";
import Done from "./Done";
import { DragDropContext } from "@hello-pangea/dnd";
import axios from "axios";
import Swal from 'sweetalert2'; // Import SweetAlert2

const AllTasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, refetch] = useTasks();
  const [todoTasks, setTodoTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);

  useEffect(() => {
    if (!user?.email) return;

    const sortedTodoTasks = tasks
      ?.filter(
        (task) => task.category === "To-Do" && task.addedBy === user.email
      )
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const sortedInProgressTasks = tasks
      ?.filter(
        (task) => task.category === "In Progress" && task.addedBy === user.email
      )
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const sortedDoneTasks = tasks
      ?.filter(
        (task) => task.category === "Done" && task.addedBy === user.email
      )
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    setTodoTasks(sortedTodoTasks || []);
    setInProgressTasks(sortedInProgressTasks || []);
    setDoneTasks(sortedDoneTasks || []);
  }, [tasks, user]);

  const onDragEnd = async (result) => {
    if (!user?.email) return;
    const { destination, source, draggableId } = result;

    if (!destination) return;

    try {
      let sourceList, destinationList;
      let sourceCategory, destinationCategory;

      if (source.droppableId === "todo") {
        sourceList = [...todoTasks];
        sourceCategory = "To-Do";
      } else if (source.droppableId === "inProgress") {
        sourceList = [...inProgressTasks];
        sourceCategory = "In Progress";
      } else if (source.droppableId === "done") {
        sourceList = [...doneTasks];
        sourceCategory = "Done";
      }

      if (source.droppableId === destination.droppableId) {
        const items = Array.from(sourceList);
        const [reorderedItem] = items.splice(source.index, 1);
        items.splice(destination.index, 0, reorderedItem);

        if (source.droppableId === "todo") setTodoTasks(items);
        else if (source.droppableId === "inProgress") setInProgressTasks(items);
        else if (source.droppableId === "done") setDoneTasks(items);

        const updatePromises = items.map((task, index) => {
          return axios.put(
            `http://localhost:5000/tasks/${task._id}?addedBy=${user.email}`,
            {
              order: index,
              category: sourceCategory,
              addedBy: user.email,
            }
          );
        });

        await Promise.all(updatePromises);
        
        // Success SweetAlert2
        Swal.fire({
          icon: 'success',
          title: 'Tasks reordered successfully!',
          text: 'Your tasks have been updated.',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        const sourceItems = Array.from(sourceList);
        const [movedItem] = sourceItems.splice(source.index, 1);

        if (destination.droppableId === "todo") {
          destinationList = [...todoTasks];
          destinationCategory = "To-Do";
        } else if (destination.droppableId === "inProgress") {
          destinationList = [...inProgressTasks];
          destinationCategory = "In Progress";
        } else if (destination.droppableId === "done") {
          destinationList = [...doneTasks];
          destinationCategory = "Done";
        }

        const destItems = Array.from(destinationList);
        destItems.splice(destination.index, 0, movedItem);

        if (source.droppableId === "todo") setTodoTasks(sourceItems);
        else if (source.droppableId === "inProgress")
          setInProgressTasks(sourceItems);
        else if (source.droppableId === "done") setDoneTasks(sourceItems);

        if (destination.droppableId === "todo") setTodoTasks(destItems);
        else if (destination.droppableId === "inProgress")
          setInProgressTasks(destItems);
        else if (destination.droppableId === "done") setDoneTasks(destItems);

        await axios.put(
          `http://localhost:5000/tasks/${draggableId}?addedBy=${user.email}`,
          {
            category: destinationCategory,
            order: destination.index,
            addedBy: user.email,
          }
        );

        const sourceUpdates = sourceItems.map((task, index) => {
          return axios.put(
            `http://localhost:5000/tasks/${task._id}?addedBy=${user.email}`,
            {
              order: index,
              category: sourceCategory,
              addedBy: user.email,
            }
          );
        });

        const destUpdates = destItems.map((task, index) => {
          return axios.put(
            `http://localhost:5000/tasks/${task._id}?addedBy=${user.email}`,
            {
              order: index,
              category: destinationCategory,
              addedBy: user.email,
            }
          );
        });

        await Promise.all([...sourceUpdates, ...destUpdates]);

        // Success SweetAlert2
        Swal.fire({
          icon: 'success',
          title: 'Task moved successfully!',
          text: 'The task has been successfully moved to a new category.',
          timer: 2000,
          showConfirmButton: false
        });
      }

      await refetch();
    } catch (error) {
      console.error("Error updating tasks:", error);
      
      // Error SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Something went wrong!',
        text: 'An error occurred while updating your tasks.',
        timer: 2000,
        showConfirmButton: false
      });
      refetch();
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex md:flex-row flex-col justify-center md:justify-between gap-4">
        <Todo tasks={todoTasks} refetch={refetch} />
        <InProgress tasks={inProgressTasks} refetch={refetch} />
        <Done tasks={doneTasks} refetch={refetch} />
      </div>
    </DragDropContext>
  );
};

export default AllTasks;  