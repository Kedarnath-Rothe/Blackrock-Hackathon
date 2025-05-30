// import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { AdminLayout } from './components/layouts/AdminLayout';
import UserLayout from './components/layouts/UserLayout';
import About from './pages/About';
import Contact from './pages/Contact';
import Error from './pages/Error';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import Course from './pages/Service';

import Addcourse from './pages/Addcourse';
import AdminCourse from './pages/Admin-Course';
import AdminContacts from './pages/Admin-Contacts';
import AdminUpdate from './pages/Admin-Update';
import AdminUsers from './pages/Admin-Users';
import Bill from './pages/Bill';
import BuyCourse from './pages/BuyCourse';
import CourseUpdate from './pages/Course-Update';
import Coursedetail from './pages/Coursedetail';
import EmailVerify from './pages/EmailVerify';
import Managecourse from './pages/Managecourse';
import PasswordResetPage from './pages/PasswordResetPage';
import Updateuser from './pages/Updateuser';
import User_history from './pages/User_history';
// import Managecourse from './pages/Managecourse';
// import CourseUpdate from './pages/Course-Update';
// import AdminCourse from './pages/Admin-Course';

const App = () => { 

  return (
    <>
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/course' element={<Course/>} />
        <Route path='/register' element={<Register/>} />
        <Route path="/:id/verify/:token" element={<EmailVerify/>} />
        <Route path="/reset/:id/:token" element={<PasswordResetPage/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/logout' element={<Logout/>} /> 
        <Route path='/addcourse' element={<Addcourse/>} /> 
        <Route path='/*' element={<Error/>} /> 
        <Route path='/admin' element={<AdminLayout/>} />

        <Route path='/userhome' element={<UserLayout/>} />

        <Route path='/userhistory' element={<User_history/>} />

        <Route path='/admin/users' element = {<AdminUsers/>} />
        <Route path='/admin/user/:id/edit' element = {<AdminUpdate/>} />
        <Route path='/admin/contacts' element = {<AdminContacts/>} />

        <Route path='/admin/courses' element = {<AdminCourse/>} />
        <Route path='/admin/courses/:id/edit' element = {<CourseUpdate/>} />

        <Route path='/managecourse' element = {<Managecourse/>} /> 

        <Route path='/user/users/:id/edit'element = {<Updateuser/>} /> 

        <Route path='/user/coursedetails/:id'element = {<Coursedetail/>} /> 

        <Route path='/user/buycourse/:id' element = {<BuyCourse/>} />

        <Route path='/user/buycourse/bill/:id' element = {<Bill/>} />
      </Routes> 
      <Footer/>    
    </BrowserRouter>
    </>
  )
}

export default App
