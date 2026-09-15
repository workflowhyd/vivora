"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useMutation, useQuery } from "convex/react";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "./Reveal";
import { images } from "@/data/images";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

const inputClasses =
  "w-full bg-transparent border-b border-forest/20 pb-2.5 text-near-black placeholder:text-charcoal/40 focus:outline-none focus:border-forest transition-colors duration-300";

export function CTA() {
  const products = useQuery(api.products.list);
  const createInquiry = useMutation(api.inquiries.create);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    const form = new FormData(event.currentTarget);
    try {
      await createInquiry({
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: form.get("phone") ? String(form.get("phone")) : undefined,
        productInterest: form.get("productInterest")
          ? String(form.get("productInterest"))
          : undefined,
        message: String(form.get("message") ?? ""),
      });
      setStatus("success");
      event.currentTarget.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="relative w-full overflow-hidden">
      <div className="relative h-[52vh] min-h-[380px] w-full overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={images.cta}
            alt="A bowl of mixed nuts and dried fruit — the finished character of every Vivora Foods product"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-near-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-near-black via-near-black/40 to-near-black/50" />

        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <Reveal>
            <h2 className="font-display text-4xl md:text-6xl leading-[1.05] text-ivory max-w-4xl">
              Let&apos;s create something
              <br />
              <span className="italic text-orange">naturally exceptional.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-ivory/75 font-light text-base md:text-lg mt-7 max-w-md">
              Looking for reliable, export-grade dry fruits and nuts for your
              next order?
            </p>
          </Reveal>
        </div>
      </div>

      <div className="bg-forest py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 grid md:grid-cols-12 gap-12 md:gap-8">
          <div className="md:col-span-4">
            <Reveal>
              <span className="label-caps text-[12px] text-yellow">Request a Quote</span>
              <h3 className="font-display text-3xl md:text-4xl leading-[1.1] mt-4 text-ivory">
                Tell us what
                <br />
                <span className="italic">you&apos;re looking for.</span>
              </h3>
              <p className="text-ivory/60 font-light mt-6 max-w-xs leading-relaxed">
                Share a few details and our team will get back to you with
                pricing, samples and lead times.
              </p>
            </Reveal>
          </div>

          <div className="md:col-span-7 md:col-start-6">
            <Reveal delay={0.1}>
              {status === "success" ? (
                <div className="bg-ivory rounded-md p-8 md:p-10 flex items-start gap-4">
                  <span className="h-10 w-10 rounded-full bg-forest flex items-center justify-center shrink-0">
                    <Check size={18} className="text-ivory" />
                  </span>
                  <div>
                    <h4 className="font-display text-2xl text-near-black">Thank you.</h4>
                    <p className="text-charcoal/65 font-light mt-2 max-w-sm">
                      Your request has been received — we&apos;ll be in touch
                      shortly.
                    </p>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-ivory rounded-md p-8 md:p-10 grid sm:grid-cols-2 gap-x-6 gap-y-6"
                >
                  <div className="sm:col-span-1">
                    <label className="label-caps text-[10px] text-forest/70" htmlFor="name">
                      Name
                    </label>
                    <input id="name" name="name" required className={cn(inputClasses, "mt-2")} />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="label-caps text-[10px] text-forest/70" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className={cn(inputClasses, "mt-2")}
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="label-caps text-[10px] text-forest/70" htmlFor="phone">
                      Phone <span className="text-charcoal/40 normal-case">(optional)</span>
                    </label>
                    <input id="phone" name="phone" className={cn(inputClasses, "mt-2")} />
                  </div>
                  <div className="sm:col-span-1">
                    <label
                      className="label-caps text-[10px] text-forest/70"
                      htmlFor="productInterest"
                    >
                      Product interest
                    </label>
                    <select
                      id="productInterest"
                      name="productInterest"
                      className={cn(inputClasses, "mt-2")}
                      defaultValue=""
                    >
                      <option value="">Select a product</option>
                      {products?.map((product) => (
                        <option key={product.slug} value={product.name}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label-caps text-[10px] text-forest/70" htmlFor="message">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={3}
                      className={cn(inputClasses, "mt-2 resize-none")}
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center gap-4 mt-2">
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="group inline-flex items-center gap-2 bg-forest text-ivory text-[13px] label-caps px-7 py-4 rounded-full hover:bg-near-black transition-colors duration-300 disabled:opacity-60"
                    >
                      {status === "submitting" ? "Sending…" : "Request a Quote"}
                      <ArrowRight
                        size={15}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </button>
                    {status === "error" && (
                      <span className="text-crimson text-sm">
                        Something went wrong — please try again.
                      </span>
                    )}
                  </div>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
