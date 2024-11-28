"use client"; // Make sure to include this to enable client-side code execution
import { useEffect, useState, useRef } from "react";
import dotenv from "dotenv";
dotenv.config()

console.log(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY)

const MercadoPagoWidget = () => {
  const [preferenceId, setPreferenceId] = useState(null);
  const isWidgetInitialized = useRef(false);

  useEffect(() => {
    const fetchPreferenceId = async () => {
      try {
        // Call backend API to create preference
        const response = await fetch("/api/mercadopago", { method: "POST" });

        if (!response.ok) {
          throw new Error("Failed to create preference");
        }

        const data = await response.json();
        setPreferenceId(data.preferenceId); // Set the preferenceId
      } catch (error) {
        console.error("Error fetching preference ID:", error);
      }
    };

    fetchPreferenceId();
  }, []);

  useEffect(() => {
    if (preferenceId && !isWidgetInitialized.current) {
      // Ensure the widget is only initialized once
      const mp = new window.MercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY, {
        locale: "pt-BR",
      });

      mp.bricks()
        .create("wallet", "wallet_container", {
          initialization: {
            preferenceId: preferenceId, // Set preferenceId
          },
        })
        .catch((err) => console.error("Error initializing MercadoPago widget:", err));

      isWidgetInitialized.current = true; // Mark the widget as initialized
    }
  }, [preferenceId]);

  return (
    <div>
      <h1>Checkout</h1>
      <div style={{maxWidth: '200px'}}>
      <div id="wallet_container"></div>
      </div>
    </div>
  );
};

export default MercadoPagoWidget;
