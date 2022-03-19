import { getCsrfToken, useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  return "Some super secret dashboard";
}
Dashboard.auth = {
  role: "admin",
};
export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
