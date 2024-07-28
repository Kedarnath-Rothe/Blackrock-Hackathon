import { FaUserEdit } from "react-icons/fa";
import { FaBookBible } from "react-icons/fa6";
import { IoMdLogOut } from "react-icons/io";
import { MdManageHistory } from "react-icons/md";
import { Circles } from 'react-loader-spinner';
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../store/auth";



const UserLayout = () => {

    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <>
            <div className="user-spinner">
                <Circles
                    height="600"
                    width="100"
                    color="#4fa94d"
                    ariaLabel="circles-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                />
            </div>
        </>
    }
    return (
        <>
            <section className="admin_section" style={{ minHeight: "80vh" }}>
                <div className="conatiner service_head" >
                    <div className="main-heading service_heading"> User DashBoard... </div>
                </div>
                <center>
                    <div className="admin_container grid" >

                        {/* First  */}
                        <div className="admin_pannel">
                            <div>
                                <img className="admin_image" src={`${user.image}`} alt="User Image" width="300" />
                                <h2> {user.username} </h2>
                                <h2> {user.email} </h2>
                                <h2> <i>+91 {user.phone}</i> </h2>

                                <br />

                                <NavLink className='navlink' to="/logout"><IoMdLogOut className="logout" /></NavLink>
                            </div>
                        </div>

                        {/* Second */}
                        <div className="admin_details">
                            <hr /> <br />
                            <h2> Hello Dear, {user.username} </h2> <br />
                            {/* <p> As the administrator of our car rental system, you hold considerable authority and responsibility. Your pivotal role is essential for guaranteeing the seamless operation of our service. </p> */}
                            <br />

                            <div className="card-container grid-links">
                                <NavLink to={`/user/users/${user._id}/edit`} >
                                    <div className="card">
                                        <FaUserEdit className="icons" />
                                        <h2>Edit Profile</h2>
                                    </div>
                                </NavLink>

                                <NavLink to='/userhistory' >
                                    <div className="card">
                                        <MdManageHistory className="icons" />
                                        <h2>Order History</h2>
                                    </div>
                                </NavLink>


                                <>
                                    <NavLink to="/course">
                                        <div className="card">
                                            <FaBookBible className="icons" />
                                            <h2>Buy Course</h2>
                                        </div>
                                    </NavLink>
                                </>


                            </div>

                            {
                                user.isAdmin && (
                                    <>
                                        <NavLink to="/admin">
                                            <button>Admin Pannel</button>
                                        </NavLink>
                                    </>
                                )
                            }


                        </div>

                    </div>
                </center>
            </section>
            <Outlet />
        </>
    )
}

export default UserLayout;

