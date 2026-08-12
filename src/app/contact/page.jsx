"use client";
 import Navbar from "../../../components/navbar";
import Link from "next/link";
import React, { useState } from "react";
import Swal from "sweetalert2";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Heart,
} from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Hook up your submit logic here
//     console.log("Contact form submitted:", form);
//   };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log("Newsletter subscribe:", newsletterEmail);
  };

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.subject ||
      !form.message
    ) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill all fields.",
        confirmButtonColor: "#15803d",
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Message Sent!",
      text: "Thank you for contacting ReLife Hub.",
      confirmButtonColor: "#15803d",
    });

    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };


  return (
    <> <Navbar></Navbar>
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-green-50 to-white px-6 py-14 text-center">
        <div className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-green-100/60 blur-2xl" />
        <div className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-green-100/60 blur-2xl" />
        <h1 className="text-4xl font-bold text-green-800 md:text-5xl">
          Contact ReLife Hub
        </h1>
        <p className="mt-3 text-gray-600">We'd love to hear from you.</p>
        <p className="text-gray-600">
          Have questions or want to help? We are always here to assist you.
        </p>
      </section>

      {/* Main content */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 md:grid-cols-[1fr_1.6fr]">
        {/* Get in touch */}
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-green-800">
            Get In Touch
          </h2>

          <div className="space-y-6">
            <InfoRow icon={<MapPin size={18} />} title="Address">
              123 Green Avenue, Earth Society,
              <br />
              New Delhi, India - 110001
            </InfoRow>

            <InfoRow icon={<Phone size={18} />} title="Phone">
              +91 98765 43210
            </InfoRow>

            <InfoRow icon={<Mail size={18} />} title="Email">
              support@relifehub.com
            </InfoRow>

            <InfoRow icon={<Clock size={18} />} title="Working Hours">
              Mon - Sat : 9:00 AM - 6:00 PM
              <br />
              Sunday : Closed
            </InfoRow>
          </div>
        </div>

        {/* Send message */}
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-green-800">
            Send Us a Message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Full Name">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="input"
                />
              </Field>
              <Field label="Email Address">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="input"
                />
              </Field>
            </div>

            <Field label="Subject">
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Enter subject"
                className="input"
              />
            </Field>

            <Field label="Message">
              <textarea
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                className="input resize-none"
              />
            </Field>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 py-3 font-medium text-white transition-colors hover:bg-green-800"
            >
              <Send size={16} />
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Map */}
      <section className="mx-auto max-w-6xl px-6 pb-10">
        <div className="relative overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex h-72 w-full items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-green-50">
            <div className="flex flex-col items-center text-green-700">
              <MapPin size={40} className="fill-red-500 text-red-500" />
              <span className="mt-1 font-semibold">ReLife Hub</span>
            </div>
          </div>

          <div className="absolute left-4 top-4 max-w-xs rounded-xl bg-white p-4 shadow-md">
            <p className="font-semibold text-gray-900">ReLife Hub</p>
            <p className="mt-1 text-sm text-gray-500">
              123 Green Avenue, Earth Society,
              <br />
              New Delhi, India - 110001
            </p>
            <a
              href="#"
              className="mt-2 inline-block text-sm font-medium text-green-700 hover:underline"
            >
              View on Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* Social + Newsletter */}
      <section className="mx-auto flex max-w-6xl flex-col gap-6 border-t border-gray-100 px-6 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Follow Us</h3>
          <p className="text-sm text-gray-500">
            Stay connected with us on social media
          </p>
          <div className="mt-3 flex gap-3">
          {[
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
].map((Icon, i) => (
  <a
    key={i}
    href="#"
    className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center hover:bg-green-600 hover:text-white duration-300"
  >
    <Icon size={20} />
  </a>
))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900">
            Subscribe to our Newsletter
          </h3>
          <p className="text-sm text-gray-500">
            Get the latest updates and news
          </p>
          <form
            onSubmit={handleNewsletterSubmit}
            className="mt-3 flex gap-2"
          >
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-56 rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-green-500"
            />
            <button
              type="submit"
              className="rounded-lg bg-green-700 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-green-800"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 px-6 pt-12 pb-6">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-6">
          <div className="col-span-2 sm:col-span-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-700 text-white">
                <Heart size={16} />
              </div>
              <div>
                <p className="font-bold text-gray-900">ReLife Hub</p>
                <p className="text-xs text-green-700">Share · Donate · Reuse</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Building a better community through sharing and caring.
            </p>
          </div>

          <FooterCol
            title="Quick Links"
            items={["Home", "About Us", "Find Items", "Contact Us"]}
          />
          <FooterCol
            title="Categories"
            items={["Clothes", "Books", "Furniture", "Electronics", "Toys & Games", "Others"]}
          />
          <FooterCol
            title="Support"
            items={["FAQs", "Privacy Policy", "Terms & Conditions", "Help Center"]}
          />

          <div>
            <h4 className="mb-3 font-semibold text-gray-900">
              Make a Difference
            </h4>
            <p className="text-sm text-gray-500">
              Your small contribution can make a big difference in someone's
              life.
            </p>
            <button className="mt-3 flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-800">
              <Heart size={14} />
             <Link href="/donate"> Donate Now</Link>
             
            </button>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-gray-900">We Accept</h4>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-gray-500">
              <span className="rounded border border-gray-200 px-2 py-1">
                VISA
              </span>
              <span className="rounded border border-gray-200 px-2 py-1">
                Mastercard
              </span>
              <span className="rounded border border-gray-200 px-2 py-1">
                UPI
              </span>
              <span className="rounded border border-gray-200 px-2 py-1">
                PayPal
              </span>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-6xl border-t border-gray-200 pt-5 text-center text-sm text-gray-400">
          © 2025 ReLife Hub. All rights reserved.
        </div>
      </footer>

      <style>{`
        .input {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 0.65rem 1rem;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .input:focus {
          border-color: #15803d;
        }
      `}</style>
    </div>
    </>
  );
}

function InfoRow({ icon, title, children }) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{children}</p>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
    </div>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <h4 className="mb-3 font-semibold text-gray-900">{title}</h4>
      <ul className="space-y-2 text-sm text-gray-500">
        {items.map((item) => (
          <li key={item}>
            <a href="#" className="hover:text-green-700">
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
    
  );
}
