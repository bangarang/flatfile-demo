export async function getStaticProps() {
  return {
    props: {},
    revalidate: 200,
  }
}

export default function NotFound() {
  return (
    <>
      <div>404 PAGE</div>
    </>
  )
}
