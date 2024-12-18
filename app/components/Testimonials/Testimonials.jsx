import { TestimonialCard } from "./TestimonialsCard/TestimonialsCard";
import c from './Testimonials.module.css'

const testimonials = [
  {
    name: "Ana S. -",
    city: "Balneário Camboriú",
    image: "/testwoman2.jpg",
    text: "Eu queria um presente de aniversário único, e o QR Code Love foi perfeito! A página personalizada com nossas fotos e música foi tão emocionante. O código QR facilitou o compartilhamento, e meu namorado adorou a surpresa! Super recomendo!"
  },
  {
    name: "Eduardo L. -",
    city: "Porto Alegre",
    image: "/testmenImg.jpg",
    text: "Este é o presente mais criativo que eu já dei! A página personalizada com nossa música e fotos favoritas ficou absolutamente perfeita. O compartilhamento com código QR tornou tudo ainda mais especial. Com certeza usarei o QR Code Love novamente! Recomendo!"
  },
  {
    name: "Daniela P. -",
    city: "Salvador",
    image: "/testwoman1.jpg",
    text: "Eu não sou muito ligado em tecnologia, mas criar a página foi surpreendentemente simples. O código QR funcionou perfeitamente, e meu marido ficou muito emocionado com a mensagem e as fotos personalizadas. É um presente verdadeiramente único e acessível."
  }
];

export default function Testimonials() {
  return (
    <section className={c.cont}>
      <div className="max-w-7xl mx-auto px-4">
        <h2 className={c.sectionTitle}>
        Aprovado por quem Ama Presentear <br />
        Amado por quem recebe!
        </h2>
        <div className={c.gridCont}>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}