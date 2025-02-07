"use client";
import GlobalChat from "@/components/chat/global-chat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatSolveTime } from "@/lib/utils";
import { getDashboardStats } from "@/services/statsService";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const DashboardPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dashboardStats, setDashboardStats] = useState<any>();

  const { user } = useAuth();

  const router = useRouter();

  useEffect(() => {
    async function fetchStats() {
      const data = await getDashboardStats();
      setDashboardStats(data);

      console.log("data:", data);
    }

    fetchStats();
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.code !== "Space") return;

    router.push("/timer");
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="flex w-[75dvw] justify-between py-16 mx-auto">
      <div className="flex-col">
        <div className="text-4xl font-bold flex">
          Hi{" "}
          {user ? (
            user.username
          ) : (
            <Skeleton className="h-full w-[100px] ml-2" />
          )}{" "}
          👋
        </div>
        <div className="text-3xl mt-2 text-gray-600">
          Press <span className="font-semibold">Space</span> to start cubing
        </div>
        <div className="grid grid-cols-1 gap-10 mt-16">
          <div className="flex gap-6">
            <Card className="text-center w-fit">
              <CardHeader>
                <CardTitle className="text-3xl">Current PR</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardStats ? (
                  <>
                    <div className="text-3xl font-semibold">
                      {formatSolveTime(dashboardStats.pb.time)}
                    </div>
                    <div className="text-xl mt-2">
                      {formatDate(dashboardStats.pb.createdAt)}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-3xl">&nbsp;</div>
                    <div className="text-xl mt-2">&nbsp;</div>
                  </>
                )}
              </CardContent>
            </Card>
            <Card className="text-center w-fit">
              <CardHeader>
                <CardTitle className="text-3xl">Last solve</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardStats ? (
                  <>
                    <div className="text-3xl font-semibold">
                      {formatSolveTime(dashboardStats.worst.time)}
                    </div>
                    <div className="text-xl mt-2">
                      {formatDate(dashboardStats.worst.createdAt)}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-3xl">&nbsp;</div>
                    <div className="text-xl mt-2">&nbsp;</div>
                  </>
                )}
              </CardContent>
            </Card>
            <Card className="text-center w-fit">
              <CardHeader>
                <CardTitle className="text-3xl">Average</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardStats ? (
                  <>
                    <div className="text-3xl font-semibold">
                      {formatSolveTime(
                        Math.floor(dashboardStats.avg[0].avgTime)
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-3xl">&nbsp;</div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="flex gap-6">
            <Card className="text-center w-fit min-w-[200px]">
              <CardHeader>
                <CardTitle className="text-3xl">ELO</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardStats ? (
                  <>
                    <div className="text-3xl font-semibold">0</div>
                  </>
                ) : (
                  <>
                    <div className="text-3xl">&nbsp;</div>
                  </>
                )}
              </CardContent>
            </Card>
            <Card className="text-center w-fit">
              <CardHeader>
                <CardTitle className="text-3xl">Total battles</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardStats ? (
                  <>
                    <div className="text-3xl font-semibold">0</div>
                  </>
                ) : (
                  <>
                    <div className="text-3xl">&nbsp;</div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <GlobalChat />
    </div>
  );
};

export default DashboardPage;
