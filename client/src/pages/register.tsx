import Head from "next/head";
import React, { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import useApi from "api/index";
import Input from "components/input";

interface states {
  email: string;
  username: string;
  password: string;
  agreement: boolean;
  errors: any;
}

export default function Register() {
  const { API } = useApi();
  const router = useRouter();
  const [state, setState] = useState<states>({
    email: "",
    username: "",
    password: "",
    agreement: false,
    errors: {},
  });

  const { email, username, password, agreement, errors } = state;

  const handleCheckbox = e => {
    setState({
      ...state,
      agreement: e.target.checked,
      errors: { ...errors, agreement: "" },
    });
  };

  const handleInput = e => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!agreement) {
      return setState({
        ...state,
        errors: { ...errors, agreement: "You must agree T&C" },
      });
    }

    const payload = { username, email, password };
    try {
      await API.post("/auth/register", payload);

      router.push("/login");
    } catch (error) {
      console.log({ authRegisterError: error });
      setState({ ...state, errors: error });
    }
  };

  return (
    <div className="flex bg-white">
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
              {errors.agreement ? (
                <small className="block font-medium text-red-600">
                  {errors.agreement}
                </small>
              ) : null}
            </div>
            <Input
              type="text"
              placeholder="Email"
              value={email}
              name="email"
              error={errors.email}
              handleChange={handleInput}
            />
            <Input
              type="text"
              placeholder="Username"
              value={username}
              name="username"
              error={errors.username}
              handleChange={handleInput}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              name="password"
              error={errors.password}
              handleChange={handleInput}
            />
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
