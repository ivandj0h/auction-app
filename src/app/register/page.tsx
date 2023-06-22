import Header from "@/components/Header";
import RegisterForm from "./register-form";

export default async function RegisterPage() {
  // await new Promise((resolve) => {
  //   setTimeout(resolve, 1000);
  // });
  return (
    <>
      <Header />
      <section className="bg-gray-100 min-h-screen pt-52">
        <div className="w-full">
          <RegisterForm />
        </div>
      </section>
    </>
  );
}
