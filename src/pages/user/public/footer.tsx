import { ChevronUp, Facebook, Github, Linkedin, Slack, Youtube } from "lucide-react";
import FooterTop from "./footer-top";
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
    <footer className="mx-auto border-t relative">
      <FooterTop />

      {/* Floating Social Buttons */}
      {/* <div className="fixed bottom-16 left-6 flex flex-col gap-2 z-50">
        <a
          href="https://facebook.com"
          className="w-12 h-12 rounded-full !bg-primary flex items-center justify-center shadow-lg"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Facebook size={20} className="text-white" />
        </a>
        <a
          href="https://zalo.me"
          className="w-12 h-12 rounded-full !bg-primary flex items-center justify-center shadow-lg"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircleMore size={20} className="text-white" />
        </a>
      </div> */}

      {/* Footer Content */}
      <div className={`${contentWrapper} py-8 px-4 sm:px-6 lg:px-0 border-t mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-16`}>

        {/* Logo + Description + Social */}
        <div className="space-y-3">
          <Logo />
          <p className="text-muted-foreground leading-relaxed">{t("footer.discoverCuratedFurnitureCollections")}</p>
          <div className="flex items-center gap-3">
            {socialIcons.map((Icon, i) => (
              <div key={i} className="w-10 h-10 rounded-xl border border-border flex items-center justify-center cursor-pointer transition hover:shadow-md">
                <Icon className="w-5 h-5" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
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

        {/* Categories */}
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

        {/* Newsletter */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">{t("footer.newsletter")}</h3>
          <p className="text-muted-foreground leading-relaxed">{t("footer.subscribeToOurNewsletter")}</p>
          <div className="flex flex-col gap-3">
            <Input size="large" placeholder={t("footer.enterYourEmail")} type="email" className="rounded-lg" />
            <Button type="primary" size="large" className="w-full rounded-lg">{t("footer.subscribe")}</Button>
          </div>
        </div>

        {/* Scroll To Top */}

        {scrollPercent > 0 && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-25 right-8 z-50 w-14 h-14 rounded-full bg-background border border-border text-primary hover:bg-primary hover:text-white transition flex items-center justify-center"
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

      {/* Footer Bottom */}
      <div className="py-4 border-t text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} <Logo />. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;



