import MercadoPagoWidget from "./MercadoPagoWidget";

export default function CheckoutPage ({ preferenceId }) {
  return (
    <div>
      <MercadoPagoWidget preferenceId={preferenceId} />
    </div>
  );
};


