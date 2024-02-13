import React, { useEffect, useState } from "react";
import { useAxios } from "../../shared/hooks/useAxios";
import {
  TextField,
  Button,
  Container,
  Typography,
  Link,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
import { useAuth } from "../../shared/components/contexts";
import { useNavigate } from "react-router-dom";

interface LoginFormState {
  email: string;
  password: string;
}

const Login = () => {
  const [formData, setFormData] = useState<LoginFormState>({
    email: "",
    password: "",
  });

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const axios = useAxios();
    try {
      const response = await axios.post("/login", formData);
      login(response.data.token);
      location.reload();
    } catch (error: any) {
      if (error?.response) {
        const errorMessage = error.response.data.error || "Login failed";
        toast.error(errorMessage, {
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
          Welcome
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
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
            Login
          </Button>
        </form>
      </Container>
      <Box marginTop={1}>
        <Link
          component="button"
          variant="body2"
          underline="none"
          onClick={() => {
            navigate("/signup");
          }}
        >
          New user? Sign up
        </Link>
      </Box>
    </Box>
  );
};

export default Login;
