 
import { useAuth } from '../store/auth';

const User_history = () => {
    const { courses, user } = useAuth();

    // Filter courses based on the user's ID
    const userCourses = courses.filter(course => course.cust_id === user._id);

     

    return (
        <>
            <section className="user_history_section">
               <div style={{marginTop:"4rem"}}><center><h1>Course History...!</h1></center></div>
                <div style={{minHeight:"70vh"}} className='container admin-users'>
                    {userCourses.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Serial No</th>
                                    <th>Course Name</th>
                                    <th>Image</th>
                                    <th>Transaction Id</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userCourses.map((course, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td> {/* Autoincrement serial number */}
                                        <td>{course.courseName}</td>
                                        <td>
                                            <img src={`${course.image}`} alt={course.courseName} style={{ width: '100px' }} />
                                        </td>
                                        <td>{course.transaction_id}</td>
                                        <td>{course.booked ? 'Booked' : 'Available'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <h2 style={{margin:"auto",color:"red", fontSize:"3rem"}}>No Course found for this user.</h2>
                    )}
                </div>
                <div> 
            </div>
            </section>
        </>
    );
};

export default User_history;
