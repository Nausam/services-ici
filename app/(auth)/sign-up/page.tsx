import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => (
  <div className="flex min-h-[calc(100vh-96px)] items-center justify-center px-4 py-10">
    <SignUp routing="hash" signInUrl="/sign-in" />
  </div>
);

export default SignUpPage;
