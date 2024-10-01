import React, { useState } from 'react';
import { Job } from '../../backend';

import BidModal from '../bid-modal/bid-modal';

interface JobDetailsPanelProps {
    selectedJob: Job;
}


const JobDetailsPanel = (props: JobDetailsPanelProps) => {
    const [isBidModalOpen, setBidModalOpen] = useState(false);

    const handlePlaceBidClick = () => {
        setBidModalOpen(true); // Open the bid modal when button is clicked
    };

    const closeModal = () => {
        setBidModalOpen(false); // Close the modal when necessary
    };

    return (
        <div className="job-details-panel">
            <h2>{props.selectedJob.description}</h2>
            <p>Posted by: {props.selectedJob.poster.name}</p>
            <p>Description: {props.selectedJob.description}</p>

            <button onClick={handlePlaceBidClick}>Place Bid</button> {/* Place Bid button */}

            {/* Render the BidModal if it's open */}
            {isBidModalOpen && (
                <BidModal jobId={props.selectedJob.id} onClose={closeModal} />
            )}
        </div>
    );
};

export default JobDetailsPanel;
