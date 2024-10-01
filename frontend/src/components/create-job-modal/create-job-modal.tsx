import './create-job-modal.module.css';

import React, { useState } from 'react';
import axios from 'axios'; // For making API requests
import { backendUrl } from '../../backend';

interface CreateJobModalProps {
    onClose: any;
}

const CreateJobModal = (props: CreateJobModalProps) => {
    const [jobDescription, setJobDescription] = useState('');
    const [jobRequirements, setJobRequirements] = useState('');
    const [posterId, setPosterId] = useState('default-user-id');
    const [contactInfo, setContactInfo] = useState({
        email: '',
        phone: ''
    });
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const handleContactInfoChange = (e) => {
        const { name, value } = e.target;
        setContactInfo((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            // Set the auction to start today and end tomorrow.
            const auctionStartDate = new Date();
            const auctionEndDate = new Date();
            auctionEndDate.setDate(auctionStartDate.getDate() + 1);

            // TODO: Update REST API to handle submitting contact info.
            const jobData = {
                description: jobDescription,
                requirements: [jobRequirements],
                posterId: posterId,
                auctionStartDate: auctionStartDate,
                auctionEndDate: auctionEndDate,
            };

            // Send POST request to create the job
            const url = `${backendUrl}/jobs`;
            const response = await axios.post(url, jobData);
            setStatusMessage('Job created successfully!');

            setTimeout(() => {
                setStatusMessage(null);
                props.onClose(); // Close modal after success
            }, 3000);
        } catch (error) {
            setStatusMessage('Failed to create the job. Please try again.');

            setTimeout(() => setStatusMessage(null), 3000);
        }
    };

    return (
        <div className="create-job-modal">
            <h3>Create Job</h3>
            <label>
                Job Description:
                <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Enter job description"
                />
            </label>

            <label>
                Job Requirements:
                <textarea
                    value={jobRequirements}
                    onChange={(e) => setJobRequirements(e.target.value)}
                    placeholder="Enter job requirements"
                />
            </label>

            <label>
                Poster Name:
                <input
                    type="text"
                    value={posterId}
                    onChange={(e) => setPosterId(e.target.value)}
                    placeholder="Enter poster's name"
                />
            </label>

            <label>
                Poster Contact Info (Email):
                <input
                    type="email"
                    name="email"
                    value={contactInfo.email}
                    onChange={handleContactInfoChange}
                    placeholder="Enter poster's email"
                />
            </label>

            <label>
                Poster Contact Info (Phone):
                <input
                    type="tel"
                    name="phone"
                    value={contactInfo.phone}
                    onChange={handleContactInfoChange}
                    placeholder="Enter poster's phone"
                />
            </label>

            <div className="modal-buttons">
                <button onClick={handleSubmit}>Submit</button>
                <button onClick={props.onClose}>Cancel</button>
            </div>

            {/* Display success or failure message */}
            {statusMessage && <div className="status-message">{statusMessage}</div>}
        </div>
    );
};

export default CreateJobModal;
