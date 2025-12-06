import { createContext, useContext, useEffect, useState, useCallback } from "react";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [customerId, setCustomerId] = useState(null);
  const [customerName, setCustomerName] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // XP + Tier state
  const [xpBalance, setXpBalance] = useState(0);
  const [tierName, setTierName] = useState(null);

  // --- Load from localStorage on first mount ---
  useEffect(() => {
    const stored = window.localStorage.getItem("sharewell_auth");
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      setCustomerId(parsed.customerId ?? null);
      setIsAdmin(Boolean(parsed.isAdmin));
      setXpBalance(parsed.xpBalance ?? 0);
      setTierName(parsed.tierName ?? null);
    } catch (err) {
      console.warn("Failed to parse auth from storage:", err);
    }
  }, []);

  useEffect(() => {
    const payload = {
      customerId,
      isAdmin,
      xpBalance,
      tierName,
    };
    window.localStorage.setItem("sharewell_auth", JSON.stringify(payload));
  }, [customerId, isAdmin, xpBalance, tierName]);

  // --- Shared function to fetch stats for a given customer ---
  const fetchCustomerStats = useCallback(
    async (id) => {
      if (!id || isAdmin) return;

      try {
        const res = await fetch(
          `http://localhost:3000/api/customers/${id}`
        );
        if (!res.ok) {
          console.error("Failed to fetch customer stats:", res.status);
          return;
        }
        const data = await res.json();

        const xp =
          data.xp_balance != null ? Number(data.xp_balance) : 0;

        setXpBalance(xp);
        setTierName(data.membership_tier_name ?? null);

        const fullName =
          data.first_name && data.last_name
            ? `${data.first_name} ${data.last_name}`
            : data.first_name || data.last_name || null;

        setCustomerName(fullName);
      } catch (err) {
        console.error("Error fetching customer stats:", err);
      }
    },
    [isAdmin]
  );

  useEffect(() => {
    if (customerId && !isAdmin) {
      fetchCustomerStats(customerId);
    } else {
      setXpBalance(0);
      setTierName(null);
    }
  }, [customerId, isAdmin, fetchCustomerStats]);

  // --- Public method to manually refresh stats ---
  const refreshCustomerStats = () => {
    if (customerId && !isAdmin) {
      fetchCustomerStats(customerId);
    }
  };

  // --- Auth actions ---
  const loginCustomer = (id) => {
    const numericId = Number(id);
    setCustomerId(numericId);
    setIsAdmin(false);
  };

  const loginAdmin = () => {
    setCustomerId(null);
    setIsAdmin(true);
    setXpBalance(0);
    setTierName(null);
  };

  const logout = () => {
    setCustomerId(null);
    setIsAdmin(false);
    setXpBalance(0);
    setTierName(null);
  };

  const value = {
    customerId,
    isAdmin,
    customerName,
    xpBalance,
    tierName,
    loginCustomer,
    loginAdmin,
    logout,
    refreshCustomerStats, 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
