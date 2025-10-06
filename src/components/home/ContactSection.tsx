import { MapPin, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const contactInfo = [
  {
    icon: MapPin,
    title: "Location",
    value: "123 Dental Street, Healthcare District, City 12345",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+1 (555) 123-4567",
  },
  {
    icon: Mail,
    title: "Email",
    value: "contact@mrburdental.com",
  },
];

export const ContactSection = () => {
  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold">Contact Us</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're here to answer your questions and schedule your visit
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 text-center space-y-4 bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all duration-300">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{info.title}</h3>
                  <p className="text-muted-foreground">{info.value}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};