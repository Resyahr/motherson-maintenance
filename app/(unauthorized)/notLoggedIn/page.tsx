const MustBeLoggedInPage = () => {
    return (
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-red-600">Access Restricted</h1>
        <p className="mt-4 text-lg text-gray-600">
          You must be logged in to access this page.
        </p>
        <p className="mt-2 text-gray-600">
          Please log in to continue. If you do not have an account, you may need to register.
        </p>
        <a href="/auth/login" className="mt-6 text-blue-600 hover:underline">
          Go to Login Page
        </a>
      </div>
    );
  };
  
  export default MustBeLoggedInPage;
  