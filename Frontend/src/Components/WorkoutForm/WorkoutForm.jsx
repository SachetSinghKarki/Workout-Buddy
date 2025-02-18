// import React, { useState } from 'react'
// import axios from 'axios';

// const WorkoutForm = () => {
//   const [title,setTitle] = useState('')
//   const [reps, setReps] = useState('')
//   const [load, setLoad] = useState('')
//   const [error, setError] = useState(null)

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     const workout = { title, reps, load }

//       const response = await fetch('http://localhost:4000/api/workouts', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(workout),
//       })

//       const json = await response.json()

//       if(!response.ok) {
//         setError(json.error)
//       }
//       if(response.ok) {
//         setError(null)
//         setTitle('')
//         setReps('')
//         setLoad('')
//         console.log('Workouts loaded successfully', json)

//       }

// }
//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Workout Name"
//           value={title}
//           onChange={e => setTitle(e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="Reps"
//           value={reps}
//           onChange={e => setReps(e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="Load (kg)"
//           value={load}
//           onChange={e => setLoad(e.target.value)}
//         />
//         <button type="submit">Add Workout</button>
//       </form>

//     </div>
//   )
// }

// export default WorkoutForm

import React, { useState } from "react";
import { useWorkoutsContext } from "../../Hooks/UseWorkoutContext";
import { useAuthContext } from "../../Hooks/UseAuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles for toast

const WorkoutForm = () => {
  const { dispatch } = useWorkoutsContext();
  const [title, setTitle] = useState("");
  const [reps, setReps] = useState("");
  const [load, setLoad] = useState("");
  const [error, setError] = useState(null);
  const [emptyField, setEmptyField] = useState([]);

  const { user } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in to add a workout.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }
    const workout = { title, reps, load };

    const response = await fetch(
      "https://workout-buddy-beryl.vercel.app/api/workouts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(workout),
      }
    );

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyField(json.emptyField);
    } else {
      setError(null);
      setTitle("");
      setReps("");
      setLoad("");
      setEmptyField([]);
      dispatch({ type: "CREATE_WORKOUTS", payload: json });

      // Show success toast notification
      toast.success("Workout added successfully!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-200">
      <ToastContainer /> {/* Add the ToastContainer */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Add New Workout
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center bg-red-100 p-2 rounded">
            {error}
          </p>
        )}

        {/* Title Field */}
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 font-medium mb-2"
          >
            Workout Name
          </label>
          <input
            type="text"
            id="title"
            placeholder="Workout Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full p-3 border ${
              emptyField.includes("title")
                ? "border-red-500"
                : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400`}
          />
          {emptyField.includes("title") && (
            <p className="text-red-500 text-sm mt-1">
              Workout name is required.
            </p>
          )}
        </div>

        {/* Reps Field */}
        <div className="mb-4">
          <label
            htmlFor="reps"
            className="block text-gray-700 font-medium mb-2"
          >
            Reps
          </label>
          <input
            type="number"
            id="reps"
            placeholder="Reps"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className={`w-full p-3 border ${
              emptyField.includes("reps") ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400`}
          />
          {emptyField.includes("reps") && (
            <p className="text-red-500 text-sm mt-1">Reps are required.</p>
          )}
        </div>

        {/* Load Field */}
        <div className="mb-6">
          <label
            htmlFor="load"
            className="block text-gray-700 font-medium mb-2"
          >
            Load (kg)
          </label>
          <input
            type="number"
            id="load"
            placeholder="Load (kg)"
            value={load}
            onChange={(e) => setLoad(e.target.value)}
            className={`w-full p-3 border ${
              emptyField.includes("load") ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400`}
          />
          {emptyField.includes("load") && (
            <p className="text-red-500 text-sm mt-1">Load is required.</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Add Workout
        </button>
      </form>
    </div>
  );
};

export default WorkoutForm;
