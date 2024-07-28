// import { useEffect, useState } from "react";
import { Navigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { useAuth } from "../store/auth";

const Managecourse = () => {

    const { courses } = useAuth();

    const { user, isLoading } = useAuth();

    const { authorizationToken } = useAuth();

    if (isLoading) {
        return <h1>Loading ...</h1>
    }

    if (!user.isAdmin && !user.car_provider) {
        return <Navigate to="/" />
    }

    const deleteCourse = async (id) => {
        try {
            const response = await fetch(`https://blackrock-hackathon.vercel.app/api/admin/courses/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: authorizationToken,
                }
            });

            console.log(response);
            toast.success("course Deleted successfully");
            window.location.reload();

        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <>
            <section className="admin-cars-section">
                <div style={{marginTop:"4rem"}}>
                    <center><h1>My course Data</h1></center>
                </div>
                <div className="container admin-cars">
                    <table>
                        <thead>
                            <tr>
                                <th>Course Name</th>
                                <th>Status</th>
                                <th>Paid</th>
                                <th>Image</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((curCourse, index) => {
                                // Check if the current course has an associated phone number
                                if (curCourse.owner_phone == user.phone) {
                                    return (
                                        <tr key={index}>
                                            <td>{curCourse.courseName}</td>
                                            <td>
                                                {
                                                    curCourse.booked ? (
                                                        <span>Booked by {curCourse.cust_name} <br /> <p>{curCourse.cust_phone}</p></span>
                                                    ) : (
                                                        <span>Available</span>
                                                    )
                                                }
                                            </td>
                                            <td> Rs.{curCourse.total} </td>
                                            <td>
                                                <img src={`${curCourse.image}`} alt="Course" width="100" />
                                            </td>
                                            <td className="delete">
                                                <button onClick={() => deleteCourse(curCourse._id)}>Delete</button>
                                            </td>
                                        </tr>
                                    );
                                } else {
                                    return null; // Skip rendering if the condition isn't met
                                }
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
}

export default Managecourse;