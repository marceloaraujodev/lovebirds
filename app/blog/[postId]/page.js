'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import c from './Post.module.css';
export default function Post() {
  const [post, setPost] = useState([]);
  const params = useParams();


  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`/api/posts/${params.postId}`);
      setPost(response.data.post);
    };
    fetchData();
  }, []);


  return (
    <div className={c.cont}>
      
      {post && (
        <>
          <h1>{post.title}</h1>

          <p>
            Presentear alguém é sobre criar momentos especiais, pessoais e
            inesquecíveis. Com o <strong>QRCodeLove.com</strong>, você pode
            transformar suas mensagens carinhosas, memórias e surpresas em
            experiências digitais únicas. Aqui estão algumas ideias de presentes
            onde você pode usar o QRCodeLove para surpreender alguém que ama:
          </p>

          <section className={c.section}>
            <img
              className={`${c.img} ${c.left}`}
              src={post.image}
              alt="imagens do post"
            />
            <span className={c.title}>{post.headline}</span>
            {post.cost ? <p>Custo de até: R${post.cost}</p> : null}

            <h3>O melhor presente!</h3>

            <p>{post.description}</p>
          </section>

          <div className={c.explanation}>
            <h3>Como Funciona?</h3>
            <p>
              Basta fazer o upload das fotos, escolher uma música, escrever uma
              mensagem pessoal e o QRCodeLove vai gerar um QR code exclusivo
              para você presentear. É uma maneira rápida, divertida e
              personalizada de tornar o dia de alguém ainda mais especial. Seja
              para surpreender alguém especial ou quebrar o gelo com uma nova
              pessoa, o QRCodeLove oferece as ferramentas para criar algo
              verdadeiramente inesquecível.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
