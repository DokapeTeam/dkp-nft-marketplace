import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Header from '../components/header/Header';
import Newsletters from '../components/layouts/Newsletters';
import Footer from '../components/footer/Footer';

import {signInWithEmailAndPassword, signInWithPopup} from 'firebase/auth';
import img1 from '../assets/images/background/img-login.jpg'
import {auth, provider} from "../firebase";

const Login = () => {

    const navigate = useNavigate();
    const [signInForm, setSignInForm] = useState({
        email: '', password: '',
    })

    function signIn() {
        signInWithEmailAndPassword(auth, signInForm.email, signInForm.password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                navigate("/")
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
            });
    }

    const signInWithGoogle = () => {
        signInWithPopup(auth, provider).then((result) => {
            console.log(result)
            // navigate("/")
        }).catch((error) => {
            console.log(error)
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
                                <h2 className="heading">Sign In</h2>
                            </div>
                            <div className="breadcrumbs">
                                <ul>
                                    <li><Link to="/">Home</Link></li>
                                    <li>Sign In</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="tf-section login-page">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-create-item-content">
                            <div className="form-create-item">
                                <div className="sc-heading">
                                    <h3>Login Your Account</h3>
                                    <p className="desc">Most popular gaming digital nft market place </p>
                                </div>
                                <div id="create-item-1">
                                    <input name="user" type="text" placeholder="User Name/Email Address"
                                           required
                                           onChange={(e) => setSignInForm({...signInForm, email: e.target.value})}/>
                                    <input name="number" type="password" placeholder="Password"
                                           required
                                           onChange={(e) => setSignInForm({...signInForm, password: e.target.value})}/>
                                    <div className="input-group style-2 ">
                                        <div className="btn-check">
                                            <input type="radio" id="html" name="fav_language" value="HTML"/>
                                            <label htmlFor="html">Remember Me</label>
                                        </div>
                                    </div>
                                    <button className="sc-button style letter style-2" onClick={() => signIn()}><span>Sign In</span>
                                    </button>
                                    <div className="" style={{marginTop: 20, textAlign: "center"}}>
                                        <label>Don't have an account yet?&nbsp;</label> <a href="/sign_up">Sign Up</a>
                                    </div>
                                </div>
                                <div className="other-login">
                                    <div className="text">Or</div>
                                    <div className="widget-social">
                                        <ul>
                                            {/*<li><Link to="#" className="active"><i className="fab fa-facebook-f"></i></Link>*/}
                                            {/*</li>*/}
                                            {/*<li><Link to="#"><i className="fab fa-twitter"></i></Link></li>*/}
                                            <li><Link to="#" onClick={() => signInWithGoogle()}><i
                                                className="fab fa-google-plus-g"></i></Link></li>
                                        </ul>
                                    </div>
                                </div>
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

export default Login;
