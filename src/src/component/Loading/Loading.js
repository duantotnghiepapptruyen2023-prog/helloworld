import React from 'react';
import './Loading.scss';

const Loading = ({ isLoading = true }) => {
  if (!isLoading) return null;

  return (
   <div class="loading-overlay">
  <div class="loader"></div>
</div>
  );
};

export default Loading;
