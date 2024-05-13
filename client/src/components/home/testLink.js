import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './home.css';

// function SingleMemberItem() {
export const SingleMemberItem = (props) => {
    console.log(props);
    return (
        <>
            <div className="memberItem">
                <Link to='/profile/2' className='userProfileLink'>
                    AH
                </Link>
                <div className="memberStatus">
                    Admin
                </div>
            </div>
        </>
    );
}

export const TrialAndError = (props) => {
    // console.log(props);
    
    return(
        <>
            <div className="memberItem">
                <Link to='/profile/2' className='userProfileLink'>
                    AH
                </Link>
                <div className="memberStatus">
                    Admin
                </div>
            </div>
        </>
    )
}

// export default SingleMemberItem;
