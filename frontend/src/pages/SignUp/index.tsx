import React, { useState } from "react";
import { useAxios } from "../../shared/hooks/useAxios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Link,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

interface SignUpFormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const SignUp = () => {
  const [formData, setFormData] = useState<SignUpFormState>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const isPasswordComplex = (password: string): boolean => {
    // Example complexity check: at least 8 characters, 1 digit, 1 uppercase, 1 lowercase
    const complexityRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return complexityRegex.test(password);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isPasswordComplex(formData.password)) {
      toast.error(
        "Password nees to have at least 8 characters, 1 digit, 1 uppercase, 1 lowercase!"
      );
      return;
    }

    const axios = useAxios();
    try {
      await axios.post("/register", formData);
      toast.success("Registered Successfully", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        onClose: () => navigate("/login"),
      });
    } catch (error: any) {
      if (error?.response) {
        const errorMessage = error.response.data.error || "Registration Failed";
        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error("An unexpected error occurred", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  return (
    <Box width="80%" height="80%">
      <Container component="main" maxWidth="xs">
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            autoComplete="fname"
            autoFocus
            value={formData.firstName}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="lname"
            value={formData.lastName}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button type="submit" fullWidth variant="contained" color="primary">
            Sign Up
          </Button>
        </form>
      </Container>
      <Box marginTop={1}>
        <Link
          underline="none"
          component="button"
          variant="body2"
          onClick={() => {
            navigate("/login");
          }}
        >
          Existing user? Log in
        </Link>
      </Box>
    </Box>
  );
};

export default SignUp;
