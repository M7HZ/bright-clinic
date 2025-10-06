import { Users, Award, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import teamImage from "@/assets/dental-team.jpg";

const stats = [
  { icon: Users, value: "10,000+", label: "Happy Patients" },
  { icon: Award, value: "15+", label: "Years Experience" },
  { icon: Heart, value: "98%", label: "Success Rate" },
];

export const AboutSection = () => {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={teamImage}
                alt="Our dental team"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              About Mr. Bur Dental Clinic
            </h2>
            <p className="text-lg text-muted-foreground">
              With over 15 years of excellence in dental care, we combine state-of-the-art
              technology with personalized attention to ensure every patient receives the highest
              quality treatment in a comfortable, welcoming environment.
            </p>
            <p className="text-lg text-muted-foreground">
              Our team of experienced professionals is dedicated to helping you achieve and maintain
              optimal oral health through preventive care, advanced treatments, and patient
              education.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card
                    key={stat.label}
                    className="p-4 text-center bg-card/50 backdrop-blur border-border"
                  >
                    <Icon className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};