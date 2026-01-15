import { ChevronUp, Facebook, Github, Linkedin, Slack, Youtube } from "lucide-react";
import Logo from "@/ui/logo";
import { Button, Input } from "antd";
import { Link } from "react-router";
import { contentWrapper } from "@/utils/use-always";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const socialIcons = [Youtube, Github, Linkedin, Facebook, Slack];

const Footer = () => {
  const { t } = useTranslation();
  const [scrollPercent, setScrollPercent] = useState(0);
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollPercent / 100) * circumference;

  const quickLinksData = [
    { title: t("footer.aboutUs"), href: "/about" },
    { title: t("footer.contactUs"), href: "/contact" },
    { title: t("footer.termsAndConditions"), href: "/terms" },
    { title: t("footer.faqs"), href: "/faqs" },
    { title: t("footer.help"), href: "/help" },
  ];

  const categoriesData = [
    { title: t("footer.categories"), href: "category" },
    { title: t("footer.laptops"), href: "category/laptops" },
    { title: t("footer.smartphones"), href: "category/smartphones" },
    { title: t("footer.gaming"), href: "category/gaming" },
    { title: t("footer.tablets"), href: "category/tablets" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPercent(Math.min((scrollTop / docHeight) * 100, 100));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer className="mx-auto border-t relative px-4">
      <div className={`${contentWrapper} mt-4 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-16`}>
        <div className="space-y-3">
          <Logo />
          <p className="text-muted-foreground leading-relaxed">{t("footer.discoverCuratedFurnitureCollections")}</p>
          <div className="flex items-center gap-2">
            {socialIcons.map((Icon, i) => (
              <div key={i} className="w-10 h-10 rounded-xl border border-border flex items-center justify-center cursor-pointer transition hover:shadow-md">
                <Icon className="w-5 h-5" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">{t("footer.quickLinks")}</h3>
          <ul className="space-y-2">
            {quickLinksData.map(({ title, href }) => (
              <li key={title}>
                <Link to={href} className="!text-muted-foreground hover:!text-primary transition">{title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">{t("footer.categories")}</h3>
          <ul className="space-y-2">
            {categoriesData.map(({ title, href }) => (
              <li key={title}>
                <Link to={href} className="!text-muted-foreground hover:!text-primary transition">{title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">{t("footer.newsletter")}</h3>
          <p className="text-muted-foreground leading-relaxed">{t("footer.subscribeToOurNewsletter")}</p>
          <div className="flex flex-col gap-3">
            <Input size="large" placeholder={t("footer.enterYourEmail")} type="email" className="rounded-lg" />
            <Button type="primary" size="large" className="w-full rounded-lg">{t("footer.subscribe")}</Button>
          </div>
        </div>

        {scrollPercent > 0 && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed cursor-pointer bottom-25 right-8 z-50 w-14 h-14 rounded-full bg-background border border-border text-primary hover:bg-primary hover:text-white transition flex items-center justify-center"
          >
            <svg
              className="absolute w-full h-full rotate-[-90deg]"
              viewBox="0 0 50 50"
            >
              <circle
                cx="25"
                cy="25"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <ChevronUp size={22} className="relative z-10" />
          </button>
        )}

      </div>

      <div className="py-4 border-t text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} <Logo />. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;



