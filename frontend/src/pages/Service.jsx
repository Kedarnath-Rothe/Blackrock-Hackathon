import axios from 'axios';
import { useState } from "react";
import { Link } from 'react-router-dom';
import { useAuth } from '../store/auth';

const Courses = () => {
    const { courses, user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');

    if (!Array.isArray(courses)) {
        return <div className='container'>Loading...</div>;
    }

    // Function to handle search input change
    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleCallMeClick = async (course) => {
        try {
            // console.log("hhss");
            const response = await axios.post('https://blackrock-hackathon.vercel.app/api/form/contact/mentorship', {
                user,
                course
            });
            alert(`Call initiated: ${response.data.message}`);
        } catch (error) {
            console.error('Error initiating call:', error);
            alert('Failed to initiate call.');
        }
    };

    // Filtered courses based on search query and availability
    const filteredCourses = courses.filter((course) =>
        course.courseName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Separate booked courses from available courses
    const availableCourses = filteredCourses.filter((course) => !course.booked);

    return (
        <section className="section-services">
            <div className="container service_head">
                <h1 className="service_heading">Courses</h1>
            </div>

            <div className="container section_search">
                <input
                    type='text'
                    className="search"
                    placeholder='Search Course...'
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                />
                <p>Total Courses: {filteredCourses.length}</p>
            </div>

            <div className="container grid grid-four-cols">
                {/* Display available Course */}
                {availableCourses.map((curElem, index) => (
                    <div className="card" key={index}>
                        <div className="card-img">
                            <img src={curElem.image} alt={curElem.courseName} />
                        </div>
                        <hr className="hr" />
                        <div className="card-details">
                            <div className="additional-info">
                                <h2 style={{ fontSize: "2rem" }} >{curElem.courseName}</h2>
                                {/* <p>
                                    <Link className="edit2" to={`/user/cardetails/${curElem._id}`}>
                                        <IoMdInformationCircle className="icon" />
                                    </Link>
                                </p> */}
                            </div>
                            <p className="price">$ {curElem.price}</p>
                            <div className="phone-number">
                                <p>
                                    <Link to="#" onClick={() => handleCallMeClick(curElem)}>
                                        call me
                                    </Link>
                                </p>
                                {curElem.cust_id === user._id ? (
                                    <span style={{ color: "red" }}>purchased</span>
                                ) : (
                                    <span>
                                        <Link className="book" to={`/user/buycourse/${curElem._id}`}>
                                            Buy
                                        </Link>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Display booked course at the end */}

            </div>
        </section>
    );
};

export default Courses;
