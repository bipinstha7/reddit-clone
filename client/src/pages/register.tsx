import Head from "next/head";
import React, { FormEvent, useState } from "react";
import Link from "next/link";
import classNames from "classnames";

import useApi from "api/index";

interface states {
  email: string;
  username: string;
  password: string;
  agreement: boolean;
  errors: any;
}

export default function Register() {
  const { API } = useApi();
  const [state, setState] = useState<states>({
    email: "",
    username: "",
    password: "",
    agreement: false,
    errors: {},
  });

  const { email, username, password, agreement, errors } = state;

  const handleCheckbox = e => {
    setState({ ...state, agreement: e.target.checked });
  };

  const handleInput = e => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = { username, email, password };
    try {
      const result = await API.post("/auth/register", payload);

      console.log({ result });
    } catch (error) {
      console.log({ authRegisterError: error });
      setState({ ...state, errors: error });
    }
  };

  return (
    <div className="flex">
      <Head>
        <title>Register</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className="w-40 h-screen bg-center bg-cover"
        style={{ backgroundImage: "url('/images/background.jpg')" }}
      ></div>
      <div className="flex flex-col justify-center pl-6 ">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">Sign Up</h1>
          <p className="mb-10 text-xs">
            By continuing, you agree to our User Agreement and Privacy Policy
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                type="checkbox"
                className="mr-1 cursor-pointer"
                id="agreement"
                checked={agreement}
                onChange={handleCheckbox}
              />
              <label htmlFor="agreement" className="text-xs cursor-pointer">
                I agree to get emails about cool stuff on Reddit
              </label>
            </div>
            <div className="mb-2">
              <input
                type="email"
                className={classNames(
                  "w-full p-3 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white",
                  { "border-red-500": errors.email }
                )}
                placeholder="Email"
                name="email"
                value={email}
                onChange={handleInput}
              />
              <small className="font-medium text-red-600">{errors.email}</small>
            </div>
            <div className="mb-2">
              <input
                type="text"
                className={classNames(
                  "w-full p-3 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white",
                  { "border-red-500": errors.username }
                )}
                placeholder="Username"
                name="username"
                value={username}
                onChange={handleInput}
              />
              <small className="font-medium text-red-600">
                {errors.username}
              </small>
            </div>
            <div className="mb-2">
              <input
                type="password"
                className={classNames(
                  "w-full p-3 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white",
                  { "border-red-500": errors.password }
                )}
                placeholder="Password"
                name="password"
                value={password}
                onChange={handleInput}
              />
              <small className="font-medium text-red-600">
                {errors.password}
              </small>
            </div>
            <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-700 border border-blue-500 rounded">
              Sign Up
            </button>
          </form>
          <small>
            Already a redditor?
            <Link href="/login">
              <a className="ml-1 text-blue-500 uppercase">Log in</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
