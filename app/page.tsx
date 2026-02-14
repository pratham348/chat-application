import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/chat");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <main className="flex flex-col items-center justify-center gap-8 px-4 text-center">
        <div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Real-time Chat Application
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Connect with your friends and have meaningful conversations
          </p>
        </div>

        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-8 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 rounded-lg bg-slate-700 text-white font-medium hover:bg-slate-600 transition-colors"
          >
            Create Account
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          <div className="p-6 bg-slate-700 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">
              💬 Real-time Chat
            </h3>
            <p className="text-slate-300">
              Send and receive messages instantly with your contacts
            </p>
          </div>
          <div className="p-6 bg-slate-700 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">
              👥 User Directory
            </h3>
            <p className="text-slate-300">
              Browse and find users to start conversations with
            </p>
          </div>
          <div className="p-6 bg-slate-700 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">
              🔐 Secure
            </h3>
            <p className="text-slate-300">
              Your conversations are encrypted and private
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
