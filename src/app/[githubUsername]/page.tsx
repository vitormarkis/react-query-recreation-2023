import { HomeLayout } from "@/ui/layouts/home";

export default function Home({
  params,
}: {
  params: Record<"githubUsername", string>;
}) {
  console.log(params);
  return <HomeLayout githubUsername={params.githubUsername} />;
}
