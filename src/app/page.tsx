import Header from "@/components/Header";
import LoginForm from "@/app/login/login-form";

export default function Home() {
  return (
    <>
      <Header />
      <section className="bg-gray-100 min-h-screen pt-52">
        <LoginForm />
      </section>
    </>
  );
}
