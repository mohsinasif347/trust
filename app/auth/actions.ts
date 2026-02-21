"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signUpUser(formData: FormData) {
  const supabase = await createClient();

  // 1. Data extraction from form
  const phone = formData.get("phone") as string; // User ka asli phone number
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const referralId = formData.get("referralId") as string;

  // 2. Dummy Email Generation (Phone-to-Email logic)
  // Hum phone number ke aage domain laga kar email banayen ge taake login process chale
  const dummyEmail = `${phone}@birdvest.com`;

  // 3. Supabase Auth Sign Up with Metadata
  const { data, error } = await supabase.auth.signUp({
    email: dummyEmail,
    password,
    options: {
      data: {
        full_name: fullName,      // Profile trigger ke liye
        phone_number: phone,      // Table mein extract karne ke liye
        referred_by: referralId,  // Referral track karne ke liye
      },
    },
  });

  if (error) {
    console.error("Auth Error:", error.message);
    return { error: error.message };
  }

  // 4. Success!
  // Note: Agar email verification on hai Supabase mein, to user foran login nahi hoga.
  // Isay Supabase Dashboard > Auth > Providers > Email mein ja kar "Confirm email" off kar dena.
  redirect("/dashboard");
}