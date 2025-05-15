'use client';

export default function Error() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-16 text-center">
      <div className="max-w-md">
        <h2 className="text-2xl font-bold text-red-600">
          Something went wrong
        </h2>
        <p className="mt-4 text-gray-600">
          We couldn’t load your profile information. Please try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 rounded-full bg-[#15b7b9] px-5 py-2 font-semibold text-white transition hover:bg-[#129da0]"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
