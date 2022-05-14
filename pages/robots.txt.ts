import process from 'process'

const Robots = () => {}

export const getServerSideProps = async ({ res }) => {
  const uri =
    'NEXT_PUBLIC_DOMAIN' in process.env
      ? process.env.NEXT_PUBLIC_DOMAIN
      : 'https://theindex.moe'

  let robots =
    'User-agent: *\n' +
    'Disallow: /api\n' +
    'Allow: /api/item/screenshot\n' +
    'Disallow: /search\n' +
    'Disallow: /admin\n' +
    'Disallow: /edit\n' +
    'Sitemap: ' +
    uri +
    '/sitemap.txt\n'

  res.setHeader('Content-Type', 'text/plain')
  res.write(robots)
  res.end()

  return {
    props: {},
  }
}

export default Robots
