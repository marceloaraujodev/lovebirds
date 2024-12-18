import { Star } from "lucide-react";
import c from './TestimonialsCard.module.css';


export function TestimonialCard({ name, city, image, text }) {
  return (
    <div className={c.cont}>
      <div className={c.wrapper}>
        <img src={image} alt={name} className={c.img} />
        <div>
          <h3 className={c.name}>{name} <span className={c.city}>{city}</span></h3>
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star size={14} key={i} className={c.star} fill='gold'/>
            ))}
          </div>
        </div>
      </div>
      <p className={c.description}>{text}</p>
    </div>
  );
}