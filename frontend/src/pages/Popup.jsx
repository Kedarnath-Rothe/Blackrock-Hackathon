import '@babel/polyfill';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ImCross } from "react-icons/im";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useAuth } from '../store/auth';
import './pop.css';
import './style.css';

// eslint-disable-next-line react/prop-types
const Popup = ({ close }) => {
  const { isLoggedIn, user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    message: ''
  });
  const [useAudio, setUseAudio] = useState(false);

  useEffect(() => {
    if (isLoggedIn && user) {
      setFormData({
        name: user.username || '',
        email: user.email || '',
        mobile: user.phone || '',
        message: ''
      });
    }
  }, [isLoggedIn, user]);

  const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
  const stopListening = () => SpeechRecognition.stopListening();
  const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support speech recognition.</p>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData, message: useAudio ? transcript : formData.message };
      await axios.post('https://blackrock-hackathon.vercel.app/api/form/contact', dataToSend); // Updated endpoint URL
      alert('Message sent successfully');
      setFormData({
        name: '',
        email: '',
        mobile: '',
        message: ''
      });
    } catch (error) {
      console.error(error);
      alert('Error sending message');
    }
  };

  return (
    <>
      <form className='contact_form popup' onSubmit={handleSubmit}>
        <button style={{ backgroundColor: "transparent", width: "10rem", marginLeft: "47rem" }} className="close-button" onClick={close}><ImCross style={{ color: "red" }} /></button>

        <div>
          <h2 style={{fontSize:"2.7rem", color:"green", marginLeft:"20rem"}}>QueryGenie</h2>
          <p style={{color:"gray", marginLeft:"16rem"}}>Your Query Solution Genie</p>
        </div>

        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div>
          <label>Mobile:</label>
          <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} />
        </div>
        <div className="message-option">
          <div>
            <label>Message:</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              disabled={useAudio}
            ></textarea>
          </div>
          <div style={{ color: "black", fontSize: "1.5rem" }} className="or-divider">OR</div>
          <div className="audio-container">
            <button
              type="button"
              onClick={() => {
                setUseAudio(true);
                startListening();
              }}
              disabled={useAudio}
            >
              Start Listening
            </button>
            <button
              style={{ marginLeft: "2rem" }}
              type="button"
              onClick={() => {
                setUseAudio(false);
                stopListening();
              }}
              disabled={!useAudio}
            >
              Stop Listening
            </button>
            {useAudio && <div style={{ color: "black", fontSize: "2rem" }} className="transcript">{transcript}</div>}
          </div>
        </div>
        <button type="submit">Submit</button>
        <br />
      </form>
    </>
  );
};

export default Popup;
