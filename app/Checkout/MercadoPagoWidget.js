'use client'; // Make sure to include this to enable client-side code execution
import { useEffect, useState, useRef } from 'react';
import dotenv from 'dotenv';
dotenv.config();

const MercadoPagoWidget = ({createPageSubmit}) => {
  const [preferenceId, setPreferenceId] = useState(null);
  const isWidgetInitialized = useRef(false);
  // console.log( process.env.NEXT_PUBLIC_MERCADO_PAGO_TEST_PUBLIC_KEY);

  useEffect(() => {
    const fetchPreferenceId = async () => {
      try {
        // Call backend API to create preference
        // const response = await fetch('/api/mercadopago/createbtn', { method: 'POST' });
        const response = await fetch('/api/mercadopago/createbtn', { method: 'POST' });

        if (!response.ok) {
          throw new Error('Failed to create preference');
        }

        const data = await response.json();
        setPreferenceId(data.preferenceId); // Set the preferenceId
      } catch (error) {
        console.error('Error fetching preference ID:', error);
      }
    };

    fetchPreferenceId();
  }, []);

  useEffect(() => {
    if (preferenceId && !isWidgetInitialized.current) {
      // Ensure the widget is only initialized once
      const mp = new window.MercadoPago(
        process.env.NEXT_PUBLIC_MERCADO_PAGO_TEST_PUBLIC_KEY,
        {
          locale: 'pt-BR',
        }
      );

      mp.bricks()
        .create('wallet', 'wallet_container', {
          initialization: {
            preferenceId: preferenceId, // Set preferenceId
          },
        })
        .catch((err) =>
          console.error('Error initializing MercadoPago widget:', err)
        );
        console.log('preferenceId from mercadopago widget', preferenceId);
      isWidgetInitialized.current = true; // Mark the widget as initialized
    }
  }, [preferenceId]);


  const handleCustomButtonClick = () => {
    // Trigger MercadoPago's button click functionality
    const mpButton = document.querySelector(
      '.svelte-h6o0kp.mercadopago-color-2OUiJu'
    );
    if (mpButton) {
      mpButton.click(); // Simulate click on the hidden MercadoPago button
      createPageSubmit();
    }
  };

  return (
    <>
      <div style={{ position: 'relative', height: '70px',  }}>
        <button
          onClick={handleCustomButtonClick}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 10, // Ensure this is above the MercadoPago button
            backgroundColor: 'rgb(44, 44, 44)', // Custom color
            color: '#fff',
            borderRadius: '8px',
            fontSize: '2rem',
            padding: '5px 20px',
            border: '2px solid rgb(255, 0, 255)',
            cursor: 'pointer',
            height: '70px',
            fontWeight: '600'
          }}>
          Criar Página
        </button>
      </div>
      
        <div style={{ position: "absolute", visibility: 'hidden', height: '10px' }} id="wallet_container"></div>
    </>
  );
};

export default MercadoPagoWidget;

