import { useState, useEffect, useRef, type SubmitEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSignupUserMutation } from '../features/auth/api/authApi';

const SignupPage = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [signupUser, { isLoading, isError, error }] = useSignupUserMutation();

  // Focus on name input on mount
  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    try {
      await signupUser({ name, email, password }).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Failed to signup', error);
    }
  };

  const errorMessage =
    (error as any)?.data?.message || 'something went wrong. try again.';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-xl text-center m-auto"></span>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen flex items-center justify-center">
        <div className="card w-96 bg-info-content shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl font-bold mb-4">Signup</h2>
            {/** error alert */}
            {isError && (
              <div className="alert alert-error">
                <span>{errorMessage}</span>
              </div>
            )}
            <form id="submit-form" onSubmit={handleSubmit}>
              <div className="form-control mb-3">
                <label htmlFor="name" className="label-text">
                  Name
                </label>
                <input
                  ref={nameRef}
                  type="text"
                  placeholder="John Deo"
                  className={`input input-bordered ${isError ? 'input-error' : ''}`}
                  id="name"
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  required
                  autoComplete="on"
                />
              </div>
              <div className="form-control mb-3">
                <label htmlFor="email" className="label-text">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  className={`input input-borderd ${isError ? 'input-error' : ''}`}
                  id="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                  autoComplete="on"
                />
              </div>
              <div className="form-control mb-6">
                <label htmlFor="password" className="label-text">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="************"
                  className={`input input-borderd ${isError ? 'input-error' : ''}`}
                  id="password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                  autoComplete="off"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoading || !name || !email || !password}
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  'Signup'
                )}
              </button>
            </form>
            <p className="text-center mt-4 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="link link-primary">
                Login
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default SignupPage;
