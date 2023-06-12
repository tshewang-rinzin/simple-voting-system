// eslint-disable-next-line
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const Index = () => {
  const router = useRouter();
  const [licenseNo, setLicenseNo] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Remove token from localStorage when the component mounts
    localStorage.removeItem('token');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('License No:', licenseNo);
    console.log('Contact No:', contactNo);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      // Make an API request to your NestJS API endpoint
      const response = await fetch(`${apiUrl}/auth/voter-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ licenseNo, contactNo }),
      });

      if (response.ok) {
        // API request successful
        const data = await response.json();
        // Store the token in localStorage
        localStorage.setItem('voter', JSON.stringify(data.voter));
        localStorage.setItem('token', data.token.accessToken);

        router.push('/vote');
      } else {
        // API request failed
        const errorData = await response.json();
        setError(errorData.message?.message || 'An error occurred.');
        // setError(errorData.message);
      }
    } catch (err) {
      console.error('Error making API request:', err);
      setError('Error making API request');
    }
  };

  return (
    <Main
      meta={
        <Meta
          title="Online Voting System"
          description="Making elections simpler"
        />
      }
    >
      <div className="mx-auto max-w-screen-md rounded bg-white p-4 shadow">
        {/* <a href="https://github.com/ixartz/Next-js-Boilerplate">
          <img
            src={`${router.basePath}/assets/images/nextjs-starter-banner.png`}
            alt="Nextjs starter banner"
          />
        </a> */}
        {/* <h2 className="mt-4 text-2xl font-bold">
          Boilerplate code for your Nextjs project with Tailwind CSS
        </h2> */}
        <p className="mt-0">
          <strong className="text-lg">Instructions:</strong> To cast your vote
          for the positions of President and Vice President, please enter your
          License No and Contact No. The information you provide will be matched
          against the data shared in the Excel sheet.
          <br />
          Once you enter the correct details, you will be presented with the
          candidate lists for each category. You can then choose your preferred
          candidate.
          <br />
          An OTP (One-Time Password) will be sent to your phone to confirm your
          vote.
          <br />
          <strong>Please note:</strong> You can only vote once, and your vote
          cannot be changed.
        </p>

        <form onSubmit={handleSubmit} className="mt-4">
          <label htmlFor="licenseNo" className="mb-2 block">
            Business License No:
            <input
              type="text"
              id="licenseNo"
              value={licenseNo}
              onChange={(e) => {
                setLicenseNo(e.target.value);
                setError(null);
              }}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              required
            />
          </label>
          {/* <br /> */}
          <label htmlFor="contactNo" className="mb-2 block">
            Contact No:
            <input
              type="text"
              id="contactNo"
              value={contactNo}
              onChange={(e) => {
                setContactNo(e.target.value);
                setError(null);
              }}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              required
            />
          </label>
          {error && (
            <div className="my-4 rounded bg-red-200 p-2 text-red-800">
              {error}
            </div>
          )}
          {/* <br /> */}
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
        {/* Rest of the content */}
      </div>
    </Main>
  );
};

export default Index;
