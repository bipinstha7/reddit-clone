import Head from "next/head";
import React, { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import useApi from "api/index";
import Input from "components/input";
import { useAuthDispatch, useAuthState } from "context/auth";

interface states {
  username: string;
  password: string;
  errors: any;
}

export default function Login() {
  const { API } = useApi();
  const dispatch = useAuthDispatch();
  const router = useRouter();
  const [state, setState] = useState<states>({
    username: "",
    password: "",
    errors: "",
  });
  const { authenticated } = useAuthState();

  const { username, password, errors } = state;

  const handleInput = e => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = { username, password };
    try {
      const res: any = await API.post("/auth/login", payload);

      console.log({ loginResponse: res });
      dispatch({
        type: "LOGIN",
        payload: res.data,
      });

      // router.push("/");
      router.back();
    } catch (error) {
      console.log({ authLoginError: error });
      setState({ ...state, errors: error });
    }
  };

  if (authenticated) {
    router.push("/");
  }

  return (
    <div className="flex bg-white">
      <Head>
        <title>Login</title>
      </Head>

      <div
        className="w-40 h-screen bg-center bg-cover"
        style={{ backgroundImage: "url('/images/background.jpg')" }}
      ></div>
      <div className="flex flex-col justify-center pl-6 ">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">Login</h1>
          <p className="mb-10 text-xs">
            By continuing, you agree to our User Agreement and Privacy Policy
          </p>
          <form onSubmit={handleSubmit}>
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
              error={errors.password || errors}
              handleChange={handleInput}
            />
            <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-700 border border-blue-500 rounded">
              Login
            </button>
          </form>
          <small>
            New to Reddit?
            <Link href="/register">
              <a className="ml-1 text-blue-500 uppercase">Sign up</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
