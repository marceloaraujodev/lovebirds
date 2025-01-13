import EditPage from '../components/EditPage/EditPage.jsx';

export default async function EditCouplesDetails(){

  const hash = '900e1c14-88d9-46a6-afbd-7152b3b64006';
  // does not work with relative urls in the server components
  const res = await fetch(`http://localhost:3000/api/userprofile/getuser/${hash}`, {
    cache: 'no-store', // Prevent caching for dynamic data
  });

  if (!res.ok) throw new Error('Failed to fetch data');

  const data = await res.json();

  // console.log('this is data from server component', data);

  return (
    <>
    <EditPage data={data} />
    </>
  )
}