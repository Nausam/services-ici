import { SignIn } from "@clerk/nextjs";

const SignInPage = () => (
  <div className="flex min-h-[calc(100vh-96px)] items-center justify-center px-4 py-10">
    <SignIn routing="hash" signUpUrl="/sign-up" />
  </div>
);

export default SignInPage;
