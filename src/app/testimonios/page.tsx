import { redirect } from "next/navigation";

export default function TestimonialsPage() {
  const googleReviewsUrl = process.env.NEXT_PUBLIC_GOOGLE_REVIEWS_URL?.trim();

  redirect(googleReviewsUrl || "/#testimonios");
}
