# Task Management Application

## Short Description

A task management app that allows users to add, edit, delete, and reorder tasks in a drag-and-drop interface. Tasks are categorized into "To-Do", "In Progress", and "Done". The app features real-time synchronization with a MongoDB database and Firebase Authentication. It is fully responsive and optimized for both desktop and mobile devices.

## Live Links

- **Frontend:** [Live Link]()

## Key Features

1. **Authentication:**

   - Firebase Authentication with Google Sign-In.
   - User details (User ID, email, display name) stored in the database.

2. **Task Management System:**

   - Users can add, edit, delete, reorder tasks.
   - Tasks are categorized into **To-Do**, **In Progress**, and **Done**.
   - Drag-and-drop functionality to reorder tasks and move between categories.
   - Instant database syncing to maintain task order even after refreshing the page.

3. **Database & Persistence:**

   - MongoDB to store tasks.
   - Real-time task synchronization using MongoDB Change Streams or WebSockets.

4. **Frontend UI:**

   - Built with **Vite.js** and **React**.
   - Modern, clean, minimalistic, and fully responsive design.
   - Drag-and-drop functionality implemented using **react-beautiful-dnd**.

5. **Backend:**

   - Express.js API to handle CRUD operations.
   - Endpoints for task management:
     - `POST /tasks` – Add a new task.
     - `GET /tasks` – Retrieve all tasks.
     - `PUT /tasks/:id` – Update task details (title, description, category).
     - `DELETE /tasks/:id` – Delete a task.

6. **Bonus Features (Optional):**
   - Dark mode toggle.
   - Task due dates with color indicators for overdue tasks.
   - Simple activity log for tracking task movements (e.g., "Task moved to Done").

## Technologies Used

- **Frontend:**
  - React.js
  - Vite.js
  - react-beautiful-dnd (for drag-and-drop functionality)
  - Firebase Authentication (Google Sign-In)
  - Tailwind CSS (for styling)
- **Backend:**

  - Node.js
  - Express.js
  - MongoDB (for task storage)
  - MongoDB Change Streams (for real-time updates)

- **Tools & Libraries:**
  - JWT (for authentication tokens)
  - axios (for API requests)
  - dotenv (for managing environment variables)

## Installation Steps

### Frontend:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/frontend.git
   ```
