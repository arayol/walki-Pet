
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export const useDashboardData = () => {
  const { user } = useAuth();
  const [walkerData, setWalkerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayWalks: 0,
    activeClients: 0,
    monthlyRevenue: 0,
    rating: 0
  });

  const fetchWalkerData = async () => {
    try {
      const response = await fetch(`/api/walkers/${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setWalkerData(data);
      }
    } catch (error) {
      console.error("Error fetching walker data:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/walkers/${user?.id}/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const refetch = async () => {
    if (user) {
      setLoading(true);
      await fetchWalkerData();
      await fetchStats();
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [user]);

  return { walkerData, stats, loading, refetch };
};
