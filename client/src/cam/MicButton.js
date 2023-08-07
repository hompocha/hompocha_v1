import { useState } from 'react';

export function MicButton({onMicToggle, user}) {
  const micOnImageURL = "/Bell/micOn.png";
  const micOffImageURL = "/Bell/micOff.png";

  const [micEnabled, setMicEnabled] = useState(false);

  const toggleMic = () => {
    setMicEnabled((prevState) => {
      const enabled = !prevState;
      const publisher = user.getStreamManager();

      if (enabled) {
        publisher.publishAudio(true);
      } else {
        publisher.publishAudio(false);
      }
      onMicToggle(enabled);
      return enabled;
    });
  };

  return (
    <button
      onClick={toggleMic}
      style={{
        backgroundImage: `url(${micEnabled ? micOnImageURL : micOffImageURL})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        width: '57px',
        height: '57px',
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
        backgroundColor: 'transparent',
      }}
    />
  );
}
