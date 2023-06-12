// eslint-disable-next-line
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

// const candidates = [
//   {
//     id: 1,
//     name: 'Duptho Kezang',
//     avatar: 'https://i.pravatar.cc/300?img=1',
//     description: 'Founder of DAPPA Sausage & Ham',
//   },
//   {
//     id: 2,
//     name: 'Sonam Chophel',
//     avatar: 'https://i.pravatar.cc/300?img=2',
//     description: 'Founder of CSI Market',
//   },
//   {
//     id: 3,
//     name: 'Sonam Choki',
//     avatar: 'https://i.pravatar.cc/300?img=3',
//     description: 'Founder of Bhutan Herbal Tea',
//   },
//   {
//     id: 4,
//     name: 'Suraj Ghimiray',
//     avatar: 'https://i.pravatar.cc/300?img=4',
//     description: 'Founder of Bhutan Turmeric House',
//   },
//   {
//     id: 5,
//     name: 'Jag Bdr Biswa',
//     avatar: 'https://i.pravatar.cc/300?img=5',
//     description: 'Founder of DNT Enterprise',
//   },
//   // Add more candidates for President
// ];

// Add your bearer token here

const Summary = ({ candidates, president, vicePresident }) => {
  const presidentData = candidates.find(
    (candidate) => candidate.id === String(president)
  );
  const vicePresidentData = candidates.find(
    (candidate) => candidate.id === String(vicePresident)
  );

  return (
    <div>
      <h2 className="mb-2 mt-1 text-center text-2xl font-bold">Your Choices</h2>
      <hr />
      <h3 className="text-xl font-semibold">President:</h3>
      <div className="mb-4 flex items-center">
        <img
          src={presidentData?.avatar}
          alt={`${presidentData?.name} Avatar`}
          className="mr-2 h-10 w-10 rounded-full"
        />
        <span>{presidentData?.name}</span>
      </div>
      <h3 className="text-xl font-semibold">Vice President:</h3>
      <div className="flex items-center">
        <img
          src={vicePresidentData?.avatar}
          alt={`${vicePresidentData?.name} Avatar`}
          className="mr-2 h-10 w-10 rounded-full"
        />
        <span>{vicePresidentData?.name}</span>
      </div>
    </div>
  );
};

