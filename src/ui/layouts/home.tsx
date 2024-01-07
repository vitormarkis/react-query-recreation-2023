"use client";

import { QueryStorageContext } from "@/hooks/QueryStorageContext";
import { useQuery } from "@/hooks/useQuery";
import { SessionUser, User } from "@/types/User";
import { IconCrown } from "@/ui/icons/IconCrown";
import React from "react";

export function HomeLayout({ githubUsername }: { githubUsername: string }) {
  const storage = React.useContext(QueryStorageContext);

  const wait = useQuery({
    queryKey: "wait",
    queryFn: async () => {
      await new Promise(res => setTimeout(res, 3000));
      return Promise.resolve("react query é para os fracos");
    },
  });

  const { data: allData, isLoading } = useQuery<User>({
    queryKey: "user",
    queryFn: async () => {
      await new Promise(res => setTimeout(res, 7000));
      const res = await fetch(`https://api.github.com/users/${githubUsername}`);
      const data = await res.json();
      return data;
    },
  });

  const data: SessionUser | null = allData
    ? {
        login: allData.login,
        avatar_url: allData.avatar_url,
        location: allData.location,
      }
    : null;

  return (
    <main className="flex min-h-screen overflow-x-hidden">
      <div className="flex-1 flex flex-col gap-6 shrink-0 min-w-0 bg-neutral-950 p-3">
        <div className="rounded-[0.75rem] border border-neutral-800 bg-neutral-900 text-white">
          {data && !isLoading ? (
            <div className="p-2 flex gap-2">
              <div>
                <div className="h-16 w-16 relative rounded-[0.25rem] overflow-hidden">
                  <img
                    src={data.avatar_url}
                    className="absolute object-cover h-full w-full inset-0"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex gap-1 items-center">
                  <h3 className="text-neutral-200 font-medium">{data.login}</h3>
                  <div className="grid place-items-center h-4 w-4 rounded-md bg-amber-500 border border-amber-600">
                    <IconCrown className="h-3 w-3 text-amber-200" />
                  </div>
                </div>
                <span className="text-neutral-400 text-sm">
                  {data.location}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-2 flex gap-2">
              <div>
                <div className="h-16 w-16 relative rounded-[0.25rem] overflow-hidden animate-pulse">
                  <div className="absolute h-full w-full inset-0 bg-neutral-800" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="inline-block h-4 w-[120px] bg-neutral-800 animate-pulse mb-3" />
                <span className="inline-block h-3 w-[110px] bg-neutral-800 animate-pulse" />
              </div>
            </div>
          )}
        </div>
        <div className="rounded-[0.75rem] border border-neutral-800 bg-neutral-900 text-white">
          {wait.data && !wait.isLoading ? (
            // {false ? (
            <div className="p-2 flex gap-2">
              <h1 className="bg-amber-800/50 text-amber-500 text-base h-6 px-2 rounded-[0.25rem]">
                {wait.data}
              </h1>
            </div>
          ) : (
            <div className="p-2 flex gap-2">
              <span className="inline-block bg-neutral-800 animate-pulse text-base h-6 px-2 rounded-[0.25rem] text-neutral-500">
                Loading...
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 shrink-0 min-w-0 bg-amber-500">
        <pre className="text-xs leading-[14px]">
          {JSON.stringify(storage.cache ?? "no data", null, 2)}
        </pre>
      </div>
    </main>
  );
}
