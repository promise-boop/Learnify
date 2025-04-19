import React, { createContext, useContext, useReducer, useEffect } from "react";
import { supabase } from "../api/supabase";

// Initial state
const initialState = {
  credits: [],
  totalCredits: 0,
  unlimitedUntil: null,
  isLoading: true,
  error: null,
};

// Create context
const CreditsContext = createContext(initialState);

// Credits reducer
const creditsReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { ...state, isLoading: true, error: null };
    case "FETCH_SUCCESS":
      return {
        ...state,
        credits: action.payload.credits,
        totalCredits: action.payload.totalCredits,
        unlimitedUntil: action.payload.unlimitedUntil,
        isLoading: false,
        error: null,
      };
    case "ADD_CREDITS":
      return {
        ...state,
        credits: [...state.credits, action.payload],
        totalCredits: state.totalCredits + action.payload.amount,
        isLoading: false,
      };
    case "USE_CREDITS":
      return {
        ...state,
        totalCredits: state.totalCredits - action.payload.amount,
        isLoading: false,
      };
    case "ADD_UNLIMITED":
      return {
        ...state,
        unlimitedUntil: action.payload.expiryDate,
        isLoading: false,
      };
    case "ERROR":
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
};

// Provider component
export const CreditsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(creditsReducer, initialState);
  const { credits, totalCredits, unlimitedUntil, isLoading, error } = state;

  const { auth } = useContext(AuthContext) || { auth: { user: null } };
  const userId = auth?.user?.id;

  // Fetch user credits on mount and when user changes
  useEffect(() => {
    if (userId) {
      fetchUserCredits(userId);
    }
  }, [userId]);

  // Fetch user credits from database
  const fetchUserCredits = async (userId) => {
    try {
      dispatch({ type: "LOADING" });
      
      // Get all unexpired credit packs
      const now = new Date().toISOString();
      const { data: creditsData, error: creditsError } = await supabase
        .from("credits")
        .select("*")
        .eq("user_id", userId)
        .gt("expiry_date", now)
        .order("expiry_date", { ascending: true });

      if (creditsError) throw creditsError;

      // Calculate total credits
      let total = 0;
      let hasUnlimited = false;
      let unlimitedExpiry = null;

      creditsData.forEach(credit => {
        if (credit.is_unlimited) {
          hasUnlimited = true;
          // Keep track of the latest unlimited expiry date
          if (!unlimitedExpiry || new Date(credit.expiry_date) > new Date(unlimitedExpiry)) {
            unlimitedExpiry = credit.expiry_date;
          }
        } else {
          total += credit.amount;
        }
      });

      dispatch({
        type: "FETCH_SUCCESS",
        payload: {
          credits: creditsData,
          totalCredits: total,
          unlimitedUntil: hasUnlimited ? unlimitedExpiry : null,
        },
      });
    } catch (error) {
      console.error("Error fetching credits:", error);
      dispatch({ type: "ERROR", payload: error.message });
    }
  };

  // Add credits to user account
  const addCredits = async (amount, expiryDays = 30, isUnlimited = false) => {
    try {
      if (!userId) throw new Error("User not authenticated");
      
      dispatch({ type: "LOADING" });
      
      // Calculate expiry date (30 days from now by default)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + expiryDays);
      
      // Insert new credit pack
      const { data, error } = await supabase
        .from("credits")
        .insert({
          user_id: userId,
          amount: isUnlimited ? 0 : amount,
          is_unlimited: isUnlimited,
          expiry_date: expiryDate.toISOString(),
          purchase_date: new Date().toISOString(),
        })
        .select();

      if (error) throw error;

      if (isUnlimited) {
        dispatch({
          type: "ADD_UNLIMITED",
          payload: { expiryDate: expiryDate.toISOString() },
        });
      } else {
        dispatch({
          type: "ADD_CREDITS",
          payload: data[0],
        });
      }

      return data[0];
    } catch (error) {
      console.error("Error adding credits:", error);
      dispatch({ type: "ERROR", payload: error.message });
      throw error;
    }
  };

  // Use credits for a feature
  const useCredits = async (amount, feature, model = null) => {
    try {
      if (!userId) throw new Error("User not authenticated");
      
      // Check if user has unlimited credits
      if (unlimitedUntil && new Date(unlimitedUntil) > new Date()) {
        // User has unlimited credits, just record usage
        await recordUsage(amount, feature, model, true);
        return true;
      }
      
      // Check if user has enough credits
      if (totalCredits < amount) {
        throw new Error("Not enough credits");
      }
      
      dispatch({ type: "LOADING" });
      
      // Record usage and update credit balance
      await recordUsage(amount, feature, model, false);
      
      dispatch({
        type: "USE_CREDITS",
        payload: { amount },
      });
      
      return true;
    } catch (error) {
      console.error("Error using credits:", error);
      dispatch({ type: "ERROR", payload: error.message });
      throw error;
    }
  };

  // Record usage in usage history
  const recordUsage = async (amount, feature, model = null, unlimited = false) => {
    try {
      await supabase
        .from("credit_usage")
        .insert({
          user_id: userId,
          amount: amount,
          feature: feature,
          model: model,
          unlimited_used: unlimited,
          usage_date: new Date().toISOString(),
        });
    } catch (error) {
      console.error("Error recording usage:", error);
      // Don't throw here, we'll handle it in the calling function
    }
  };

  const value = {
    credits,
    totalCredits,
    unlimitedUntil,
    hasUnlimited: !!unlimitedUntil && new Date(unlimitedUntil) > new Date(),
    isLoading,
    error,
    fetchUserCredits,
    addCredits,
    useCredits,
  };

  return (
    <CreditsContext.Provider value={value}>
      {children}
    </CreditsContext.Provider>
  );
};

// Custom hook for using credits context
export const useCredits = () => {
  const context = useContext(CreditsContext);
  if (context === undefined) {
    throw new Error("useCredits must be used within a CreditsProvider");
  }
  return context;
};

// Import Auth Context to avoid circular dependency
// Make sure to import this at the end to prevent issues
import { AuthContext } from "./AuthContext";

export default CreditsContext;