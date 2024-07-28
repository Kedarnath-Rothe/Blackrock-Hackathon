import axios from "axios";
import { useEffect, useState } from "react";
import { IoIosCall } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import { useAuth } from "../store/auth";



const AdminUpdate = () => {
    const params = useParams();
    const { courses, user } = useAuth();
    const [courseData, setCourseData] = useState(null);

    useEffect(() => {
        // Check if course is an array and has length greater than 0
        if (Array.isArray(courses) && courses.length > 0) {
            // Find the course object with matching ID
            const foundCourse = courses.find(course => course._id === params.id);
            if (foundCourse) {
                setCourseData(foundCourse);
            } else {
                // If no matching course found, show error message
                toast.error("Course not found");
            }
        } else {
            // If course is not an array or empty, show error message 
        }
    }, [courses, params.id]);

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

    return (
        <>
            <section className="section-car-details">
                <center><h1> Course Details </h1></center>
                <br /><br /><br />

                <div className="container ">
                    <section className="section-form">
                        {courseData && (
                            <>

                                <Link style={{ marginLeft: "2rem", fontSize: "3rem", color: "green" }} to="#" onClick={() => handleCallMeClick(courseData)}>
                                    <IoIosCall style={{ fontSize: "3rem", color: "green" }} /> call me
                                </Link>

                                <table>
                                    <tbody>
                                        <tr>
                                            <td>Course Image</td>
                                            <td><img src={`${courseData.image}`} alt={courseData.CourseName} /></td>
                                        </tr>
                                        <tr>
                                            <td>Course Name</td>
                                            <td>{courseData.courseName}</td>
                                        </tr>
                                        <tr>
                                            <td>Price</td>
                                            <td>$ {courseData.price} </td>
                                        </tr>
                                        <tr>
                                            <td>Details</td>
                                            <td>{courseData.details}</td>
                                        </tr>
                                        {/* Add more fields as needed */}
                                    </tbody>
                                </table>
                                <br />
                                <br />
                                <div style={{ margin: "auto" }} className="btn">
                                    {!courseData.booked && (
                                        <Link className="book book2" to={`/user/buycourse/${courseData._id}`}>
                                            Buy Now
                                        </Link>
                                    )}
                                </div>
                            </>
                        )}
                    </section>

                </div>
            </section>
        </>
    );
};

export default AdminUpdate;
