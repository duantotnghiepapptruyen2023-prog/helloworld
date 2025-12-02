import React from 'react';
import './Loading.scss';

const Loading = ({ isLoading = true }) => {
  if (!isLoading) return null;

  return (
    <div id="loadingOverlay" className="loading-overlay">
      <div className="spinner">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} />
        ))}
      </div>
    </div>
  );
};

export default Loading;
