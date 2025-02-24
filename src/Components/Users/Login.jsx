import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signInWithPopup, getAuth, GoogleAuthProvider } from "firebase/auth";
import Swal from "sweetalert2"; // Import SweetAlert2
import axios from "axios";
import { AuthContext } from "../Provider/AuthProvider";

const Login = () => {
  const { setUser, userSignIn } = useContext(AuthContext);
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        const userInfo = {
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          role: "User",
        };

        // Store the user in the database
        axios
          .post("http://localhost:5000/users", userInfo)
          .then((res) => {
            if (res.data.insertedId) {
              // console.log("User stored in database:", res.data);
            }
          })
          .catch((error) => {
            console.error("Error saving user to database:", error);
          });

        // Regardless of database response, update state, show toast, and navigate
        setUser(user); // Set the user context
        Swal.fire({
          icon: "success",
          title: "Login Successful!",
          text: "Welcome back, " + user.displayName,
        });
        navigate(location?.state ? location.state : "/");
      })
      .catch((err) => {
        console.error("Google Sign-In Error:", err);
        setUser(null); // Clear the user context on error
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Google Sign-In failed. Please try again.",
        });
      });
  };

  const onSubmit = (data) => {
    const { email, password } = data;

    userSignIn(email, password)
      .then((result) => {
        const user = result.user;
        setUser(user);
        Swal.fire({
          icon: "success",
          title: "Login Successful!",
          text: "Welcome back, " + user.displayName,
        });
        navigate(location?.state ? location.state : "/");
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Invalid credentials. Please check your email and password.",
        });
      });
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-t from-pink-300 via-teal-300 to-blue-200 min-h-screen">
      <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-md">
        <h1 className="mb-8 font-semibold text-gray-700 text-2xl text-center">Login to Your Account</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="form-control">
            <label className="mb-2 text-gray-600 text-lg">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 border-2 border-gray-200 focus:border-teal-500 rounded-md w-full"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div className="form-control">
            <label className="mb-2 text-gray-600 text-lg">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="p-3 border-2 border-gray-200 focus:border-teal-500 rounded-md w-full"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
            />
            {errors.password && <p className="mt-1 text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <div className="form-control text-right">
            <Link to="/forgot-password" className="text-teal-500 hover:text-teal-700 text-sm">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r hover:bg-gradient-to-l from-teal-400 to-pink-500 py-3 rounded-md w-full text-white transition duration-200"
          >
            Login
          </button>
        </form>

        <div className="my-4 text-center">
          <p className="text-gray-600">Don't have an account? <Link to="/register" className="text-teal-500">Register</Link></p>
        </div>

        <div className="flex items-center my-4">
          <div className="border-gray-300 border-t w-full"></div>
          <span className="mx-4 text-gray-500">Or</span>
          <div className="border-gray-300 border-t w-full"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="flex justify-center items-center hover:bg-gray-100 py-3 border-2 border-gray-300 rounded-md w-full text-gray-700"
        >
          <FaGoogle className="mr-2" /> Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
