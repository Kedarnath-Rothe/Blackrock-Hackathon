import axios from 'axios';
import { useEffect, useState } from "react";
import { RotatingLines } from 'react-loader-spinner';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from "../store/auth";

const Addcourse = () => {

    const [img, setImg] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const [course, setCourse] = useState({
        courseName: "",
        price: "", 
        details: "",
        category: "", // New state variable for the product category
        tags: "" // New state variable for tags as a string
    });

    const { user, isLoading } = useAuth();

    useEffect(() => {
        // Pre-fill username and phone if available
        if (!isLoading && user) {
            setCourse(prevState => ({
                ...prevState, 
            }));
        }
    }, [user, isLoading]);


    if (isLoading) {
        return <h1>Loading ...</h1>
    }

    if (!user.isAdmin && !user.car_provider) {
        return <Navigate to="/" />
    }

    const handleInput = (e) => {
        const { name, value } = e.target;

        // If the input is an image, update the image state
        if (name === "image") {
            setImg(e.target.files[0]);
        } else {
            setCourse({
                ...course,
                [name]: value
            });
        }
    };

    // Upload
    const uploadFile = async (type) => {
        const data = new FormData();
        data.append("file", img);
        data.append("upload_preset", type === 'image' ? 'images_preset' : 'videos_preset');

        try {
            let cloudName = 'diyw5ilre';
            let resourceType = type === 'image' ? 'image' : 'video';
            let api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

            const res = await axios.post(api, data);
            const { secure_url } = res.data;
            console.log(secure_url);
            return secure_url;
        } catch (error) {
            console.error(error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            setLoading(true);

            const imgUrl = await uploadFile('image');

            console.log(imgUrl);

            const formData = new FormData();
            formData.append("courseName", course.courseName);
            formData.append("price", course.price); 
            formData.append("details", course.details);
            formData.append("category", course.category); // Append category to formData
            formData.append("tags", course.tags); // Append tags as a string

            const response = await fetch('https://blackrock-hackathon.vercel.app/api/data/addCourse', {
                method: "POST",
                headers: {
                    "X-Additional-Info": imgUrl // Custom header with additional info
                },
                body: formData,
            });

            const responseData = await response.json();

            if (response.ok) {
                toast.success("Course registration successful");
                setCourse({
                    courseName: "",
                    price: "", 
                    details: "",
                    image: null, // Reset the image field after submission
                    category: "",
                    tags: ""
                });
                setLoading(false);
                if (user.isAdmin) {
                    navigate('/admin');
                    // window.location.reload();
                }
                else {
                    navigate('/userhome');
                    window.location.reload();
                }
            } else {
                toast.error(responseData.message);
            }
        } catch (error) {
            console.error("ERROR", error);
        }
    };

    return (
        <>
            <section>
                <main>
                    <div className="section-registration">
                        <div className="container grid grid-two-cols">
                            <div className="registration-image">
                                <img className="register_image" src="/images/addcar.png" alt="Register image" />
                            </div>

                            {/* Tackle registration form */}
                            <div className="registration-form" >
                                <h1 className="main-heading mb-3"> Add Your Course </h1>
                                <br />

                                <div className="form">
                                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                                        <div>
                                            <label htmlFor="courseName">Course Name</label>
                                            <input
                                                type="text"
                                                name="courseName"
                                                placeholder="Course Name"
                                                id="courseName"
                                                required
                                                autoComplete="off"
                                                value={course.courseName}
                                                onChange={handleInput}
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="price">Price</label>
                                            <input
                                                type="number"
                                                name="price"
                                                placeholder="Enter Price"
                                                id="price"
                                                required
                                                autoComplete="off"
                                                value={course.price}
                                                onChange={handleInput}
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="category">Category</label>
                                            <select
                                                className='category-select'
                                                name="category"
                                                id="category"
                                                value={course.category}
                                                onChange={handleInput}
                                                required
                                            >
                                                <option value="">Select Category</option>
                                                <option value="Loans">Loans</option>     
                                                <option value="INVESTMENT">INVESTMENT</option>             
                                                <option value="Funding">Financial Advice</option>          
                                                <option value="INSURANCE">INSURANCE</option>          {/* Creta, Venue, i20, Verna */}
                                                <option value="TAX PLANNING">TAX PLANNING</option>             
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="details">Description</label>
                                            <textarea
                                                name="details"
                                                id="details"
                                                autoComplete="off"
                                                value={course.details}
                                                onChange={handleInput}
                                                required
                                                cols="30"
                                                rows="2"
                                            ></textarea>
                                        </div>

                                        {/* Add image input field */}
                                        <div>
                                            <label htmlFor="image">Course Image</label>
                                            <input
                                                type="file"
                                                name="image"
                                                id="image"
                                                accept="image/*"
                                                onChange={(e) => setImg(() => e.target.files[0])}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="tags">Tags</label>
                                            <input
                                                type="text"
                                                name="tags"
                                                placeholder="Enter tags separated by commas"
                                                id="tags"
                                                autoComplete="off"
                                                value={course.tags}
                                                onChange={handleInput}
                                            />
                                        </div>

                                        {
                                            loading && (<RotatingLines
                                                visible={true}
                                                height="96"
                                                width="96"
                                                color="grey"
                                                strokeWidth="5"
                                                animationDuration="0.75"
                                                ariaLabel="rotating-lines-loading"
                                                wrapperStyle={{}}
                                                wrapperClass=""
                                            />)

                                        }

                                        <button type="submit" className="btn btn-submit">
                                            Add Course
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </section>
        </>
    );
};

export default Addcourse;
