import { useState } from "react";
import PropTypes from "prop-types";

function SignUpForm({ register, setShowSignUp }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      alert("Registration successful!");
      setShowSignUp(false); // Return to login after successful registration
    } catch (err) {
      setError(err.message || "Registration failed.");
    }
  };

  return (
    <div className="sign-up-form">
      <h2>Sign Up</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button type="submit">Register</button>
          <button type="button" onClick={() => setShowSignUp(false)}>
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
}

SignUpForm.propTypes = {
  register: PropTypes.func.isRequired,
  setShowSignUp: PropTypes.func.isRequired,
};

export default SignUpForm;