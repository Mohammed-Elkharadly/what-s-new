import { useState, useEffect, useRef, type SubmitEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLoginUserMutation } from '../features/auth/api/authApi';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const emailRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const navigate = useNavigate();

  const [loginUser, { isLoading, isError, error, isSuccess }] =
    useLoginUserMutation();
  // focus on email input after loading
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      navigate('/');
    }
  }, [isSuccess, navigate]);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    try {
      const data = await loginUser({ email, password }).unwrap();
      toast.success(data.message);
    } catch (error) {
      console.error('Failed to login', error);
    }
  };

  // extract error message from RTK query error
  const errorMessage =
    (error as any)?.data?.message || 'something went wrong. try again.';

  return (
    <>
      <main className="min-h-screen flex items-center justify-center">
        <div className="card w-96 bg-info-content shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl font-bold mb-4">Login</h2>
            {/** error alert */}
            {isError && (
              <div className="alert alert-error">
                <span>{errorMessage}</span>
              </div>
            )}
            <form id="submit-form" onSubmit={handleSubmit}>
              <div className="form-control mb-3">
                <label htmlFor="email" className="label-text">
                  Email
                </label>
                <input
                  ref={emailRef}
                  type="email"
                  placeholder="example@gmail.com"
                  className={`input input-bordered ${isError ? 'input-error' : ''}`}
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
                  className={`input input-bordered ${isError ? 'input-error' : ''}`}
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
                disabled={isLoading || !email || !password}
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  'Login'
                )}
              </button>
            </form>
            <p className="text-center mt-4 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="link link-primary">
                Signup
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default LoginPage;
