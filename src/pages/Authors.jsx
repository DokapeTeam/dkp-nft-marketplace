import React from 'react';
import {Link, useNavigate} from 'react-router-dom'
import Header from '../components/header/Header';
import BestSeller from '../components/layouts/BestSeller';
import dataBestSeller from '../assets/fake-data/dataBestSeller';
import TopSeller from '../components/layouts/authors/BestSeller';
import HotCollection from '../components/layouts/authors/HotCollection';
import dataHotCollection2 from '../assets/fake-data/dataHotCollection2';
import Newsletters from '../components/layouts/Newsletters';
import Footer from '../components/footer/Footer';
import {signOut} from "firebase/auth";
import {auth} from "../firebase";

const Authors = () => {
    const navigate = useNavigate();
    console.log('User UID',auth.currentUser.uid)

    const handleSignOut = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            navigate("/");
            console.log("Signed out successfully")
        }).catch((error) => {
            // An error happened.
        });
    }

    return <div className='authors'>
        <Header/>
        <section className="fl-page-title">
            <div className="overlay"></div>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="page-title-inner flex">
                            <div className="page-title-heading">
                                <h2 className="heading">Profile</h2>
                            </div>
                            <div className="breadcrumbs">
                                <ul>
                                    <li><Link to="/">Home</Link></li>
                                    <li onClick={() => handleSignOut()}>Profile</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <BestSeller data={dataBestSeller}/>
        <TopSeller data={dataBestSeller}/>
        <HotCollection data={dataHotCollection2}/>
        <Newsletters/>
        <Footer/>
    </div>;
};

export default Authors;
