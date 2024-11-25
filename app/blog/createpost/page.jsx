'use client'
import { useForm } from 'react-hook-form';
import c from './CreatePost.module.css';

export default function CreatePost() {
  const { register, handleSubmit, reset, setValue, getValues } = useForm();

  function onSubmit(data){
    console.log(data);
  }

  return (
    <>
    <div>
      

    <form onSubmit={handleSubmit(onSubmit)} className={c.form}>
      <label className={c.label}>Title:
      <input
        {...register('title', { required: true })}
        type="text"
        placeholder="title"
        />
      </label>
      <label className={c.label}>Cost:
      <input
        {...register('cost', { required: true })}
        type="text"
        placeholder="cost"
        />
      </label>

      <label className={c.label}>Cost:
      <input
        {...register('file', { required: true })}
        type="file"
        />
      </label>


      <label className={c.label}>Description:
      <textarea
        {...register('description', { required: true })}
        type="text"
        placeholder="description"
        />
      </label>

      <button type='submit' className={c.btn}>Submit</button>
    </form>
    </div>
    </>
  )
}