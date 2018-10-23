import React from 'react';
import ReactLoading from 'react-loading';

export default function Loading() {
  return (
    <div>
      <ReactLoading
        type="spinningBubbles"
        color="#777"
        className="loading"
        width="2em"
        height="2em"
      />
    </div>
  );
}
