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
        className="bg-surface-card max-w-md w-full rounded-md flex flex-col items-center p-8 mb-30 outline-1 shadow-2xl"
        onSubmit={onSubmit}
      >
        <h1 className="font-bold text-2xl md:text-3xl text-center tracking-tight text-text-primary">
          SIGN IN TO YOUR
          <br />
          ADIDOLF ACCOUNT
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          className="border-2 p-3 mt-6 border-border-input rounded-md outline-none w-full bg-surface-input text-text-primary placeholder-text-muted"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          title="Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number."
          className="border-2 p-3 mt-3 border-border-input rounded-md outline-none w-full bg-surface-input text-text-primary placeholder-text-muted"
        />

        <div className="grid grid-cols-2 text-sm mt-2 w-full text-text-muted">
          <div className="justify-self-start">
            <input type="checkbox" name="keepsignedin"></input>
            <label htmlFor="keepsignedin"> Keep me signed in</label>
          </div>
          <Link
            href="#"
            className="text-text-muted justify-self-end hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <input
          type="submit"
          value="SIGN IN"
          className="bg-text-primary text-surface-header p-3 mt-6 rounded-md w-full font-bold cursor-pointer hover:bg-text-secondary transition-colors"
        />

        <p className="text-sm mt-6 text-text-muted text-center">
          Don't have an account?{" "}
          <Link href="/signup" className="underline font-bold text-text-primary">
            CREATE AN ACCOUNT
          </Link>
        </p>
      </form>
    </div>
  );
}
