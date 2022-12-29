import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom'
import Header from '../components/header/Header';
import Newsletters from '../components/layouts/Newsletters';
import Footer from '../components/footer/Footer';

import img from '../assets/images/background/img-register.jpg'
import img1 from "../assets/images/background/img-login.jpg";
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {auth} from "../firebase";

const Register = () => {
    const navigate = useNavigate();
    const [signUpForm, setSignUpForm] = useState({
        firstName: '', lastANme: '', username: '', email: '', password: '', confirmPassword: '',
    })

    const onSignUp = async () => {

        await createUserWithEmailAndPassword(auth, signUpForm.email, signUpForm.password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(user);
                navigate("/login")
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                // ..
            });


    }

    return <div>
        <Header/>
        <section className="fl-page-title">
            <div className="overlay"></div>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="page-title-inner flex">
                            <div className="page-title-heading">
                                <h2 className="heading">Sign Up</h2>
                            </div>
                            <div className="breadcrumbs">
                                <ul>
                                    <li><Link to="/">Home</Link></li>
                                    <li>Sign Up</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="tf-section login-page register-page">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-create-item-content">
                            <div className="form-create-item">
                                <div className="sc-heading">
                                    <h3>Create An Account</h3>
                                    <p className="desc">Most popular gaming digital nft market place </p>
                                </div>
                                <form id="create-item-1" action="#" method="GET" acceptCharset="utf-8">
                                    <div className="input-group">
                                        <input name="name" type="text" placeholder="First Name"
                                               required/>
                                        <input name="name" type="text" placeholder="Last Name" required/>
                                    </div>
                                    <div className="input-group">
                                        <input name="phone" type="text" placeholder="Phone Number"
                                               required/>
                                        <input name="name" type="text" placeholder="User Name" required/>
                                    </div>
                                    <input name="email" type="email" placeholder="Email Address"
                                           required
                                           onChange={(e) => setSignUpForm({...signUpForm, email: e.target.value})}/>
                                    <div className="input-group">
                                        <input name="password" type="password" placeholder="Password"
                                               required onChange={(e) => setSignUpForm({
                                            ...signUpForm,
                                            password: e.target.value
                                        })}/>
                                        <input name="password" type="password" placeholder="Re-Password"
                                               required/>
                                    </div>
                                    {/*<div className="input-group style-2 ">*/}
                                    {/*    <div className="btn-check">*/}
                                    {/*        <input type="radio" id="html" name="fav_language" className="mg-bt-0"*/}
                                    {/*            value="HTML" />*/}
                                    {/*        <label htmlFor="html">Remember Me</label>*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}
                                    <button
                                        className="sc-button style letter style-2" onClick={() => onSignUp()}><span>Register Now</span>
                                    </button>
                                    <div className="" style={{marginTop: 20, textAlign: "center"}}>
                                        <label>Already have an account?&nbsp;</label> <a href="/sign_in">Sign In</a>
                                    </div>
                                </form>
                                {/*<div className="other-login">*/}
                                {/*    <div className="text">Or</div>*/}
                                {/*    <div className="widget-social">*/}
                                {/*        <ul>*/}
                                {/*            <li><Link to="#" className="active"><i className="fab fa-facebook-f"></i></Link>*/}
                                {/*            </li>*/}
                                {/*            <li><Link to="#"><i className="fab fa-twitter"></i></Link></li>*/}
                                {/*            <li><Link to="#"><i className="fab fa-google-plus-g"></i></Link></li>*/}
                                {/*        </ul>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                            </div>
                            <div className="form-background" style={{height: "100%"}}>
                                <img src={img1} alt="skp" style={{borderRadius: "0px"}}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <Newsletters/>
        <Footer/>
    </div>;
};

export default Register;
