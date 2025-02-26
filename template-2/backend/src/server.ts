import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Load environment variables
dotenv.config();

const app = express();

// Initialize Supabase client
const supabase: SupabaseClient = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE as string
);

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    (req as any).user = data.user;
    next();
  } catch (error) {
    next(error);
  }
};

// Auth Routes
app.post("/api/signup", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, age, phoneNumber, zipCode } =
      req.body;

    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !age ||
      !phoneNumber ||
      !zipCode
    ) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    // ✅ Step 1: Sign up the user (they will receive a verification email)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      res.status(400).json({ error: authError.message });
      return;
    }

    if (!authData.user) {
      res.status(400).json({ error: "Failed to create user" });
      return;
    }

    console.log("Auth User Created:", authData.user);

    const { data, error: profileError } = await supabase
      .from("user_profiles")
      .insert([
        {
          user_id: authData.user.id,
          email,
          first_name: firstName,
          last_name: lastName,
          age,
          phone_number: phoneNumber,
          zip_code: zipCode,
        },
      ]);

    if (profileError) {
      res.status(400).json({ error: profileError.message });
      return;
    }

    res.status(201).json({
      message:
        "Signup successful! Please check your email to verify your account.",
      user: authData.user,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/signin", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({
      message: "Signin successful!",
      token: data.session?.access_token,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post(
  "/api/signout",
  authenticateUser,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        res.status(400).json({ error: error.message });
        return;
      }

      res.status(200).json({ message: "Signout successful!" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Example protected route
app.get(
  "/api/protected",
  authenticateUser,
  (req: Request, res: Response): void => {
    res.status(200).json({
      message: "Access granted",
      user: (req as any).user,
    });
  }
);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
