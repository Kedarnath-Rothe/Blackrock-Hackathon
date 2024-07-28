import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { useAuth } from "../store/auth";

const AdminCourse = () => {
  const [course, setCourse] = useState([]);
  const { authorizationToken, user } = useAuth();
  const navigate = useNavigate();

  const getAllCoursesData = async () => {
    try {
      const response = await fetch("https://blackrock-hackathon.vercel.app/api/admin/courses", {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        }
      });

      if (!response.ok) {
        toast.error("Failed to fetch Courses");
        navigate('/admin');
        return;
      }

      const data = await response.json();
      setCourse(data);

    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    getAllCoursesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user.isAdmin) {
    return <Navigate to="/" />;
  }

  
  const deleteCourse = async (id) => {
    try {
      const response = await fetch(`https://blackrock-hackathon.vercel.app/api/admin/courses/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: authorizationToken,
        }
      });

      if (response.ok) {
        getAllCoursesData();
        toast.success("Course deleted successfully");
      } else {
        toast.error("Failed to delete course");
      }

    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <>
      <section className="admin-cars-section">
        <div style={{ marginTop: "4rem" }}>
          <center><h1>Courses Data</h1></center>
        </div>
        <div className="container admin-cars">
          <table>
            <thead>
              <tr>
                <th>Sr no.</th>
                <th>Course Name</th>
                <th>Price</th>   
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {course.map((currCourse, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{currCourse.courseName}</td>
                  <td>${currCourse.price}</td>
                  <td className="edit">
                    <button>
                      <Link className="edit" style={{ color: "white" }} to={`/admin/courses/${currCourse._id}/edit`}>Edit</Link>
                    </button>
                  </td>
                  <td className="delete">
                    <button onClick={() => deleteCourse(currCourse._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <br/>
      <br/>
      <br/>
    </>
  );
}

export default AdminCourse;
