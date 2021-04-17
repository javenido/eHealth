import React from 'react';
import ReactPlayer from "react-player";

function MotivationalVideos() {
  return (
    <div className="flex-container">
      <h1>Motivational Videos</h1>
      <p>Stuck at home because of the pandemic? Stay motivated and fit by watching these inspirational videos.</p>
      <hr />
      <ReactPlayer className="video" width="800px" height="450px" url="https://www.youtube.com/watch?v=e_eJRDl2J6Y" />
      <ReactPlayer className="video" width="800px" height="450px" url="https://www.youtube.com/watch?v=aP_cO-rYDhs" />
      <ReactPlayer className="video" width="800px" height="450px" url="https://www.youtube.com/watch?v=KEhbYNmY3N4" />
      <ReactPlayer className="video" width="800px" height="450px" url="https://www.youtube.com/watch?v=3QajI7XigTs" />
    </div>
  );
}

export default MotivationalVideos;