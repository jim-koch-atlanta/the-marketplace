import requests
import uuid
from datetime import datetime, timedelta

BASE_URL = 'http://localhost:3000/api'

# Function to create a user
def create_user(name, email, phone=None):
    user_data = {
        'id': str(uuid.uuid4()),
        'name': name,
        'emailAddress': email,
        'phoneNumber': phone,
    }
    response = requests.post(f'{BASE_URL}/users', json=user_data)
    if response.status_code == 201:
        print(f"User {name} created successfully!")
    else:
        print(f"Failed to create user {name}: {response.text}")
    return user_data['id']


# Function to create a job
def create_job(description, requirements, poster_id):
    job_data = {
        'id': str(uuid.uuid4()),
        'description': description,
        'requirements': requirements,
        'posterId': poster_id,
        'auctionStartDate': datetime.now().isoformat(),
        'auctionEndDate': (datetime.now() + timedelta(days=7)).isoformat(),
    }
    response = requests.post(f'{BASE_URL}/jobs', json=job_data)
    if response.status_code == 201:
        print(f"Job '{description}' created successfully!")
    else:
        print(f"Failed to create job '{description}': {response.text}")
    return job_data['id']


# Function to place a bid
def place_bid(job_id, bidder_id, amount):
    bid_data = {
        'bidId': str(uuid.uuid4()),
        'amount': str(amount),
        'bidderId': bidder_id,
    }
    response = requests.post(f'{BASE_URL}/jobs/{job_id}/bids', json=bid_data)
    if response.status_code == 201:
        print(f"Bid of {amount} placed on job {job_id} by bidder {bidder_id}!")
    else:
        print(f"Failed to place bid on job {job_id}: {response.text}")


def main():
    # Create users
    user1_id = create_user('John Doe', 'john@example.com')
    user2_id = create_user('Jane Smith', 'jane@example.com')
    user3_id = create_user('Jim Brown', 'jim@example.com')
    user4_id = create_user('Sara White', 'sara@example.com')

    # Create jobs
    job1_id = create_job('Job 1 Description', ['JavaScript', 'React'], user1_id)
    job2_id = create_job('Job 2 Description', ['Python', 'Django'], user2_id)
    job3_id = create_job('Job 3 Description', ['Java', 'Spring'], user3_id)
    job4_id = create_job('Job 4 Description', ['C++', 'Qt'], user4_id)
    job5_id = create_job('Job 5 Description', ['Go', 'Kubernetes'], user1_id)
    job6_id = create_job('Job 6 Description', ['PHP', 'Laravel'], user2_id)
    job7_id = create_job('Job 7 Description', ['Ruby', 'Rails'], user3_id)
    job8_id = create_job('Job 8 Description', ['C#', 'ASP.NET'], user4_id)
    job9_id = create_job('Job 9 Description', ['Node.js', 'Express'], user1_id)
    job10_id = create_job('Job 10 Description', ['Rust', 'Actix'], user2_id)

    # Place bids on jobs
    # 5 bids on job 1
    place_bid(job1_id, user2_id, 100)
    place_bid(job1_id, user3_id, 110)
    place_bid(job1_id, user4_id, 120)
    place_bid(job1_id, user2_id, 130)
    place_bid(job1_id, user3_id, 140)

    # 4 bids on job 2
    place_bid(job2_id, user1_id, 150)
    place_bid(job2_id, user3_id, 160)
    place_bid(job2_id, user4_id, 170)
    place_bid(job2_id, user1_id, 180)

    # 3 bids on job 3
    place_bid(job3_id, user2_id, 200)
    place_bid(job3_id, user4_id, 210)
    place_bid(job3_id, user1_id, 220)

    # 2 bids on job 4
    place_bid(job4_id, user2_id, 230)
    place_bid(job4_id, user3_id, 240)

    # 1 bid on the remaining jobs
    place_bid(job5_id, user2_id, 250)
    place_bid(job6_id, user3_id, 260)
    place_bid(job7_id, user4_id, 270)
    place_bid(job8_id, user1_id, 280)
    place_bid(job9_id, user2_id, 290)
    place_bid(job10_id, user3_id, 300)


if __name__ == '__main__':
    main()