const OtpPopup = ({
  candidates,
  onSubmit,
  onCancel,
  president,
  vicePresident,
  errorMessage,
}) => {
  const [otpValue, setOtpValue] = useState('');

  const handleOtpChange = (e) => {
    setOtpValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(otpValue);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="w-96 rounded-lg bg-white p-6">
        <Summary
          candidates={candidates}
          president={president}
          vicePresident={vicePresident}
        />
        <hr className="mt-4" />
        <div className="mb-1 mt-4">
          <div
            className="rounded-b border-t-4 border-blue-500 bg-blue-100 px-3 py-1 text-blue-900 shadow-md"
            role="alert"
          >
            <div className="flex">
              {/* <div className="py-1">
                <svg
                  className="mr-4 h-6 w-6 fill-current text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm0-6a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </div> */}
              <div>
                <p className="text-center text-sm">
                  A one-time passcode has been sent to your mobile number for
                  authorization and confirmation of your vote. Please enter the
                  OTP to proceed. It might take few minutes for the code to
                  arrive
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              id="otp"
              name="otp"
              value={otpValue}
              placeholder="OTP"
              onChange={handleOtpChange}
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          {errorMessage && (
            <div className="my-4 rounded bg-red-200 p-2 text-red-800">
              {errorMessage}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="mr-2 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const VotePage = () => {
  const router = useRouter();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPresident, setSelectedPresident] = useState('');
  const [selectedVicePresident, setSelectedVicePresident] = useState('');
  // const [otp, setOtp] = useState('');
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [voter, setVoter] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [submittingVote, setSubmittingVote] = useState(false);
  const [otpErrorMessage, setOtpErrorMessage] = useState();

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const previousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmittingVote(true);
    setOtpErrorMessage();
    setErrorMessage();

    try {
      // Construct the payload with the selected candidate IDs
      const payload = {
        candidateIdPresident: selectedPresident,
        candidateIdVicePresident: selectedVicePresident,
      };

      // Make an API request to submit the vote

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem('token');
      setVoter(JSON.parse(localStorage.getItem('voter')));

      // Check if the token is not set
      if (!token) {
        // Redirect to the home page
        router.push('/');
        return;
      }

      try {
        console.log('aa', token);
        const response = await fetch(`${apiUrl}/votes/submit-vote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          // const data = await response.json();
          // setCandidates(data);
          // Show OTP popup
          setSubmittingVote(false);
          setShowOtpPopup(true);
        } else {
          // Handle error response
          setSubmittingVote(false);
          const errorData = await response.json();
          setErrorMessage(errorData.message?.message || 'An error occurred.');
        }
      } catch (error) {
        console.error('Error submitting candidates:', error);
        setErrorMessage(
          'An unexpected error occurred. Please try again later.'
        );
        setSubmittingVote(false);
      } finally {
        setSubmittingVote(false);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      setErrorMessage('An unexpected error occurred. Please try again later.');
    }

    // Show OTP popup
    // setShowOtpPopup(true);
  };

  const handleOtpSubmit = async (verificationCode) => {
    try {
      const payload = {
        otp: verificationCode,
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem('token');

      // Check if the token is not set
      if (!token) {
        // Redirect to the home page
        router.push('/');
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/votes/verify-otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          // OTP verification successful
          // Redirect to a success page or perform any other necessary actions
          router.push('/success');
        } else {
          // Handle error response
          // setErrorMessage()
          const errorData = await response.json();
          setOtpErrorMessage(
            errorData.message?.message || 'An error occurred.'
          );
        }
      } catch (error) {
        console.error('Error submitting OTP:', error);

        setOtpErrorMessage(
          'An unexpected error occurred. Please try again later.'
        );
      }
    } catch (error) {
      console.error('Error submitting OTP:', error);
      // Handle error scenario
      setOtpErrorMessage(
        'An unexpected error occurred. Please try again later.'
      );
    }
  };

  const handleOtpCancel = () => {
    // Close OTP popup
    setShowOtpPopup(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <fieldset className="mb-8">
            <legend className="mb-2 text-2xl font-bold">
              1. Choose President
            </legend>
            <hr />
            {candidates.map((candidate) => (
              <label
                htmlFor={`president-${candidate.id}`}
                className={`mb-2 flex items-center rounded p-2 ${
                  selectedPresident === String(candidate.id)
                    ? 'bg-blue-100'
                    : ''
                }`}
                key={candidate.id}
              >
                <input
                  type="radio"
                  id={`president-${candidate.id}`}
                  value={candidate.id}
                  checked={selectedPresident === String(candidate.id)}
                  onChange={(e) => {
                    setSelectedPresident(e.target.value);
                    // Remove the selected President from Vice President options
                    if (selectedVicePresident === String(candidate.id)) {
                      setSelectedVicePresident('');
                    }
                  }}
                  className="mr-2 h-6 w-6 border-2 border-gray-400 checked:border-transparent checked:bg-blue-500 focus:border-blue-500 focus:outline-none"
                  required
                />
                <img
                  src={candidate.avatar}
                  alt={`${candidate.name} Avatar`}
                  className="h-20 w-20 rounded-full"
                />
                <div className="m-1 p-1">
                  <div>
                    <span className="font-bold">{candidate.name}</span>
                  </div>
                  <div>{candidate.description}</div>
                </div>
              </label>
            ))}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={nextStep}
                disabled={!selectedPresident}
                className={`rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 ${
                  !selectedPresident ? 'cursor-not-allowed opacity-50' : ''
                }`}
              >
                Next
              </button>
            </div>
          </fieldset>
        );
      case 2:
        return (
          <fieldset className="mb-8">
            <legend className="mb-2 mt-5 text-2xl font-bold">
              2. Choose Vice President
            </legend>
            {candidates.map((candidate) => {
              // Filter out the selected President from Vice President options
              if (selectedPresident === String(candidate.id)) {
                return null;
              }
              return (
                <label
                  htmlFor={`vice-president-${candidate.id}`}
                  className={`mb-2 flex items-center rounded p-2 ${
                    selectedVicePresident === String(candidate.id)
                      ? 'bg-blue-100'
                      : ''
                  }`}
                  key={candidate.id}
                >
                  <input
                    type="radio"
                    id={`vice-president-${candidate.id}`}
                    value={candidate.id}
                    checked={selectedVicePresident === String(candidate.id)}
                    onChange={(e) => setSelectedVicePresident(e.target.value)}
                    className="mr-2 h-6 w-6 border-2 border-gray-400 checked:border-transparent checked:bg-blue-500 focus:border-blue-500 focus:outline-none"
                    required
                  />
                  <img
                    src={candidate.avatar}
                    alt={`${candidate.name} Avatar`}
                    className="h-20 w-20 rounded-full"
                  />
                  <div className="m-1 p-1">
                    <div>
                      <span className="font-bold">{candidate.name}</span>
                    </div>
                    <div>
                      <span className="">{candidate.description}</span>
                    </div>
                  </div>
                </label>
              );
            })}
            {submittingVote && (
              <div className="round my-1 bg-gray-200 py-1 text-center text-sm text-gray-800">
                <span className="font-bold">Submitting your vote...</span>
              </div>
            )}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={previousStep}
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Previous
              </button>
              <button
                type="submit"
                disabled={!selectedVicePresident || submittingVote}
                className={`rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 ${
                  !selectedVicePresident ? 'cursor-not-allowed opacity-50' : ''
                }`}
              >
                Submit Vote
              </button>
            </div>
          </fieldset>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchCandidates = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem('token');
      setVoter(JSON.parse(localStorage.getItem('voter')));

      // Check if the token is not set
      if (!token) {
        // Redirect to the home page
        router.push('/');
        return;
      }

      try {
        console.log('aa', token);
        const response = await fetch(`${apiUrl}/candidates`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCandidates(data);
        } else {
          // Handle error response
        }
      } catch (error) {
        console.error('Error fetching candidates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Main
      meta={
        <Meta
          title="Vote for President and Vice President"
          description="Cast your vote for the positions of President and Vice President."
        />
      }
    >
      <div className="mx-auto max-w-screen-md rounded bg-white p-2 shadow">
        {/* <hr /> */}
        {voter && (
          <div className="mb-3 mt-2 rounded bg-green-200 p-2 text-green-800">
            <div className="mb-0">
              You are voting as the promoter of{' '}
              <strong>{voter?.businessName}</strong>.
            </div>
            <div className="mb-0">
              Please ensure that the entered information is accurate and matches
              the registered business details.
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-0">
          {errorMessage && (
            <div className="my-4 rounded bg-red-200 p-2 text-red-800">
              {errorMessage}
            </div>
          )}
          {renderStepContent()}
        </form>

        {/* OTP Popup */}
        {showOtpPopup && (
          <OtpPopup
            candidates={candidates}
            onSubmit={handleOtpSubmit}
            onCancel={handleOtpCancel}
            president={selectedPresident}
            vicePresident={selectedVicePresident}
            errorMessage={otpErrorMessage}
          />
        )}
      </div>
    </Main>
  );
};

export default VotePage;
