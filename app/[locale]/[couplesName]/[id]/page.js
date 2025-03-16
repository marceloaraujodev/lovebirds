import CouplesPage from "@/app/components/CouplesPage/CouplesPage";

export default function page({params}) {
  const { couplesName, id } = params;
  return (
    <div>
      <CouplesPage couplesName={couplesName} id={id} />
    </div>
  )
}
