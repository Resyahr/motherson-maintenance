const MustBeAdminPage = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
      <p className="mt-4 text-lg text-gray-600">
        You do not have permission to access this page.
      </p>
      <p className="mt-2 text-gray-600">
        Please contact an administrator if you believe this is an error.
      </p>
      <a href="/" className="mt-6 text-blue-600 hover:underline">
        Go back to Home
      </a>
    </div>
  );
};

export default MustBeAdminPage;
