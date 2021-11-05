export default function Meta({ title, description, image = null }) {
  if (image == null) {
    image = process.env.NEXT_PUBLIC_DOMAIN + '/icons/logo.png'
  }

  return (
    <>
      <meta property='og:title' content={title} />
      <meta name='twitter:title' content={title} />

      <meta name='description' content={description} />
      <meta property='og:description' content={description} />
      <meta name='twitter:description' content={description} />

      <meta name='twitter:image' content={image} />
      <meta property='og:image' content={image} />
    </>
  )
}
