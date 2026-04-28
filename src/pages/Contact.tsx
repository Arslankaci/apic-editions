import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Newspaper, FileText } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { toast } from "sonner";

const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success(t.contact.newsletterCta + " ✓");
    setEmail("");
  };

  return (
    <div className="container py-12 max-w-4xl">
      <PageHeader title={t.contact.title} />

      <div className="space-y-12">
        {/* 1. Newsletter */}
        <section className="border-l-4 border-primary pl-6 py-2">
          <div className="flex items-center gap-3 mb-3">
            <Newspaper className="w-5 h-5 text-primary" />
            <h2 className="font-heading text-2xl font-semibold">
              {t.contact.newsletterTitle}
            </h2>
          </div>
          <p className="text-foreground/80 mb-4 leading-relaxed">
            {t.contact.newsletterText}
          </p>
          <form
            onSubmit={handleNewsletter}
            className="flex flex-col sm:flex-row gap-2 max-w-md"
          >
            <Input
              type="email"
              required
              placeholder={t.contact.newsletterPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">{t.contact.newsletterCta}</Button>
          </form>
        </section>

        {/* 2. Pour nous contacter */}
        <section className="border-l-4 border-primary pl-6 py-2">
          <div className="flex items-center gap-3 mb-3">
            <Mail className="w-5 h-5 text-primary" />
            <h2 className="font-heading text-2xl font-semibold">
              {t.contact.contactTitle}
            </h2>
          </div>
          <p className="text-foreground/80 leading-relaxed">
            {t.contact.contactText1}{" "}
            <a
              href={`mailto:${t.contact.contactEmail}`}
              className="text-primary font-medium underline-offset-4 hover:underline"
            >
              {t.contact.contactEmail}
            </a>
            .
          </p>
        </section>

        {/* 3. Envoi de manuscrits */}
        <section className="border-l-4 border-primary pl-6 py-2">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="font-heading text-2xl font-semibold">
              {t.contact.manuscriptsTitle}
            </h2>
          </div>
          <div className="space-y-4 text-foreground/80 leading-relaxed">
            <p>
              {t.contact.manuscriptsText1}{" "}
              <a
                href={`mailto:${t.contact.contactEmail}`}
                className="text-primary font-medium underline-offset-4 hover:underline"
              >
                {t.contact.contactEmail}
              </a>
            </p>
            <p>{t.contact.manuscriptsText2}</p>
            <p>{t.contact.manuscriptsText3}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
