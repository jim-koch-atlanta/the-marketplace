import './bid-modal.module.css';

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios'; // Use axios for API calls
import { backendUrl, defaultUser } from '../../backend';

interface BidModalProps {
    jobId: number;
    onClose: any
}

const BidModal = (props: BidModalProps) => {
    const [bidAmount, setBidAmount] = useState('');
    const [statusMessage, setStatusMessage] = useState<string | null>(null); // To hold success or failure message
    const [isSubmitting, setIsSubmitting] = useState(false); // To disable submit button while submitting

    const handleBidChange = (e: any) => {
        setBidAmount(e.target.value); // Track the bid input value
    };

    const handleSubmit = async () => {
        try {
            const bid = {
                bidId: uuidv4(),
                amount: bidAmount,
                bidderId: defaultUser.id
            };
            // Send the POST request to the appropriate API endpoint
            const response = await axios.post(`${backendUrl}/jobs/${props.jobId}/bids`, bid);

            // Show success message
            setStatusMessage('Bid submitted successfully!');

            // Automatically close the message after 3 seconds
            setTimeout(() => {
                setStatusMessage(null);
                props.onClose(); // Close the modal after success
            }, 3000);
        } catch (error) {
            // Show failure message
            setStatusMessage('Failed to submit the bid. Please try again.');

            // Automatically hide the message after 3 seconds
            setTimeout(() => setStatusMessage(null), 3000);
        } finally {
            setIsSubmitting(false); // Re-enable the submit button
        }
    };

        return (
            <div className="bid-modal">
            <h3>Place a Bid</h3>
            <label>
              Bid Amount:
              <input
                type="number"
                value={bidAmount}
                onChange={handleBidChange}
                placeholder="Enter your bid"
                disabled={isSubmitting} // Disable input while submitting
              />
            </label>
      
            <div className="modal-buttons">
              <button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'} {/* Show loading state */}
              </button>
              <button onClick={props.onClose} disabled={isSubmitting}>Cancel</button>
            </div>
      
            {/* Display success or failure message */}
            {statusMessage && (
              <div className="status-message">
                {statusMessage}
              </div>
            )}
          </div>
        );
    };

    export default BidModal;
