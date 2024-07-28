import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Popup from './Popup';

const Home = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Show popup after 5 seconds
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 5000);

    return () => clearTimeout(timer); // Clear timeout on component unmount
  }, []);

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <section style={{height:"100vh", marginTop:"10rem"}} className="section-home">
        <div className="container grid grid-two-cols">
          <div className="section-content">
            <div className="content">
              <h1>Welcome to Wealthify</h1> <br />
              <p>
                We offer a diverse fleet of top-quality Courses, providing the
                best courses with unbeatable offers. Elevate your journey with
                learning, planning, and excitement.
              </p>
              <br />
              <NavLink to="/register">
                <img
                  className="register-home"
                  src="/images/register-home.png"
                  alt="Contact Image"
                />
              </NavLink>
              <br />
              <br />
            </div>
          </div>

          <div className="contact-img">
            <img src="/images/home.png" alt="Contact Image" />
          </div>
        </div>
      </section>
      <br />
      <br />
      <br />
      {showPopup && <Popup close={closePopup} />} 
    </>
  );
};

export default Home;
