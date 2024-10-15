'use client'
import Form from "./components/Form/Form";
import Instructions from "./components/Instructions/Instructions";
import Example from "./components/Example/Example";
import Faq from "./components/Faq/Faq";
import Prints from "./components/Prints/Prints";


export default function Home() {
  return (
    <div >
     <Form />
     <Instructions />
     <Example />
     <Faq />
     {/* <Prints /> */}
    </div>
  );
}
