"use client"; // Make sure to include this to enable client-side code execution
import { useEffect, useState } from "react";
import dotenv from "dotenv";
dotenv.config()

console.log(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY)

const MercadoPagoWidget = () => {
  const [preferenceId, setPreferenceId] = useState(null);

  useEffect(() => {
    const fetchPreferenceId = async () => {
      try {
        // Call your backend API route to create the preference
        const response = await fetch("/api/mercadopago", {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Failed to create preference");
        }

        const data = await response.json();
        setPreferenceId(data.preferenceId); // Save the preferenceId
      } catch (error) {
        console.error("Error fetching preference ID:", error);
      }
    };

    fetchPreferenceId();
  }, []);

  useEffect(() => {
    if (preferenceId) {
      // Initialize the MercadoPago widget once the preferenceId is available
      const mp = new window.MercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY, {
        locale: "pt-BR",
      });

      mp.bricks()
        .create("wallet", "wallet_container", {
          initialization: {
            preferenceId: preferenceId,
          },
        })
        .catch((err) => console.error("Error initializing MercadoPago widget:", err));
    }
  }, [preferenceId]);

  return (
    <div>
      <h1>Checkout</h1>
      <div id="wallet_container"></div>
    </div>
  );
};

export default MercadoPagoWidget;
