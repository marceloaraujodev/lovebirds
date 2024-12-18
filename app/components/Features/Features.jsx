import { Music, Image, MessageCircle } from "lucide-react";
import FeatureCard from "./FeaturesCard/FeaturesCard";
import c from './Features.module.css'

const features = [
  {
    icon: Music,
    title: "Música de Fundo",
    description: "Crie a atmosfera perfeita com a música que marcou a história de vocês"
  },
  {
    icon: Image,
    title: "Álbum de Fotos",
    description: "Compartilhe suas memórias preciosas para uma surpresa única!"
  },
  {
    icon: MessageCircle,
    title: "Mensagem Pessoal",
    description: "Expresse todo o seu amor com palavras que tocam o coração"
  }
];

export default function Features() {
  return (
    <section className={c.cont} id="features">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className={c.sectionTitle}>
          Tudo que você precisa para criar o presente perfeito!
        </h2>
        <div className={c.gridCont}>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}