import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import '../../../../../node_modules/react-quill/dist/quill.snow.css'
// style
import "./user-action.scss";
// react icons
import { FaTimes, FaUser, FaCamera, FaCheckCircle } from 'react-icons/fa';
import { FaPhone, FaLocationDot } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
// for bio 
import { SiStartpage } from "react-icons/si";
import { MdEdit } from "react-icons/md";



// context
import { useUser } from '../../../../context/userContext';
import { useMessage } from '../../../../context/messageContext';

// for redirect
import { useNavigate } from 'react-router-dom';

import {
    userProfilePicture,
    requestOTPForPasswordReset,
    requestUserEmailOtpVerificationPasswordReset
} from '../../../../api/userAPI';

// dependency
import OtpInput from 'react-otp-input';

const Profile = () => {

    //logout
    let { user, fetchUserProfile, logout } = useUser();
    let { triggerMessage } = useMessage();
    // top navigate user on home page
    let navigate = useNavigate();

    let [triggerProfilePictureChange, setTriggerProfilePictureChange] = useState(false);
    let [selectedImage, setSelectedImage] = useState(null);
    let [previewUrl, setPreviewUrl] = useState(null);

    // password reset status
    const [showPasswordReset, setShowPasswordReset] = useState(false);
    const [resetStep, setResetStep] = useState(1);
    const [resetOtp, setResetOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // bio pop up
    const [showBioPopup, setShowBioPopup] = useState(false);
    const [value,setValue] = useState('');
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            triggerMessage("warning", "invalid/missing file !");
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            triggerMessage("warning", "invalid/missing file !");
        }
    };

    const handleProfilePictureUpload = async () => {
        let formData = new FormData();
        formData.append("file", selectedImage);

        try {
            let token = localStorage.getItem("token");
            let result = await userProfilePicture(token, formData);

            console.log(result);

            setTriggerProfilePictureChange(false);
            triggerMessage("success", "Profile picture uploaded!");
            fetchUserProfile();
            setPreviewUrl(null);
            setSelectedImage(null);

        } catch (err) {
            setTriggerProfilePictureChange(false);
            triggerMessage("danger", err?.response?.data?.message || "Upload failed");
        }
    };

    return (
        <>
            <div id='user-profile' className='shadow'>
                <div className='bg-black'></div>
                <div className='information'>
                    <div className='pnpa'>
                        <div className='profile-picture'>
                            {
                                user.logedIn ?
                                    user.profile_picture ?
                                        <>
                                            <img
                                                src={
                                                    user.profile_picture
                                                        ? `${import.meta.env.VITE_BASE_API_URL}/uploads/profile_pictures/${user.profile_picture}`
                                                        : "/default-avatar.png"
                                                }
                                                alt="Profile Picture"
                                                className="w-32 h-32 rounded-full object-cover"
                                            />
                                            <button
                                                onClick={() => setTriggerProfilePictureChange(true)}
                                                className='bg-primary px-2 py-1 bg-white rounded hover:bg-yellow-800 z-10'
                                                style={{ cursor: 'pointer', display: showPasswordReset || showBioPopup?'none':'block' }}
                                                // fine
                                            >
                                                <FaCamera />
                                            </button>
                                        </>
                                        :
                                        <button
                                            onClick={() => setTriggerProfilePictureChange(true)}
                                            className='bg-primary px-2 py-1 text-light bg-dark rounded hover:bg-dark'
                                        >
                                            <FaCamera />
                                        </button>
                                    : null
                            }

                            {triggerProfilePictureChange && (
                                <div className='profile-picture-change'>
                                    <div className='picture-change-container rounded relative'>
                                        <button
                                            onClick={() => {
                                                setSelectedImage(null);
                                                setPreviewUrl(null);
                                                setTriggerProfilePictureChange(false);
                                            }}
                                            className='bg-red-600 p-2 rounded-full absolute text-white start-full top-0 -translate-x-1/2 -translate-y-1/2'
                                        >
                                            <FaTimes />
                                        </button>
                                        <div className='content flex justify-center items-center p-52' style={{backgroundColor:'yellow'}}>
                                            <div
                                                className='grow upload-area bg border border-dashed border-dark p-5 rounded' onDrop={handleDrop} onDragOver={handleDragOver}
                                            >
                                                <label htmlFor="profileImage" className='cursor-pointer'>
                                                    {
                                                        previewUrl ? (
                                                            <div className='flex justify-center items-center flex-col gap-3'>
                                                                <span className='font-bold'>Your Selected Profile Picture !</span>
                                                                <img src={previewUrl} className='h-40 w-40' />
                                                            </div>
                                                        ) : (
                                                            <div className='flex flex-col items-center justify-center gap-3'>
                                                                <span>Drag & Drop Profile Picture Here !</span>
                                                                <span className='bg-blue-200 rounded p-2'>or <b>Click</b> to select.</span>
                                                            </div>
                                                        )
                                                    }
                                                </label>

                                                <input
                                                    type="file"
                                                    id='profileImage'
                                                    accept='image/*'
                                                    onChange={handleFileSelect}
                                                    className='hidden'
                                                />

                                                {selectedImage && (
                                                    <div className='flex justify-center my-10'>
                                                        <button
                                                            onClick={handleProfilePictureUpload}
                                                            className='bg-primary text-light font-bold px-3 py-1 cursor-pointer hover:bg-blue-500'
                                                        >
                                                            Upload
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className='user-info-container p-5 flex flex-col gap-3'>
                            <div className='flex gap-3 p-3 shadow'>
                                <div className='flex items-center gap-3'>
                                    <span className='user-info-icon'>
                                        <FaUser />
                                    </span>
                                    <span>{user.logedIn ? user.name : null}</span>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <span className='user-info-icon'>
                                        <FaPhone />
                                    </span>
                                    <span>{user.logedIn ? user.phone : null}</span>
                                </div>
                            </div>
                            <div className='flex gap-3 p-3 shadow'>
                                <div className='flex items-center gap-3'>
                                    <span className='user-info-icon'>
                                       <SiStartpage />
                                    </span>
                                    
                                    <span>{user.logedIn ? user.bio : null}</span>

                                    <span style={{display:user.bio?'none':'block'}}>
                                        <button className='hover:cursor-pointer border-none p-2 rounded italic bg-blue-200 hover:bg-blue-700 hover:text-white'
                                        onClick={() => setShowBioPopup(true)}
                                        >Click here to add your bio</button>
                                    </span>
                                    <span style={{display:user.bio?'block':'none'}}>
                                        <MdEdit />
                                    </span>

                                    
                                </div>
                            </div>
                            <div className='p-3 shadow'>
                                <div className='flex items-center gap-3'>
                                    <span className='user-info-icon'>
                                        <IoMdMail />
                                    </span>
                                    <span>{user.logedIn ? user.email.userEmail : null}</span>
                                    <FaCheckCircle className={`${user.logedIn ? user.email.verified ? "text-green-500" : "" : ""}`} />
                                </div>
                            </div>
                            <div className='p-3 shadow'>
                                <span className='flex gap-3 items-center'>
                                    <span className='user-info-icon'>
                                        <FaLocationDot />
                                    </span>
                                    {
                                        user.logedIn ?
                                            `${user.address.street}, ${user.address.city}, ${user.address.state}, ${user.address.country}, ${user.address.pincode}`
                                            : null
                                    }
                                </span>
                            </div>
                        </div>

                        



                        {/* reset password button and resume upload button  */}
                        <div className='p-3 flex gap-4'>
                            <button
                                onClick={() => {
                                    setShowPasswordReset(true);
                                    setResetStep(1);
                                }}
                                className="bg-primary text-light px-4 py-2 rounded bg-blue-500 hover:bg-blue-700 font-medium cursor-pointer"
                            >
                                Change Password
                            </button>

                            <button
                                onClick={() => setTriggerEditForm(true)}
                                className='bg-primary p-1 text-light rounded hover:bg-dark cursor-pointer'
                            >
                                Upload Resume
                            </button>
                        </div>
                    </div>

                    <div className='reports p-3'>
                        <div className='applied-jobs rounded flex flex-col justify-center items-center gap-4 text-dark'>
                            <span className='text-4xl'>
                                {user.logedIn ? user.appliedJobs.length : 0}
                            </span>
                            <span className='font-bold'>Applied Jobs</span>
                        </div>
                        <div className='profile-selected rounded flex flex-col justify-center items-center gap-4 text-dark'>
                            <span className='text-4xl'>0</span>
                            <span className='font-bold'>Profile Selected</span>
                        </div>
                    </div>
                    <div className='documents'></div>
                </div>
            </div>

            {showBioPopup && (
                <div className='fixed inset-0 bg-black  z-50 flex items-center justify-center p-4'>
                    <div className='bg-white rounded-lg  relative' style={{ width: '100vw', height: '500px' }}>
                        <button
                            onClick={() => setShowBioPopup(false)}
                            className='absolute top-4 right-4 text-gray-600 hover:text-red-600 z-10'
                        >
                            <FaTimes size={28} />
                        </button>
                        <div className='p-10 h-full flex flex-col items-center justify-center text-center'>
                            <h2 className='text-2xl font-bold mb-6'>Add Your Bio</h2>
                            
                            <ReactQuill theme='snow' className='w-full' value={value} onChange={setValue}/>

                            <button className='mt-6 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 hover:cursor-pointer'>
                                Save Bio
                            </button>
                        </div>
                    </div>
                </div>
            )}



            {showPasswordReset && (
                <div className='fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4'>
                    <div className='bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative'>
                        <button
                            onClick={() => {
                                setShowPasswordReset(false);
                                setResetStep(1);
                                setResetOtp("");
                                setNewPassword("");
                                setConfirmPassword("");
                            }}
                            className='absolute top-4 right-4 text-3xl text-gray-500 hover:text-red-600'
                        >
                            <FaTimes />
                        </button>

                        <h3 className='text-2xl font-bold text-center mb-8 text-primary'>
                            {resetStep === 1 ? "Request Password Reset" : "Set New Password"}
                        </h3>

                        {resetStep === 1 ? (
                            <div className='space-y-6'>
                                <div>
                                    <label className='block text-sm font-medium mb-2'>Your Email</label>
                                    <input
                                        type="email"
                                        value={user.email.userEmail}
                                        readOnly
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100'
                                    />
                                </div>
                                <button
                                    onClick={async () => {
                                        try {
                                            await requestOTPForPasswordReset(user.email.userEmail);
                                            triggerMessage("success", "OTP sent successfully!");
                                            setResetStep(2);
                                        } catch (err) {
                                            triggerMessage("danger", "Failed to send OTP");
                                        }
                                    }}
                                    className='w-full bg-primary text-white py-4 rounded-lg font-bold bg-blue-500 hover:bg-blue-700  text-lg cursor-pointer'
                                >
                                    Send OTP
                                </button>
                            </div>
                        ) : (
                            <div className='space-y-6'>
                                <div>
                                    <label className='block text-sm font-medium mb-3'>Enter OTP</label>
                                    <OtpInput value={resetOtp} onChange={setResetOtp} numInputs={4} renderInput={(props) => (
                                            <input {...props} className='h-16 text-2xl text-center border-2 border-gray-300 rounded-lg mx-2 focus:border-primary ' style={{width:'50px'}} />
                                        )}
                                    />
                                </div>

                                <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary '
                                />

                                <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary '
                                />
                                <button
                                    onClick={async () => {
                                        if (newPassword !== confirmPassword) {
                                            triggerMessage("danger", "Passwords do not match!");
                                            return;
                                        }
                                        if (newPassword.length < 6) {
                                            triggerMessage("danger", "Password must be at least 6 characters");
                                            return;
                                        }

                                        try {
                                            await requestUserEmailOtpVerificationPasswordReset({
                                                email: user.email.userEmail,
                                                userOtp: resetOtp,
                                                newPassword,
                                            });
                                            triggerMessage("success", "Password changed successfully! Logging out...");
                                            setShowPasswordReset(false);
                                            setTimeout(() => {
                                                logout();
                                                navigate("/user-login-register");
                                            }, 2000);
                                        } catch (err) {
                                            triggerMessage("danger", "Invalid OTP or server error");
                                        }
                                    }}
                                    className='w-full bg-green-600 text-white py-4 rounded-lg font-bold hover:bg-green-700 text-lg cursor-pointer'
                                >
                                    Update Password
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default Profile;