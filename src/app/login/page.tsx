import Header from "@/components/Header";
import LoginForm from "./login-form";

export default async function LoginPage() {
  // await new Promise((resolve) => {
  //   setTimeout(resolve, 1000000);
  // });
  return (
    <>
      <Header />
      <section className="min-h-screen grid place-items-center">
        <div className="w-full">
          <LoginForm />
        </div>
      </section>
    </>
  );
}
