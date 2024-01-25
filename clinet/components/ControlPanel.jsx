import React, { useState, useEffect } from 'react';

const ControlPanel = ({ leaveCall, localAudioTrack, localVideoTrack }) => {
  const [muted, setMuted] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [volume, setVolume] = useState(100);

  const toggleAudio = () => {
    if (localAudioTrack) {
      localAudioTrack.setEnabled(!muted);
      setMuted(!muted);
    }
  };

  const toggleVideo = () => {
    if (localVideoTrack) {
      localVideoTrack.setEnabled(!videoEnabled);
      setVideoEnabled(!videoEnabled);
    }
  };

  

  return (
    <div>
      <button onClick={toggleAudio}>{muted ? 'Unmute Audio' : 'Mute Audio'}</button>
      <button onClick={toggleVideo}>{videoEnabled ? 'Disable Video' : 'Enable Video'}</button>
      <button onClick={leaveCall}>Leave Call</button>
    </div>
  );
};

export default ControlPanel;
