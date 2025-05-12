"use server";

import { redirect } from "next/navigation";

export async function goToHome() {
  redirect("/");
}

export async function goToSignup() {
  redirect("/signup");
}

export async function goToLogin() {
  redirect("/login");
}

export async function goToSigList() {
  redirect("/sig");
}

export async function goToMyPage() {
  redirect("/my-page");
}
