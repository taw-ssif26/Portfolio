import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import PageHead from "@/components/PageHead";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "Contact — Md Abu Tawsif" };

export default function Contact() {
  return (
    <>
      <main className="page wrap" style={{ maxWidth: 760 }}>
        <PageHead kicker="Establish connection" title="Contact" lead="Tell me what you want to build or automate." />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
