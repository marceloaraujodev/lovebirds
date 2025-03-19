import EditPage from '../components/EditPage/EditPage.jsx';

export default async function EditCouplesDetails(){

  // pass the hash for the user to be edited
  const hash = '2a183a4d-0f72-48e6-8801-a351f913240d';
  // does not work with relative urls in the server components
  const res = await fetch(`http://localhost:3000/api/userprofile/user/${hash}`, {
    cache: 'no-store', // Prevent caching for dynamic data
  });

  if (!res.ok) throw new Error('Failed to fetch data');

  const data = await res.json();

  // console.log('this is data from server component', data);

  return (
    <>
    {/* turn it on to edit users page */}
    {/* <EditPage data={data} /> */}
    </>
  )
}