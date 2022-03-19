import { getCsrfToken, useSession } from "next-auth/react";

export default function Teacher() {
  const { data: session } = useSession();
  console.log("Techer",session)
  return "Some super secret Teacher";
}

Teacher.auth = {
  role: "teacher",
};
export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
