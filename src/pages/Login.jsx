import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormContainer from "../components/FormContainer";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetUserInfoFromGoogleLoginQuery,
  useLoginMutation,
} from "../slices/userApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { data } = useGetUserInfoFromGoogleLoginQuery();

  // useEffect(() => {
  //   if (data?.user) {
  //     dispatch(setCredentials({ ...data?.user }));
  //     navigate("/");
  //     toast.success("Logged In!");
  //   }
  // }, [data?.user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res.data }));
      navigate("/");
      toast.success("Logged In!");
    } catch (error) {
      toast.error(error.data?.msg);
      console.log(error?.data?.msg || error.error);
    }
  };

  const handleLoginGoogle = () => {
    window.open("http://localhost:5000/auth/google", "_self");
    if (data?.user) {
      dispatch(setCredentials({ ...data?.user }));
      navigate("/");
      toast.success("Logged In!");
    }
  };

  return (
    <FormContainer>
      <h3 className="text-center my-1">Login</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        {isLoading ? (
          <Button variant="primary" disabled>
            <Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            Loading...
          </Button>
        ) : (
          <div className="d-flex justify-content-between">
            <Button variant="primary" type="submit">
              Submit
            </Button>
            <p>
              {" "}
              Forgot Password ? <Link to="/forgot-password">RESET</Link>
            </p>
          </div>
        )}
      </Form>

      <p>
        New Customer ? <Link to="/register">Register</Link>
      </p>

      <button onClick={handleLoginGoogle}>Google Login</button>
    </FormContainer>
  );
}

export default Login;
