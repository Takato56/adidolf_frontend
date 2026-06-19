"use client";

import { loginUser, registerUser } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const payload = {
      email: data.get("email") as string,
      password: data.get("password") as string,
      full_name: data.get("full_name") as string,
      phone: data.get("phone") as string,
    };
    const payload_login = {
      email: payload.email,
      password: payload.password,
    };

    try {
      await registerUser(payload);

      await loginUser(payload_login);
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
          SIGN UP TO YOUR
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

        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          pattern="^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ\s'\-]*$"
          title="Username must be between 3 and 15 characters long and can only contain letters, numbers, and underscores (no spaces)."
          className="border-2 p-3 mt-3 border-border-input rounded-md outline-none w-full bg-surface-input text-text-primary placeholder-text-muted"
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          pattern="[0-9\-+\s()]*"
          title="Please enter a valid phone number (minimum 10 digits). You can include spaces, hyphens, and a leading + for country codes."
          className="border-2 p-3 mt-3 border-border-input rounded-md outline-none w-full bg-surface-input text-text-primary placeholder-text-muted"
        />

        <input
          type="submit"
          value="SIGN UP"
          className="bg-text-primary text-surface-header p-3 mt-6 rounded-md w-full font-bold cursor-pointer hover:bg-text-secondary transition-colors"
        />

        <p className="text-sm mt-6 text-text-muted text-center">
          Already have an account?{" "}
          <Link href="/login" className="underline font-bold text-text-primary">
            LOG IN
          </Link>
        </p>
      </form>
    </div>
  );
}
