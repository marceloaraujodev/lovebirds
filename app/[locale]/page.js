'use client';
import Form from '../components/Form/Form';
import Instructions from '../components/Instructions/Instructions';
import Example from '../components/Example/Example';
import Faq from '../components/Faq/Faq';
import Features from '../components/Features/Features';
import Testimonials from '../components/Testimonials/Testimonials';

export default function Home() {
  return (
    <div>
      <Form />
      <Instructions />
      <Features />
      <Example />
      <Testimonials />
      <Faq />
      {/* <Prints /> */}
    </div>
  );
}
