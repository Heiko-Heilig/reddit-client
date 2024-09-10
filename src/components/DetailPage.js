import React from 'react';
import { useParams } from 'react-router-dom';

const DetailPage = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Post Details</h1>
      <p>Showing details for post ID: {id}</p>
      {/* Post details will be rendered here */}
    </div>
  );
};

export default DetailPage;
