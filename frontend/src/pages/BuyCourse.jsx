import axios from 'axios';
import copy from 'copy-to-clipboard';
import { useEffect, useState } from "react";
import { FaShareFromSquare } from "react-icons/fa6";
import { Link, Navigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import { useAuth } from "../store/auth";


const UserUpdate = () => {


    const generateTransactionId = () => {
        const segments = [];

        // Generate 16 random digits (0-9)
        for (let i = 0; i < 16; i++) {
            const randomDigit = Math.floor(Math.random() * 10); // Generate a random digit (0-9)
            segments.push(randomDigit.toString()); // Add the digit to segments
        }

        // Insert dashes at specific positions to match the desired format
        return `T${segments.slice(0, 4).join('')}-${segments.slice(4, 8).join('')}-${segments.slice(8, 12).join('')}-${segments.slice(12).join('')}`;
    };


    const { user, isLoggedIn } = useAuth();

    const [courseData, setCourseData] = useState({
        courseName: "",
        price: "",
        phone: "",
        cust_id: user._id,
        total: ""
    });


    const params = useParams();
    // const navigate = useNavigate();
    const { authorizationToken } = useAuth();

    useEffect(() => {
        const getSingleCourseData = async () => {
            try {
                const response = await fetch(`https://blackrock-hackathon.vercel.app/api/auth/buycourse/${params.id}`, {
                    method: "GET",
                    headers: {
                        Authorization: authorizationToken,
                    }
                });

                if (response.ok) {
                    const courseData = await response.json();
                    setCourseData({ ...courseData, cust_id: user._id, cust_name: user.username, cust_phone: user.phone });
                } else {
                    // toast.error("Failed to fetch course data");
                }
            } catch (error) {
                console.log(error.message);
                toast.error("Failed to fetch course data");
            }
        };

        getSingleCourseData();
    }, [authorizationToken, params.id, user._id, user.username, user.phone]);


    const handleInput = (e) => {
        const { name, value } = e.target;
        setCourseData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    if (!isLoggedIn) {
        toast.error("Plese, You Have to Login Before Booking...")
        return <Navigate to="/" />
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Calculate total hours
            const startTime = new Date(courseData.start_date);
            const endTime = new Date(courseData.end_date);
            const timeDiff = Math.abs(endTime - startTime);
            const totalHours = Math.ceil(timeDiff / (1000 * 60 * 60));

            // Calculate total cost
            const totalPrice = totalHours * parseInt(courseData.price);
            const updatedCourseData = { ...courseData, total: totalPrice, booked: true, transaction_id: generateTransactionId() };

            const response = await fetch(`https://blackrock-hackathon.vercel.app/api/auth/buycourse/update/${params.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authorizationToken
                },
                body: JSON.stringify(updatedCourseData),
            });

            console.log(response);

            if (response.ok) {
                toast.success("Updated Successfully...");
                window.location.href = `/userhistory`;
            } else {
                toast.error("Not Updated...");
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleShare = () => {
        copy(window.location.href);
        toast.success("Link copied to clipboard")
    }

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
        <section className="section-contact section-car-book">
            <div className="contact-content container">
                <h1 className="main-heading"> Buy Course </h1>
            </div>
            <div className="car_container">
                <section className="car_form section-form">
                    <form onSubmit={handleSubmit}>

                        <div className="grid">
                            <div>
                                <div>
                                    <img src={`${courseData.image}`} />
                                </div>
                                <div>
                                    <input
                                        className="carname"
                                        type="text"
                                        name="courseName"
                                        id="coursename"
                                        autoComplete="off"
                                        value={courseData.courseName}
                                        onChange={handleInput}
                                        required
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className="grid_2">
                                <div className="a">
                                    {/* <label htmlFor="price"> Price </label> */}
                                    <p> $ {courseData.price} </p>
                                </div>

                                <Link style={{ marginLeft: "2rem" }} to="#" onClick={() => handleCallMeClick(courseData)}>
                                    call me
                                </Link>


                                <br />
                                <br />
                                <div className="b">
                                    <button type="submit"> Buy Now </button>
                                </div>
                                <FaShareFromSquare onClick={handleShare} style={{ margin: "2rem 0 0 3rem", fontSize: "2rem", cursor: "pointer" }} /> <span style={{ fontSize: "2rem" }}>share</span>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="details"> Description </label>
                            <p> {courseData.details} </p>
                        </div>

                        <br />
                    </form>
                </section>
            </div>
            <br />
            <br />
        </section>
    );
}

export default UserUpdate;
