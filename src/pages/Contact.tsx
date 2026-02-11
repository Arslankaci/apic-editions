import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import InfoCard from "@/components/shared/InfoCard";

const Contact: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="container py-12">
      <PageHeader title={t.contact.title} />
      <div className="grid md:grid-cols-[1fr_320px] gap-10">
        {/* Form */}
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">{t.contact.name}</label>
              <Input />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">{t.contact.email}</label>
              <Input type="email" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">{t.contact.subject}</label>
            <Input />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">{t.contact.message}</label>
            <Textarea rows={5} />
          </div>
          <Button type="submit" size="lg">{t.contact.send}</Button>
        </form>

        {/* Info */}
        <div className="space-y-4">
          <InfoCard icon={Phone} title={t.contact.phone} description="+213 (0) 21 00 00 00" />
          <InfoCard icon={Mail} title={t.contact.email} description="contact@apic-editions.com" />
          <InfoCard icon={MapPin} title={t.contact.address} description="12 Rue Didouche Mourad, Alger" />
        </div>
      </div>
    </div>
  );
};

export default Contact;
