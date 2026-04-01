import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";

export const metadata = {
  title: "Book a Service | LocalPankaj",
  description: "Schedule your professional home service in Jaipur. Fast, reliable, and expert technicians.",
};

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-zinc-50/50">
      <Header />
      
      <div className="pt-32 pb-24 px-4">
        <BookingForm />
      </div>

      <Footer />
    </main>
  );
}
