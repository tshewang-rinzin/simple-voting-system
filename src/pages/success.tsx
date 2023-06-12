// eslint-disable-next-line
import Link from 'next/link';

import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const ThankYouPage = () => {
  return (
    <Main
      meta={
        <Meta
          title="Thank You for Your Vote"
          description="Thank you for casting your vote."
        />
      }
    >
      <div className="mx-auto max-w-screen-md rounded bg-white p-2 shadow">
        <h2 className="mb-4 text-center text-2xl font-bold">
          Thank You for Your Vote
        </h2>
        <p className="text-center">
          Your vote has been successfully recorded. Thank you for participating
          in the election.
        </p>
        <div className="mt-4 flex justify-center">
          <Link
            href="/"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Go Back to Home
          </Link>
        </div>
      </div>
    </Main>
  );
};

export default ThankYouPage;
