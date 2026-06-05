"use client";

import { loginUser } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const payload = {
      email: data.get("email") as string,
      password: data.get("password") as string,
    };

    try {
      await loginUser(payload);
      router.push("/");
    } catch (e) {
      console.error(e); // Replace with a message that the user can see later.
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        className="bg-white max-w-md w-full rounded-md flex flex-col items-center p-8 mb-30"
        onSubmit={onSubmit}
      >
        <h1 className="font-bold text-2xl md:text-3xl text-center tracking-tight">
          SIGN IN TO YOUR
          <br />
          ADIDOLF ACCOUNT
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          className="border-2 p-3 mt-6 border-gray-400 rounded-md outline-none w-full"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          title="Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number."
          className="border-2 p-3 mt-3 border-gray-400 rounded-md outline-none w-full"
        />

        <div className="grid grid-cols-2 text-sm mt-2 w-full">
          <div className="justify-self-start">
            <input type="checkbox" name="keepsignedin"></input>
            <label htmlFor="keepsignedin"> Keep me signed in</label>
          </div>
          <Link
            href="#"
            className="text-gray-500 justify-self-end hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <input
          type="submit"
          value="SIGN IN"
          className="bg-black text-white p-3 mt-6 rounded-md w-full font-bold cursor-pointer hover:bg-gray-900 transition-colors"
        />

        <p className="text-sm mt-6 text-center">
          Don't have an account?{" "}
          <Link href="/signup" className="underline font-bold">
            CREATE AN ACCOUNT
          </Link>
        </p>
      </form>
    </div>
  );
}
