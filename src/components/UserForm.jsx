// src/components/UserForm.jsx
import React, { useState } from 'react';
import { GraphQLClient } from 'graphql-request';

// Initialize the GraphQL client with your Hasura endpoint and secret
const graphqlClient = new GraphQLClient('https://artistic-penguin-50.hasura.app/v1/graphql', {
  headers: {
    'x-hasura-admin-secret': 'r3lXuJJCqk74hDE5cgfWR78mpZLQ7GRzYDZYeFNVJipStNAN260WfqbcVF63excT',  // Replace with your Hasura admin secret
  },
});

// GraphQL mutation to insert a user
const INSERT_USER = `
  mutation InsertUser($name: String!, $email: String!) {
    insert_users_one(object: { name: $name, email: $email }) {
      id
      name
      email
    }
  }
`;

const UserForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const variables = { name: formData.name, email: formData.email };
      await graphqlClient.request(INSERT_USER, variables);
      setSuccess(true);
      setFormData({ name: '', email: '' });
    } catch (err) {
      setError('Failed to submit the form');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create a New User</h2>
      {success && <p>User created successfully!</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default UserForm;
