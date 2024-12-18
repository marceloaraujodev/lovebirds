import c from './FeaturesCard.module.css';

export default function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className={c.cont}>
        <Icon className={c.icon} size={30} />
        <h3 className={c.title}>{title}</h3>
        <p className={c.description}>{description}</p>
    </div>
  );
}
