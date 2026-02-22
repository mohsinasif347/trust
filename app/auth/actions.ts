"use server";

import { createClient } from "@/utils/supabase/server";

export async function signUpUser(formData: FormData) {
  const supabase = await createClient();

  // 1. Data extraction (Ab real email bhi nikalenge)
  const email = formData.get("email") as string; // Real email from form
  const phone = formData.get("phone") as string; 
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const referralId = formData.get("referralId") as string;

  // 2. Validation (Basic check)
  if (!email || !password || !fullName) {
    return { error: "Zaroori maloomat missing hain!" };
  }

  // 3. Supabase Auth Sign Up (Real Email ke sath)
  const { data, error } = await supabase.auth.signUp({
    email: email, // Dummy khatam, ab asli email
    password,
    options: {
      data: {
        full_name: fullName,
        phone_number: phone,
        referred_by: referralId || null,
        role: 'user', // Default role
      },
    },
  });

  if (error) {
    console.error("Auth Error:", error.message);
    return { error: error.message };
  }

  // 4. Important Change: 
  // Agar email confirmation ON hai (jo ke honi chahiye), 
  // toh hum redirect nahi kar sakte kyunke user abhi login nahi hua.
  // Hum client ko success return karenge taake wo popup dikhaye.
  
  return { 
    success: true, 
    message: "Confirmation link aap ke email par bhej diya gaya hai." 
  };
}